import 'source-map-support/register';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { CloudFormationStacks } from './stacks';
import { PublishDeleteRequest } from './publish-delete-request';

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    const config = JSON.parse(event);
    const stacks = new CloudFormationStacks(config);
    const toDelete = await stacks.getStacksToDelete();
    await Promise.all(toDelete.map(stack => new PublishDeleteRequest(stack, config).publish()));
    return success('Finished checking stacks for deletion');
  } catch (err) {
    return error(err);
  }
});
