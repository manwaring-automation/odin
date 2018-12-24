import { CloudFormation, SNS } from 'aws-sdk';
// import { log } from './logger';
import { listAllStacks } from './cf.service';
import { DeleteRequest } from './deleteRequest';

const sns = new SNS({ apiVersion: '2010-03-31' });

export async function publishStacksToDelete(config) {
  console.debug('Received event to check stacks for automatic deletion with configuration', config);
  console.info('Odin is now checking to see if any stacks are worthy of entering Valhalla');
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
  console.debug('Publishing deletion request for stack with params', params);
  console.info(`The ${stack.StackName} stack is ready for Valhalla - informing the valkyries`);
  return sns.publish(params).promise();
}

async function getStacksToDelete(config): Promise<CloudFormation.Stack[]> {
  const allStacks = await listAllStacks();
  console.debug('Received list stacks response', allStacks);
  return Promise.resolve(allStacks.filter(stack => shouldDeleteStack(stack, config)));
}

function shouldDeleteStack(stack: CloudFormation.Stack, config): boolean {
  console.info(`Odin is inspecting the ${stack.StackName} stack to see if it should be deleted`);
  return (
    stackIsDeletableStage(stack, config) &&
    stackIsStale(stack, config) &&
    stackIsInDeletableStatus(stack, config) &&
    stackIsDeletableName(stack, config)
  );
}

// Stack has no stage or stage isn't in list of stages to retain
function stackIsDeletableStage(stack, config): boolean {
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  const isDeletable = !stage || config.stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
  console.debug(`Stack stage is ${stage ? stage.Value : 'undefined'}, which ${isDeletable ? 'is' : "isn't"} deletable`);
  return isDeletable;
}

// Stack hasn't been updated recently - last updated setting configured in CloudWatch alarm, set in serverless.yml
function stackIsStale(stack, config): boolean {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((<any>new Date() - stackLastUpdated) / 36e5);
  const isStale = lastUpdated >= parseInt(config.staleAfter);
  console.debug(`Stack was last updated ${lastUpdated} hours ago and ${isStale ? 'is' : "isn't"} stale`);
  return isStale;
}

// Stack status is stable and not in error state
function stackIsInDeletableStatus(stack, config): boolean {
  const isInDeletableStatus = config.deleteableStatuses.indexOf(stack.StackStatus) > -1;
  console.debug(`Stack status is ${stack.StackStatus} which ${isInDeletableStatus ? 'is' : "isn't"} deletable`);
  return isInDeletableStatus;
}

// Stack name isn't in list of names to retain
function stackIsDeletableName(stack, config): boolean {
  const isDeletable = config.namesToRetain.indexOf(stack.StackName) < 0;
  console.debug(`Stack name is ${stack.StackName} which ${isDeletable ? 'is' : "isn't"} deletable`);
  return isDeletable;
}
