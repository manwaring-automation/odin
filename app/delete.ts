import { SNSEvent, Callback, Context } from 'aws-lambda';
import * as log from 'winston';
import { DeleteRequest, emptyBuckets, deleteStack, getBucketsToEmpty } from './shared';

log.configure({ level: process.env.LOG_LEVEL });

export async function handler(event: SNSEvent, context: Context, callback: Callback) {
  try {
    const config = getStackConfig(event);
    log.debug('Received request to delete stack', config);
    log.info(`Odin has a seat in Valhalla ready for the ${config.stackName} stack`);
    await emptyBucketsInStack(config.stackName);
    return callback(null, `Successfully deleted the ${config.stackName} stack`);
  } catch (err) {
    return callback(err);
  }
}

function getStackConfig(event: SNSEvent): DeleteRequest {
  return JSON.parse(event.Records[0].Sns.Message);
}

async function emptyBucketsInStack(stackName: string) {
  const buckets = await getBucketsToEmpty(stackName);
  await emptyBuckets(buckets);
  await deleteStack(stackName);
}
