import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from 'aws-cdk-lib';
import {
  ApiMapping,
  CorsHttpMethod,
  DomainName,
  HttpApi,
  HttpMethod,
  HttpStage,
} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
  AttributeType,
  BillingMode,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import {
  ARecord,
  CfnRecordSet,
  HostedZone,
  type IHostedZone,
  RecordTarget,
  TxtRecord,
} from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';
import {
  ConfigurationSet,
  DkimIdentity,
  EmailIdentity,
  EmailSendingEvent,
  EventDestination,
  Identity,
} from 'aws-cdk-lib/aws-ses';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';
import { NAME_PREFIX, ssmPath } from '../config';

function findRepoRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.resolve(process.cwd(), '..');
}

export interface NodiClassStackProps extends StackProps {
  domain: string;
  /** When set, skips Route53 fromLookup (synth without AWS credentials). */
  hostedZoneId?: string;
  /** When set with hostedZoneId, enables api.<domain> custom domain. */
  enableCustomDomain?: boolean;
  notifyEmail?: string;
}

export class NodiClassStack extends Stack {
  readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: NodiClassStackProps) {
    super(scope, id, props);

    const {
      domain,
      hostedZoneId,
      enableCustomDomain = Boolean(hostedZoneId),
      notifyEmail = 'contact@cascades.studio',
    } = props;

    // --- DynamoDB ---
    const subscribersTable = new Table(this, 'Subscribers', {
      tableName: `${NAME_PREFIX}-subscribers`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
    });
    subscribersTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
    });

    const inquiriesTable = new Table(this, 'Inquiries', {
      tableName: `${NAME_PREFIX}-inquiries`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
    });
    inquiriesTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
    });

    const eventsTable = new Table(this, 'Events', {
      tableName: `${NAME_PREFIX}-events`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
      timeToLiveAttribute: 'ttl',
    });

    const resourcesTable = new Table(this, 'Resources', {
      tableName: `${NAME_PREFIX}-resources`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
    });
    resourcesTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
    });

    // --- SES / Route53 mail ---
    const mailDomain = `mail.${domain}`;

    const hostedZone: IHostedZone = hostedZoneId
      ? HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
          hostedZoneId,
          zoneName: domain,
        })
      : HostedZone.fromLookup(this, 'HostedZone', {
          domainName: domain,
        });

    const bounceComplaintTopic = new Topic(this, 'SesBounceComplaint', {
      topicName: `${NAME_PREFIX}-ses-bounce-complaint`,
      displayName: 'Nodi SES bounce/complaint',
    });

    const configurationSet = new ConfigurationSet(this, 'Transactional', {
      configurationSetName: `${NAME_PREFIX}-transactional`,
    });
    configurationSet.addEventDestination('BounceComplaint', {
      destination: EventDestination.snsTopic(bounceComplaintTopic),
      events: [EmailSendingEvent.BOUNCE, EmailSendingEvent.COMPLAINT],
    });

    // Identity.domain does not auto-wire DKIM into Route53 (only
    // Identity.publicHostedZone does, and that verifies the apex). Create
    // Easy DKIM CNAMEs explicitly for mail.<domain>.
    const emailIdentity = new EmailIdentity(this, 'MailIdentity', {
      identity: Identity.domain(mailDomain),
      dkimIdentity: DkimIdentity.easyDkim(),
      configurationSet,
    });

    const dkimTokens: Array<{ name: string; value: string }> = [
      {
        name: emailIdentity.dkimDnsTokenName1,
        value: emailIdentity.dkimDnsTokenValue1,
      },
      {
        name: emailIdentity.dkimDnsTokenName2,
        value: emailIdentity.dkimDnsTokenValue2,
      },
      {
        name: emailIdentity.dkimDnsTokenName3,
        value: emailIdentity.dkimDnsTokenValue3,
      },
    ];
    dkimTokens.forEach((token, index) => {
      new CfnRecordSet(this, `DkimDnsToken${index + 1}`, {
        hostedZoneId: hostedZone.hostedZoneId,
        name: token.name,
        type: 'CNAME',
        resourceRecords: [token.value],
        ttl: '1800',
      });
    });

    new TxtRecord(this, 'MailSpf', {
      zone: hostedZone,
      recordName: mailDomain,
      values: ['v=spf1 include:amazonses.com ~all'],
    });

    new TxtRecord(this, 'MailDmarc', {
      zone: hostedZone,
      recordName: `_dmarc.${mailDomain}`,
      values: ['v=DMARC1; p=none;'],
    });

    // --- API / Lambdas ---
    const siteUrl = `https://${domain}`;
    const siteUrlWww = `https://www.${domain}`;
    const mailFrom = `노디 AI 클래스 <hello@mail.${domain}>`;
    const gateSecretParam = ssmPath('GATE_SECRET');
    const turnstileSecretParam = ssmPath('TURNSTILE_SECRET');
    const adminApiKeyParam = ssmPath('ADMIN_API_KEY');
    const slackInquiryWebhookParam = ssmPath('SLACK_INQUIRY_WEBHOOK_URL');
    const bizInfoParam = ssmPath('BIZ_INFO');

    const gateSecret = StringParameter.fromSecureStringParameterAttributes(
      this,
      'GateSecret',
      { parameterName: gateSecretParam, version: 1 },
    );
    const turnstileSecret = StringParameter.fromSecureStringParameterAttributes(
      this,
      'TurnstileSecret',
      { parameterName: turnstileSecretParam, version: 1 },
    );
    const adminApiKey = StringParameter.fromSecureStringParameterAttributes(
      this,
      'AdminApiKey',
      { parameterName: adminApiKeyParam, version: 1 },
    );
    const slackInquiryWebhook = StringParameter.fromSecureStringParameterAttributes(
      this,
      'SlackInquiryWebhook',
      { parameterName: slackInquiryWebhookParam, version: 1 },
    );

    const repoRoot = findRepoRoot();
    const handlersDir = path.join(repoRoot, 'services/api/src/handlers');
    const logRetention = RetentionDays.THREE_MONTHS;

    const commonEnv: Record<string, string> = {
      SUBSCRIBERS_TABLE: subscribersTable.tableName,
      INQUIRIES_TABLE: inquiriesTable.tableName,
      EVENTS_TABLE: eventsTable.tableName,
      RESOURCES_TABLE: resourcesTable.tableName,
      // SecureString cannot be {{resolve:ssm-secure}} into Lambda env (CFN).
      // Pass parameter names; handlers fetch WithDecryption at runtime.
      GATE_SECRET_PARAM: gateSecretParam,
      TURNSTILE_SECRET_PARAM: turnstileSecretParam,
      ADMIN_API_KEY_PARAM: adminApiKeyParam,
      SITE_URL: siteUrl,
      MAIL_FROM: mailFrom,
      NOTIFY_EMAIL: notifyEmail,
      SES_CONFIGURATION_SET: configurationSet.configurationSetName,
      MAIL_REPLY_TO: 'contact@cascades.studio',
      BIZ_INFO_PARAM: bizInfoParam,
    };

    const makeFn = (name: string, file: string): NodejsFunction => {
      const logGroup = new LogGroup(this, `${name}Logs`, {
        retention: logRetention,
        removalPolicy: RemovalPolicy.RETAIN,
      });

      const fn = new NodejsFunction(this, name, {
        functionName: `${NAME_PREFIX}-${name
          .replace(/Fn$/, '')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase()}`,
        entry: path.join(handlersDir, file),
        handler: 'handler',
        runtime: Runtime.NODEJS_22_X,
        architecture: Architecture.ARM_64,
        memorySize: 256,
        timeout: Duration.seconds(10),
        tracing: Tracing.ACTIVE,
        logGroup,
        environment: { ...commonEnv },
        projectRoot: repoRoot,
        depsLockFilePath: path.join(repoRoot, 'pnpm-lock.yaml'),
        bundling: {
          minify: true,
          sourceMap: true,
          target: 'node22',
          format: OutputFormat.CJS,
          mainFields: ['module', 'main'],
        },
      });

      subscribersTable.grantReadWriteData(fn);
      inquiriesTable.grantReadWriteData(fn);
      eventsTable.grantReadWriteData(fn);
      gateSecret.grantRead(fn);
      turnstileSecret.grantRead(fn);
      adminApiKey.grantRead(fn);
      fn.addToRolePolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        }),
      );
      return fn;
    };

    const subscribeFn = makeFn('SubscribeFn', 'subscribe.ts');
    const confirmFn = makeFn('ConfirmFn', 'confirm.ts');
    const inquiryFn = makeFn('InquiryFn', 'inquiry.ts');
    inquiryFn.addEnvironment(
      'SLACK_INQUIRY_WEBHOOK_URL_PARAM',
      slackInquiryWebhookParam,
    );
    slackInquiryWebhook.grantRead(inquiryFn);
    const unsubscribeFn = makeFn('UnsubscribeFn', 'unsubscribe.ts');
    const sesEventsFn = makeFn('SesEventsFn', 'ses-events.ts');
    const resourcesListFn = makeFn('ResourcesListFn', 'resources-list.ts');
    const resourcesGetFn = makeFn('ResourcesGetFn', 'resources-get.ts');
    const resourcesPutFn = makeFn('ResourcesPutFn', 'resources-put.ts');

    resourcesTable.grantReadData(resourcesListFn);
    resourcesTable.grantReadData(resourcesGetFn);
    resourcesTable.grantReadWriteData(resourcesPutFn);

    bounceComplaintTopic.addSubscription(new LambdaSubscription(sesEventsFn));

    const httpApi = new HttpApi(this, 'HttpApi', {
      apiName: `${NAME_PREFIX}-api`,
      createDefaultStage: false,
      corsPreflight: {
        allowOrigins: [siteUrl, siteUrlWww],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PUT,
          CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['content-type', 'x-admin-key'],
        maxAge: Duration.days(1),
      },
    });

    httpApi.addRoutes({
      path: '/subscribe',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('SubscribeInt', subscribeFn),
    });
    httpApi.addRoutes({
      path: '/confirm',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('ConfirmInt', confirmFn),
    });
    httpApi.addRoutes({
      path: '/inquiry',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('InquiryInt', inquiryFn),
    });
    httpApi.addRoutes({
      path: '/unsubscribe',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('UnsubscribeInt', unsubscribeFn),
    });
    httpApi.addRoutes({
      path: '/internal/ses-events',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration('SesEventsInt', sesEventsFn),
    });
    httpApi.addRoutes({
      path: '/resources',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('ResourcesListInt', resourcesListFn),
    });
    httpApi.addRoutes({
      path: '/resources/{slug}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('ResourcesGetInt', resourcesGetFn),
    });
    httpApi.addRoutes({
      path: '/resources/{slug}',
      methods: [HttpMethod.PUT],
      integration: new HttpLambdaIntegration('ResourcesPutInt', resourcesPutFn),
    });

    const stage = new HttpStage(this, 'DefaultStage', {
      httpApi,
      stageName: '$default',
      autoDeploy: true,
      throttle: { rateLimit: 5, burstLimit: 10 },
    });

    let baseUrl = stage.url.replace(/\/$/, '');

    if (enableCustomDomain && hostedZoneId) {
      const apiDomainName = `api.${domain}`;
      const cert = new Certificate(this, 'ApiCert', {
        domainName: apiDomainName,
        validation: CertificateValidation.fromDns(hostedZone),
      });
      const domainName = new DomainName(this, 'ApiDomainName', {
        domainName: apiDomainName,
        certificate: cert,
      });
      new ApiMapping(this, 'ApiMapping', {
        api: httpApi,
        domainName,
        stage,
      });
      new ARecord(this, 'ApiAlias', {
        zone: hostedZone,
        recordName: 'api',
        target: RecordTarget.fromAlias(
          new ApiGatewayv2DomainProperties(
            domainName.regionalDomainName,
            domainName.regionalHostedZoneId,
          ),
        ),
      });
      baseUrl = `https://${apiDomainName}`;
    }

    subscribeFn.addEnvironment('API_URL', baseUrl);
    confirmFn.addEnvironment('API_URL', baseUrl);

    this.apiUrl = baseUrl;

    new CfnOutput(this, 'SubscribersTableName', {
      value: subscribersTable.tableName,
    });
    new CfnOutput(this, 'InquiriesTableName', {
      value: inquiriesTable.tableName,
    });
    new CfnOutput(this, 'EventsTableName', {
      value: eventsTable.tableName,
    });
    new CfnOutput(this, 'ResourcesTableName', {
      value: resourcesTable.tableName,
    });
    new CfnOutput(this, 'MailDomain', { value: mailDomain });
    new CfnOutput(this, 'ConfigurationSetName', {
      value: configurationSet.configurationSetName,
    });
    new CfnOutput(this, 'BounceComplaintTopicArn', {
      value: bounceComplaintTopic.topicArn,
    });
    new CfnOutput(this, 'ApiUrl', { value: this.apiUrl });
  }
}
