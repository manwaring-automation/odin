import { snsWrapper, SnsSignature } from '@manwaring/lambda-wrapper';
import { DeleteRequest, emptyBuckets, deleteStack, getBucketsToEmpty } from './shared';

export const handler = snsWrapper(async ({ message, success, error }: SnsSignature) => {
  try {
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
