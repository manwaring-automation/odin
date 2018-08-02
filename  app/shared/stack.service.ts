import { CloudFormation, SNS } from 'aws-sdk';
import { log } from './logger';
import { listAllStacks } from './cf.service';
import { DeleteRequest } from './deleteRequest';

const sns = new SNS({ apiVersion: '2010-03-31' });

export async function publishStacksToDelete(config) {
  log.debug('Received event to check stacks for automatic deletion with configuration', config);
  log.info('Odin is now checking to see if any stacks are worthy of entering Valhalla');
  const stacksToDelete = await getStacksToDelete(config);
  await publishStacksForDeletion(stacksToDelete);
}

function publishStacksForDeletion(stacks: CloudFormation.Stack[]) {
  return Promise.all(stacks.map(stack => publishStackForDeletion(stack)));
}

function publishStackForDeletion(stack: CloudFormation.Stack): Promise<any> {
  const params = {
    Message: JSON.stringify(new DeleteRequest(stack.StackName)),
    TopicArn: process.env.DELETE_STACK_TOPIC
  };
  log.debug('Publishing deletion request for stack with params', params);
  log.info(`The ${stack.StackName} stack is ready for Valhalla - informing the valkyries`);
  return sns.publish(params).promise();
}

async function getStacksToDelete(config): Promise<CloudFormation.Stack[]> {
  const allStacks = await listAllStacks();
  log.debug('Received list stacks response', allStacks);
  return Promise.resolve(allStacks.filter(stack => shouldDeleteStack(stack, config)));
}

function shouldDeleteStack(stack, config): boolean {
  log.debug('Seeing if stack should be deleted', stack);
  return stackIsDeletableStage(stack, config) && stackIsStale(stack, config) && stackIsInDeletableStatus(stack, config);
}

// Stack has a stage and tag isn't production/automation
function stackIsDeletableStage(stack, config): boolean {
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
