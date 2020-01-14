import 'source-map-support/register';
import { sns, SnsSignature } from '@manwaring/lambda-wrapper';
import { CloudFormationStack } from './stack';
import { DeleteRequest } from './delete-request';

export const handler = sns(async ({ message, success, error }: SnsSignature) => {
  try {
    const request = <DeleteRequest>message;
    console.debug('Received request to delete stack', request.stackName);
    console.info(`Odin has a seat in Valhalla ready for the ${request.stackName} stack`);
    const stack = new CloudFormationStack(request);
    await stack.delete();
    return success(`Successfully deleted the ${request.stackName} stack`);
  } catch (err) {
    return error(err);
  }
});
