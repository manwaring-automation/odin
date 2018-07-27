import { SNSEvent, Callback, Context, Handler } from 'aws-lambda';
import { CloudFormation, S3 } from 'aws-sdk';
import * as log from 'winston';
log.configure({ level: process.env.LOG_LEVEL });

const cloudFormation = new CloudFormation({ apiVersion: '2010-05-15' });
const s3 = new S3({ apiVersion: '2006-03-01' });

export const handler: Handler = (event: SNSEvent, context: Context, callback: Callback) => {
  const config = getStackConfig(event);
  log.debug('Received event to delete stack', config);
  log.info(`Odin has a seat in Valhalla ready for the ${config.stack} stack`);

  getStack(config.stack)
    .then(getBucketsToEmpty)
    .then(emptyBuckets)
    .then(results => deleteStack(config.stack))
    .then(stack => callback(null, `Successfully deleted stack ${stack}`))
    .catch(err => callback(err));
};

function getStackConfig(event: SNSEvent): any {
  return JSON.parse(event.Records[0].Sns.Message);
}

function getStack(stackName: string): Promise<CloudFormation.Stack> {
  const params: CloudFormation.DescribeStacksInput = { StackName: stackName };
  return cloudFormation
    .describeStacks(params)
    .promise()
    .then(res => res.Stacks[0]);
}

function getBucketsToEmpty(stack: CloudFormation.Stack): Promise<string[]> {
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

function emptyBuckets(bucketNames: string[]): Promise<any> {
  log.debug('Emptying buckets', bucketNames);
  return bucketNames.length ? Promise.all(bucketNames.map(bucketName => emptyBucket(bucketName))) : Promise.resolve('');
}

function emptyBucket(bucketName: string) {
  log.debug('Emptying bucket', bucketName);
  return getAllObjects(bucketName)
    .then(objects => getAllVersions(bucketName, objects))
    .then(versions => deleteAllVersions(bucketName, versions));
}

async function getAllObjects(bucketName: string): Promise<S3.Object[]> {
  let objects: S3.Object[] = [];
  let result: S3.ListObjectsV2Output;
  do {
    let params: S3.ListObjectsV2Request = { Bucket: bucketName };
    if (result.IsTruncated) {
      params['ContinuationToken'] = result.NextContinuationToken;
    }
    log.debug('Listing objects with params', params);
    result = await s3.listObjectsV2(params).promise();
    objects = [...objects, ...result.Contents];
  } while (result.IsTruncated);
  return objects;
}

async function getAllVersions(bucketName: string, objects: S3.Object[]): Promise<S3.ObjectVersion[]> {
  const [...versions] = await Promise.all(objects.map(object => getAllObjectVersions(bucketName, object)));
  return versions.reduce((a, b) => [...a, ...b]);
}

async function getAllObjectVersions(bucketName: string, object: S3.Object): Promise<S3.ObjectVersion[]> {
  let objects: S3.ObjectVersion[] = [];
  let result: S3.ListObjectVersionsOutput;
  do {
    let params: S3.ListObjectVersionsRequest = { Bucket: bucketName, Prefix: object.Key };
    if (result.IsTruncated) {
      params['NextKeyMarker'] = result.NextKeyMarker;
      params['NextVersionIdMarker'] = result.NextVersionIdMarker;
    }
    log.debug('Listing object versions with params', params);
    result = await s3.listObjectVersions(params).promise();
    objects = [...objects, ...result.Versions];
  } while (result.IsTruncated);
  return objects;
}

function deleteAllVersions(bucketName: string, versions: S3.ObjectVersion[]) {
  let promises = [];
  while (versions.length > 1000) {
    promises.push(deleteVersions(bucketName, versions.splice(0, 999)));
  }
  promises.push(deleteVersions(bucketName, versions));
  return Promise.all([promises]);
}

function deleteVersions(bucketName: string, versions: S3.ObjectVersion[]) {
  const params = {
    Bucket: bucketName,
    Delete: {
      Objects: versions.map(version => {
        return { Key: version.Key, Version: version.VersionId };
      })
    }
  };
  log.debug('Deleting object versions with params', params);
  return versions.length ? s3.deleteObjects(params).promise() : Promise.resolve('');
}

function deleteStack(stack): Promise<any> {
  const params = { StackName: stack };
  log.debug('Deleting stack with params', params);
  return cloudFormation.deleteStack(params).promise();
}
