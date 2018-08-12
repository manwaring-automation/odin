import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { DeleteRequest, emptyBuckets, deleteStack, getBucketsToEmpty } from './shared';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
    // See what IOPipe supports for console methods
    console.trace('This is a trace statement');
    console.debug('This is a debug statement');
    console.info('This is an info statement');
    console.log('This is a log statement');
    console.warn('This is a warn statement');
    console.error('This is an error statement');

    const config: DeleteRequest = message;
    console.debug('Received request to delete stack', config);
    console.info(`Odin has a seat in Valhalla ready for the ${config.stackName} stack`);
    await emptyBucketsInStack(config.stackName);
    return success(`Successfully deleted the ${config.stackName} stack`);
  } catch (err) {
    return error(err);
  }
});

async function emptyBucketsInStack(stackName: string) {
  const buckets = await getBucketsToEmpty(stackName);
  await emptyBuckets(buckets);
  await deleteStack(stackName);
}
