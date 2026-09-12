#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {
  NAME_PREFIX,
  optionalHostedZoneId,
  requireDomain,
  STACK_NAME,
} from '../src/config';
import { NodiClassStack } from '../src/stacks/nodi-class-stack';

const app = new cdk.App();
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
const stackEnv =
  hostedZoneId != null
    ? awsEnv
    : {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      };

new NodiClassStack(app, 'NodiClassStack', {
  stackName: STACK_NAME,
  domain,
  hostedZoneId,
  enableCustomDomain,
  notifyEmail,
  env: stackEnv,
  description: `Nodi class infra (${NAME_PREFIX})`,
});

app.synth();
