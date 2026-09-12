import {
  CfnOutput,
  RemovalPolicy,
  Stack,
  type StackProps,
} from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  Table,
} from 'aws-cdk-lib/aws-dynamodb';
import type { Construct } from 'constructs';
import type { NodiEnv } from '../config';

export interface NodiDataStackProps extends StackProps {
  nodiEnv: NodiEnv;
}

export class NodiDataStack extends Stack {
  readonly subscribersTable: Table;
  readonly inquiriesTable: Table;
  readonly eventsTable: Table;

  constructor(scope: Construct, id: string, props: NodiDataStackProps) {
    super(scope, id, props);

    const { nodiEnv } = props;
    const isProd = nodiEnv === 'prod';
    const removalPolicy = isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
    const pointInTimeRecoverySpecification = isProd
      ? { pointInTimeRecoveryEnabled: true }
      : undefined;

    this.subscribersTable = new Table(this, 'Subscribers', {
      tableName: `nodi-subscribers-${nodiEnv}`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification,
    });
    this.subscribersTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
    });

    this.inquiriesTable = new Table(this, 'Inquiries', {
      tableName: `nodi-inquiries-${nodiEnv}`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification,
    });
    this.inquiriesTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: AttributeType.STRING },
    });

    this.eventsTable = new Table(this, 'Events', {
      tableName: `nodi-events-${nodiEnv}`,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy,
      pointInTimeRecoverySpecification,
      timeToLiveAttribute: 'ttl',
    });

    new CfnOutput(this, 'SubscribersTableName', {
      value: this.subscribersTable.tableName,
    });
    new CfnOutput(this, 'SubscribersTableArn', {
      value: this.subscribersTable.tableArn,
    });
    new CfnOutput(this, 'InquiriesTableName', {
      value: this.inquiriesTable.tableName,
    });
    new CfnOutput(this, 'InquiriesTableArn', {
      value: this.inquiriesTable.tableArn,
    });
    new CfnOutput(this, 'EventsTableName', {
      value: this.eventsTable.tableName,
    });
    new CfnOutput(this, 'EventsTableArn', {
      value: this.eventsTable.tableArn,
    });
  }
}
