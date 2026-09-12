#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {
  NAME_PREFIX,
  optionalHostedZoneId,
  requireDomain,
  STACK_NAME,
} from '../src/config';
import { NodiClassStack } from '../src/stacks/nodi-class-stack';

/** SES·Dynamo·Lambda all stay in Seoul (PLAN §7.2 · §9.1). */
const AWS_REGION = 'ap-northeast-2';

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

const account = process.env.CDK_DEFAULT_ACCOUNT;
const stackEnv =
  account != null
    ? { account, region: AWS_REGION }
    : { region: AWS_REGION };

new NodiClassStack(app, 'NodiClassStack', {
  stackName: STACK_NAME,
  domain,
  hostedZoneId,
  enableCustomDomain,
  notifyEmail,
  env: stackEnv,
  description: `Nodi class infra (${NAME_PREFIX}, ${AWS_REGION})`,
});

app.synth();
