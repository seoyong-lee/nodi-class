import { CfnOutput, Stack, type StackProps } from 'aws-cdk-lib';
import {
  CfnRecordSet,
  HostedZone,
  type IHostedZone,
  TxtRecord,
} from 'aws-cdk-lib/aws-route53';
import {
  ConfigurationSet,
  DkimIdentity,
  EmailIdentity,
  EmailSendingEvent,
  EventDestination,
  Identity,
} from 'aws-cdk-lib/aws-ses';
import { Topic } from 'aws-cdk-lib/aws-sns';
import type { Construct } from 'constructs';
import type { NodiEnv } from '../config';

export interface NodiMailStackProps extends StackProps {
  nodiEnv: NodiEnv;
  domain: string;
  /** When set, skips Route53 fromLookup (synth without AWS credentials). */
  hostedZoneId?: string;
}

export class NodiMailStack extends Stack {
  readonly configurationSet: ConfigurationSet;
  readonly bounceComplaintTopic: Topic;
  readonly emailIdentity: EmailIdentity;

  constructor(scope: Construct, id: string, props: NodiMailStackProps) {
    super(scope, id, props);

    const { nodiEnv, domain, hostedZoneId } = props;
    const mailDomain = `mail.${domain}`;

    const hostedZone: IHostedZone = hostedZoneId
      ? HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
          hostedZoneId,
          zoneName: domain,
        })
      : HostedZone.fromLookup(this, 'HostedZone', {
          domainName: domain,
        });

    this.bounceComplaintTopic = new Topic(this, 'SesBounceComplaint', {
      topicName: `nodi-ses-bounce-complaint-${nodiEnv}`,
      displayName: `Nodi SES bounce/complaint (${nodiEnv})`,
    });

    this.configurationSet = new ConfigurationSet(this, 'Transactional', {
      configurationSetName: `nodi-transactional-${nodiEnv}`,
    });
    this.configurationSet.addEventDestination('BounceComplaint', {
      destination: EventDestination.snsTopic(this.bounceComplaintTopic),
      events: [EmailSendingEvent.BOUNCE, EmailSendingEvent.COMPLAINT],
    });

    // Identity.domain does not auto-wire DKIM into Route53 (only
    // Identity.publicHostedZone does, and that verifies the apex). Create
    // Easy DKIM CNAMEs explicitly for mail.<domain>.
    this.emailIdentity = new EmailIdentity(this, 'MailIdentity', {
      identity: Identity.domain(mailDomain),
      dkimIdentity: DkimIdentity.easyDkim(),
      configurationSet: this.configurationSet,
    });

    const dkimTokens: Array<{ name: string; value: string }> = [
      {
        name: this.emailIdentity.dkimDnsTokenName1,
        value: this.emailIdentity.dkimDnsTokenValue1,
      },
      {
        name: this.emailIdentity.dkimDnsTokenName2,
        value: this.emailIdentity.dkimDnsTokenValue2,
      },
      {
        name: this.emailIdentity.dkimDnsTokenName3,
        value: this.emailIdentity.dkimDnsTokenValue3,
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

    new CfnOutput(this, 'MailDomain', { value: mailDomain });
    new CfnOutput(this, 'ConfigurationSetName', {
      value: this.configurationSet.configurationSetName,
    });
    new CfnOutput(this, 'BounceComplaintTopicArn', {
      value: this.bounceComplaintTopic.topicArn,
    });
  }
}
