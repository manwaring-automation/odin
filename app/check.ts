import { wrapper, WrapperSignature } from '@manwaring/lambda-wrapper';
import { publishStacksToDelete } from './shared';

export const handler = wrapper(async ({ event, success, error }: WrapperSignature) => {
  try {
    await publishStacksToDelete(event);
    return success('Finished checking stacks for deletion');
  } catch (err) {
    return error(err);
  }
});
