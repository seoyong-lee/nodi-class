import { Stack, type StackProps } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import type { NodiEnv } from '../config';

export interface NodiWebStackProps extends StackProps {
  nodiEnv: NodiEnv;
}

/** Step 1 hosting is Amplify console; CDK stack left empty (PLAN.md §9.1). */
export class NodiWebStack extends Stack {
  constructor(scope: Construct, id: string, props: NodiWebStackProps) {
    super(scope, id, props);
  }
}
