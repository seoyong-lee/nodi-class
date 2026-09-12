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
import type { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import {
  ARecord,
  HostedZone,
  type IHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';
import type { ITopic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';
import type { NodiEnv } from '../config';

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

export interface NodiApiStackProps extends StackProps {
  nodiEnv: NodiEnv;
  domain: string;
  subscribersTable: ITable;
  inquiriesTable: ITable;
  eventsTable: ITable;
  configurationSetName: string;
  bounceComplaintTopic: ITopic;
  /** When set, enables optional api.<domain> custom domain. */
  hostedZoneId?: string;
  enableCustomDomain?: boolean;
  notifyEmail?: string;
}

export class NodiApiStack extends Stack {
  readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: NodiApiStackProps) {
    super(scope, id, props);

    const {
      nodiEnv,
      domain,
      subscribersTable,
      inquiriesTable,
      eventsTable,
      configurationSetName,
      bounceComplaintTopic,
      hostedZoneId,
      enableCustomDomain = false,
      notifyEmail = 'contact@cascades.studio',
    } = props;

    const siteUrl = `https://${domain}`;
    const mailFrom = `노디 AI 클래스 <hello@mail.${domain}>`;
    const gateSecretParam = `/nodi/${nodiEnv}/GATE_SECRET`;
    const turnstileSecretParam = `/nodi/${nodiEnv}/TURNSTILE_SECRET`;

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

    const repoRoot = findRepoRoot();
    const handlersDir = path.join(repoRoot, 'services/api/src/handlers');
    const logRetention =
      nodiEnv === 'prod'
        ? RetentionDays.THREE_MONTHS
        : RetentionDays.TWO_WEEKS;

    const commonEnv: Record<string, string> = {
      SUBSCRIBERS_TABLE: subscribersTable.tableName,
      INQUIRIES_TABLE: inquiriesTable.tableName,
      EVENTS_TABLE: eventsTable.tableName,
      GATE_SECRET: StringParameter.valueForSecureStringParameter(
        this,
        gateSecretParam,
        1,
      ),
      TURNSTILE_SECRET: StringParameter.valueForSecureStringParameter(
        this,
        turnstileSecretParam,
        1,
      ),
      SITE_URL: siteUrl,
      MAIL_FROM: mailFrom,
      NOTIFY_EMAIL: notifyEmail,
      SES_CONFIGURATION_SET: configurationSetName,
      MAIL_REPLY_TO: 'contact@cascades.studio',
    };

    const makeFn = (name: string, file: string): NodejsFunction => {
      const logGroup = new LogGroup(this, `${name}Logs`, {
        retention: logRetention,
        removalPolicy:
          nodiEnv === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      });

      const fn = new NodejsFunction(this, name, {
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
    const unsubscribeFn = makeFn('UnsubscribeFn', 'unsubscribe.ts');
    const sesEventsFn = makeFn('SesEventsFn', 'ses-events.ts');

    bounceComplaintTopic.addSubscription(
      new LambdaSubscription(sesEventsFn),
    );

    const httpApi = new HttpApi(this, 'HttpApi', {
      apiName: `nodi-api-${nodiEnv}`,
      createDefaultStage: false,
      corsPreflight: {
        allowOrigins: [siteUrl],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['content-type'],
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

    const stage = new HttpStage(this, 'DefaultStage', {
      httpApi,
      stageName: '$default',
      autoDeploy: true,
      throttle: { rateLimit: 5, burstLimit: 10 },
    });

    let baseUrl = stage.url.replace(/\/$/, '');

    if (enableCustomDomain && hostedZoneId) {
      const hostedZone: IHostedZone = HostedZone.fromHostedZoneAttributes(
        this,
        'HostedZone',
        { hostedZoneId, zoneName: domain },
      );
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
    new CfnOutput(this, 'ApiUrl', { value: this.apiUrl });
  }
}
