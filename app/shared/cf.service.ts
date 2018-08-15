import { CloudFormation } from 'aws-sdk';

const cf = new CloudFormation({ apiVersion: '2010-05-15' });

export function listAllStacks(): Promise<CloudFormation.Stack[]> {
  const params = {};
  return cf
    .describeStacks(params)
    .promise()
    .then(response => response.Stacks);
}

export function deleteStack(stack): Promise<any> {
  const params = { StackName: stack };
  console.debug('Deleting stack with params', params);
  return cf.deleteStack(params).promise();
}

export async function getBucketsToEmpty(stackName: string): Promise<string[]> {
  return process.env.EMPTY_ALL_BUCKETS ? getAllBuckets(stackName) : getSpecifiedBuckets(stackName);
}

async function getAllBuckets(stackName: string): Promise<string[]> {
  const resources = await getStackResources(stackName);
  console.debug(resources);
  return resources
    .filter(resource => resource.ResourceType === 'AWS::S3::Bucket')
    .map(resource => resource.PhysicalResourceId);
}

async function getSpecifiedBuckets(stackName: string): Promise<string[]> {
  const stack: CloudFormation.Stack = await getStack(stackName);
  console.debug('Getting buckets to empty for stack', stack);
  let bucketsToEmpty: string[] = [];
  const cloudFormationBucketKey = process.env.BUCKETS_TO_EMPTY;
  if (stack.Outputs && stack.Outputs.length > 0) {
    bucketsToEmpty = stack.Outputs.filter(output => cloudFormationBucketKey.indexOf(output.OutputKey) > -1).map(
      output => output.OutputValue
    );
  }
  return bucketsToEmpty;
}

function getStack(StackName: string): Promise<CloudFormation.Stack> {
  const params: CloudFormation.DescribeStacksInput = { StackName };
  return cf
    .describeStacks(params)
    .promise()
    .then(res => res.Stacks[0]);
}

function getStackResources(StackName: string): Promise<CloudFormation.StackResourceSummaries> {
  const params: CloudFormation.ListStackResourcesInput = { StackName };
  return cf
    .listStackResources(params)
    .promise()
    .then(res => res.StackResourceSummaries);
}
