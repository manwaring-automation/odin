import {  SNSEvent, Callback, Context, Handler } from 'aws-lambda';
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
    .then( stack => callback(null, `Successfully deleted stack ${stack}`) )
    .catch( err => callback(err) );
};

function getStackConfig(event) {
  return JSON.parse(event.Records[0].Sns.Message);
};

function getStack(stackName): Promise<any> {
  const params = { StackName: stackName };
  return cloudFormation.describeStacks(params).promise()
          .then(res => res.Stacks[0]);
};

function getBucketsToEmpty(stack): Promise<any> {
  log.debug('Getting buckets to empty for stack', stack);
  let bucketsToEmpty = [];
  const cloudFormationBucketKey = process.env.BUCKETS_TO_EMPTY;
  if (stack.Outputs && stack.Outputs.length > 0) {
    bucketsToEmpty = stack.Outputs
      .filter( output => cloudFormationBucketKey.indexOf(output.OutputKey) > -1 )
      .map( output => output.OutputValue );
  }
  return Promise.resolve(bucketsToEmpty);
};

function emptyBuckets(buckets): Promise<any> {
  log.debug('Emptying buckets', buckets);
  return buckets.length ? Promise.all(buckets.map(bucket => emptyBucket(bucket))) : Promise.resolve('');
};

function emptyBucket(bucket) {
  log.debug('Emptying bucket', bucket);
  return listBucketObjects(bucket).then(objects => deleteObjects(objects, bucket));
};

function listBucketObjects(bucket): Promise<any> {
  const params = { Bucket: bucket };
  log.debug('Listing objects with params', params);
  return s3.listObjectsV2(params).promise();
};

function deleteObjects(objects, bucket): Promise<any> {
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: objects.Contents.map( object => { return { Key: object.Key } })
    }
  };
  log.debug('Deleting objects with params', params);
  return objects.Contents.length ? s3.deleteObjects(params).promise() : Promise.resolve('');
};

function deleteStack(stack): Promise<any> {
  const params = { StackName: stack };
  log.debug('Deleting stack with params', params);
  return cloudFormation.deleteStack(params).promise();
};
