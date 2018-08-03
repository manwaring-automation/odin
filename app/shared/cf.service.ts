import { CloudFormation } from 'aws-sdk';
import { log } from './logger';

const cf = new CloudFormation({ apiVersion: '2010-05-15' });

export function listAllStacks(): Promise<CloudFormation.Stack[]> {
  const params = {};
  return cf
    .describeStacks(params)
    .promise()
    .then(response => response.Stacks);
}

export async function getBucketsToEmpty(stackName: string): Promise<string[]> {
  const stack = await getStack(stackName);
  return await getBuckets(stack);
}

export function deleteStack(stack): Promise<any> {
  const params = { StackName: stack };
  log.debug('Deleting stack with params', params);
  return cf.deleteStack(params).promise();
}

function getBuckets(stack: CloudFormation.Stack): Promise<string[]> {
  log.debug('Getting buckets to empty for stack', stack);
  let bucketsToEmpty: string[] = [];
  const cloudFormationBucketKey = process.env.BUCKETS_TO_EMPTY;
  if (stack.Outputs && stack.Outputs.length > 0) {
    bucketsToEmpty = stack.Outputs.filter(output => cloudFormationBucketKey.indexOf(output.OutputKey) > -1).map(
      output => output.OutputValue
    );
  }
  return Promise.resolve(bucketsToEmpty);
}

function getStack(stackName: string): Promise<CloudFormation.Stack> {
  const params: CloudFormation.DescribeStacksInput = { StackName: stackName };
  return cf
    .describeStacks(params)
    .promise()
    .then(res => res.Stacks[0]);
}
