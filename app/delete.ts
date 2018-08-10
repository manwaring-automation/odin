import { SNSEvent, Callback, Context } from 'aws-lambda';
import { DeleteRequest, emptyBuckets, deleteStack, getBucketsToEmpty } from './shared';

export async function handler(event: SNSEvent, context: Context, callback: Callback) {
  try {
    console.trace('This is a trace statement');
    console.debug('This is a debug statement');
    console.info('This is an info statement');
    console.log('This is a log statement');
    console.warn('This is a warn statement');
    console.error('This is an error statement');
    const config = getStackConfig(event);
    await emptyBucketsInStack(config.stackName);
    return callback(null, `Successfully deleted the ${config.stackName} stack`);
  } catch (err) {
    return callback(err);
  }
}

function getStackConfig(event: SNSEvent): DeleteRequest {
  const config: DeleteRequest = JSON.parse(event.Records[0].Sns.Message);
  console.debug('Received request to delete stack', config);
  console.info(`Odin has a seat in Valhalla ready for the ${config.stackName} stack`);
  return config;
}

async function emptyBucketsInStack(stackName: string) {
  const buckets = await getBucketsToEmpty(stackName);
  await emptyBuckets(buckets);
  await deleteStack(stackName);
}
