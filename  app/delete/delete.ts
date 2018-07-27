import { SNSEvent, Callback, Context, Handler } from 'aws-lambda';
import * as log from 'winston';
import { DeleteRequest } from '../check/deleteRequest';
import { emptyBuckets, deleteStack, getBucketsToEmpty } from '../shared';

log.configure({ level: process.env.LOG_LEVEL });

export const handler: Handler = async (event: SNSEvent, context: Context, callback: Callback) => {
  try {
    const request = getStackConfig(event);
    log.debug('Received event to delete stack', request);
    log.info(`Odin has a seat in Valhalla ready for the ${request.stackName} stack`);
    const buckets = await getBucketsToEmpty(request.stackName);
    await emptyBuckets(buckets);
    await deleteStack(request.stackName);
    return callback(null, `Successfully deleted stack ${request.stackName}`);
  } catch (err) {
    return callback(err);
  }
};

function getStackConfig(event: SNSEvent): DeleteRequest {
  return JSON.parse(event.Records[0].Sns.Message);
}
