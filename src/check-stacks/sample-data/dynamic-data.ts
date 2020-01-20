import { CloudFormation } from 'aws-sdk';

export const deletableStack: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date('December 17, 2019 03:24:00'),
  Capabilities: [],
  StackName: 'myteststack',
  StackStatus: 'CREATE_COMPLETE',
  DisableRollback: false
};

export const notStaleCreate: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date(),
  Capabilities: [],
  StackName: 'myteststack',
  StackStatus: 'CREATE_COMPLETE',
  DisableRollback: false
};

export const notStaleUpdate: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date('December 17, 2019 03:24:00'),
  LastUpdatedTime: new Date(),
  Capabilities: [],
  StackName: 'myteststack',
  StackStatus: 'UPDATE_COMPLETE',
  DisableRollback: false
};

export const retainName: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date('December 17, 2019 03:24:00'),
  Capabilities: [],
  StackName: 'AWSControlTowerBP-BASELINE-CLOUDTRAIL-MASTER',
  StackStatus: 'CREATE_COMPLETE',
  DisableRollback: false
};

export const retainStatus: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date('December 17, 2019 03:24:00'),
  Capabilities: [],
  StackName: 'myteststack',
  StackStatus: 'UPDATE_IN_PROGRESS',
  DisableRollback: false
};

export const retainStage: CloudFormation.Stack = {
  StackId: 'arn:aws:cloudformation:us-east-1:123456789012:stack/myteststack/466df9e0-0dff-08e3-8e2f-5088487c4896',
  Description:
    'AWS CloudFormation Sample Template S3_Bucket: Sample template showing how to create a publicly accessible S3 bucket. **WARNING** This template creates an S3 bucket. You will be billed for the AWS resources used if you create a stack from this template.',
  Tags: [
    {
      Key: 'stage',
      Value: 'prod'
    }
  ],
  Outputs: [
    {
      Description: 'Name of S3 bucket to hold website content',
      OutputKey: 'BucketName',
      OutputValue: 'myteststack-s3bucket-jssofi1zie2w'
    }
  ],
  StackStatusReason: null,
  CreationTime: new Date('December 17, 2019 03:24:00'),
  Capabilities: [],
  StackName: 'myteststack',
  StackStatus: 'CREATE_COMPLETE',
  DisableRollback: false
};

export const describeStacksOutput: CloudFormation.DescribeStacksOutput = {
  Stacks: [deletableStack]
};
