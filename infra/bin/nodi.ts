#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {
  optionalHostedZoneId,
  requireDomain,
  requireNodiEnv,
} from '../src/config';
import { NodiApiStack } from '../src/stacks/nodi-api-stack';
import { NodiDataStack } from '../src/stacks/nodi-data-stack';
import { NodiMailStack } from '../src/stacks/nodi-mail-stack';
import { NodiWebStack } from '../src/stacks/nodi-web-stack';

const app = new cdk.App();
const nodiEnv = requireNodiEnv(app);
const domain = requireDomain(app);
const hostedZoneId = optionalHostedZoneId(app);
const enableCustomDomain =
  app.node.tryGetContext('enableCustomDomain') === true ||
  app.node.tryGetContext('enableCustomDomain') === 'true';
const notifyEmail =
  (app.node.tryGetContext('notifyEmail') as string | undefined) ??
  process.env.NOTIFY_EMAIL ??
  'contact@cascades.studio';

const awsEnv =
  process.env.CDK_DEFAULT_ACCOUNT && process.env.CDK_DEFAULT_REGION
    ? {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      }
    : undefined;

// fromLookup requires account+region on the stack; attributes path does not.
const mailEnv =
  hostedZoneId != null
    ? awsEnv
    : {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      };

const data = new NodiDataStack(app, 'NodiDataStack', {
  stackName: `NodiDataStack-${nodiEnv}`,
  nodiEnv,
  env: awsEnv,
  description: `Nodi DynamoDB tables (${nodiEnv})`,
});

const mail = new NodiMailStack(app, 'NodiMailStack', {
  stackName: `NodiMailStack-${nodiEnv}`,
  nodiEnv,
  domain,
  hostedZoneId,
  env: mailEnv,
  description: `Nodi SES mail identity + DNS (${nodiEnv})`,
});

new NodiApiStack(app, 'NodiApiStack', {
  stackName: `NodiApiStack-${nodiEnv}`,
  nodiEnv,
  domain,
  subscribersTable: data.subscribersTable,
  inquiriesTable: data.inquiriesTable,
  eventsTable: data.eventsTable,
  configurationSetName: mail.configurationSet.configurationSetName,
  bounceComplaintTopic: mail.bounceComplaintTopic,
  hostedZoneId,
  enableCustomDomain,
  notifyEmail,
  env: awsEnv,
  description: `Nodi HTTP API + Lambdas (${nodiEnv})`,
});

new NodiWebStack(app, 'NodiWebStack', {
  stackName: `NodiWebStack-${nodiEnv}`,
  nodiEnv,
  env: awsEnv,
  description: `Nodi web hosting placeholder (${nodiEnv})`,
});

app.synth();
