import 'source-map-support/register';
import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { CloudFormationStacks } from './stacks';
import { PublishDeleteRequest } from './publish-delete-request';

export const handler = wrapper(async ({ event: config, success, error }: WrapperSignature) => {
  try {
    const stacks = new CloudFormationStacks(config);
    const toDelete = await stacks.getStacksToDelete();
    await Promise.all(toDelete.map(stack => new PublishDeleteRequest(stack, config).publish()));
    return success('Finished checking stacks for deletion');
  } catch (err) {
    return error(err);
  }
});
