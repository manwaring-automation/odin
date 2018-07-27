import { CloudWatchLogsEvent, Callback, Context, Handler } from 'aws-lambda';
import * as log from 'winston';
import { listAllStacks, publishStackForDeletion } from '../shared';
log.configure({ level: process.env.LOG_LEVEL });

export const handler: Handler = (event: CloudWatchLogsEvent, context: Context, callback: Callback) => {
  log.debug('Received event to check stacks for automatic deletion with configuration', event);
  log.info('Odin is now checking to see if any stacks are worthy of entering Valhalla');

  listAllStacks()
    .then(stacks => getStacksToDelete(stacks, event))
    .then(stacks => publishStacksForDeletion(stacks, event))
    .then(() => callback(null, 'Finished checking stacks for deletion'))
    .catch(err => callback(err));
};

function getStacksToDelete(response, config): Promise<any> {
  log.debug('Received list stacks response', response);
  return Promise.resolve(response.Stacks.filter(stack => shouldDeleteStack(stack, config)));
}

function shouldDeleteStack(stack, config): boolean {
  log.debug('Seeing if stack should be deleted', stack);
  return (
    stackIsNonProdOrAutomation(stack, config) && stackIsStale(stack, config) && stackIsInDeletableStatus(stack, config)
  );
}

// Stack has a stage and tag isn't production/automation
function stackIsNonProdOrAutomation(stack, config): boolean {
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  const isNonProdOrAutomation = stage && config.stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
  log.debug(
    `Stack stage is ${stage ? stage.Value : 'undefined'}, which ${
      isNonProdOrAutomation ? "isn't" : 'is'
    } missing, production, or automation`
  );
  return isNonProdOrAutomation;
}

// Stack hasn't been updated recently - last updated setting configured in CloudWatch alarm, set in serverless.yml
function stackIsStale(stack, config): boolean {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((<any>new Date() - stackLastUpdated) / 36e5);
  const isStale = lastUpdated >= parseInt(config.staleAfter);
  log.debug(`Stack was last updated ${lastUpdated} hours ago and ${isStale ? 'is' : "isn't"} stale`);
  return isStale;
}

// Stack status is stable and not in error state
function stackIsInDeletableStatus(stack, config): boolean {
  const isInDeletableStatus = config.deleteableStatuses.indexOf(stack.StackStatus) > -1;
  log.debug(`Stack status is ${stack.StackStatus} which ${isInDeletableStatus ? 'is' : "isn't"} deletable`);
  return isInDeletableStatus;
}

function publishStacksForDeletion(stacks, config) {
  return Promise.all(stacks.map(stack => publishStackForDeletion(stack, config)));
}
