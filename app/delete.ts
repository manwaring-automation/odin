import { SNSEvent, Callback, Context } from 'aws-lambda';
import { DeleteRequest, emptyBuckets, deleteStack, getBucketsToEmpty, log } from './shared';

export async function handler(event: SNSEvent, context: Context, callback: Callback) {
  try {
    const config = getStackConfig(event);
    await emptyBucketsInStack(config.stackName);
    return callback(null, `Successfully deleted the ${config.stackName} stack`);
  } catch (err) {
    return callback(err);
  }
}

function getStackConfig(event: SNSEvent): DeleteRequest {
  const config: DeleteRequest = JSON.parse(event.Records[0].Sns.Message);
  log.debug('Received request to delete stack', config);
  log.info(`Odin has a seat in Valhalla ready for the ${config.stackName} stack`);
  return config;
}

async function emptyBucketsInStack(stackName: string) {
  const buckets = await getBucketsToEmpty(stackName);
  await emptyBuckets(buckets);
  await deleteStack(stackName);
}
