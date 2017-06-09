'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
const log = require('winston');
log.level = process.env.LOG_LEVEL;

module.exports.handler = (event, context, callback) => {
  log.debug('Received event to check stacks for automatic deletion with configuration', event);
  log.info('Odin is now checking to see if any stacks are worthy of entering Valhalla');

  listAllStacks()
    .then( stacks => getStacksToDelete(stacks, event))
    .then( stacks => publishStacksForDeletion(stacks, event))
    .then( () => callback(null, 'Finished checking stacks for deletion'))
    .catch( err => callback(err));
};

const listAllStacks = () => {
  const params = {};
  return cloudFormation.describeStacks(params).promise();
};

const getStacksToDelete = (response, config) => {
  log.debug('Received list stacks response', response);
  return Promise.resolve( response.Stacks.filter( stack => shouldDeleteStack(stack, config) ));
};

const shouldDeleteStack = (stack, config) => {
  log.debug('Seeing if stack should be deleted', stack);
  return stackIsNonProdOrAutomation(stack, config)
      && stackIsStale(stack, config)
      && stackIsInDeletableStatus(stack, config);
};

// Stack doesn't have a stage tag or tag isn't production/automation
const stackIsNonProdOrAutomation = (stack, config) => {
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  log.debug('Stack stage is', stage);
  return !stage || config.stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
};

// Stack hasn't been updated recently - last updated setting configured in CloudWatch alarm, set in serverless.yml
const stackIsStale = (stack, config) => {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((new Date() - stackLastUpdated) / 36e5);
  log.debug(`Stack was last updated ${lastUpdated} hours ago`);
  return lastUpdated >= parseInt(config.staleAfter);
};

// Stack status is stable and not in error state
const stackIsInDeletableStatus = (stack, config) => {
  log.debug('Stack status is', stack.StackStatus);
  return config.deleteableStatuses.indexOf(stack.StackStatus) > -1;
};

const publishStacksForDeletion = (stacks, config) => {
  return Promise.all( stacks.map( stack => publishStackForDeletion(stack, config) ));
};

const publishStackForDeletion = (stack, config) => {
  const params = {
    Message: JSON.stringify({
      stack: stack.StackName
    }),
    TopicArn: process.env.DELETE_STACK_TOPIC
  };
  log.debug('Publishing deletion request for stack with params', params);
  log.info(`The ${stack.StackName} stack is ready for Valhalla - informing the valkyries`);
  return sns.publish(params).promise();
};

//If have additional buckets that need to be emptied, get and return them here
// const getBucketsToEmpty = (stack, config) => {
//   let bucketsToEmpty = [];
//   if (stack.Outputs && stack.Outputs.length > 0) {
//     bucketsToEmpty = stack.Outputs
//       .filter( output => config.bucketsToEmpty.indexOf(output.OutputKey) > -1)
//       .map( output => output.OutputValue);
//   }
//   return bucketsToEmpty;
// };
