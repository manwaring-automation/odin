'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
const logger = require('log4js').getLogger('ODIN');
logger.setLevel(process.env.LOG_LEVEL);

module.exports.handler = (event, context, callback) => {
  logger.trace('Received event to check stacks for automatic deletion with configuration', event);
  logger.info('Odin is now checking to see if any stacks are worthy of entering Valhalla');

  listAllStacks()
    .then( stacks => getStacksToDelete(stacks, event))
    .then(publishStacksForDeletion)
    .then( () => callback(null, 'Finished checking stacks for deletion'))
    .catch( err => callback(err));
};

const listAllStacks = () => {
  const params = {};
  return cloudFormation.describeStacks(params).promise();
};

const getStacksToDelete = (response, config) => {
  logger.trace('Received list stacks response', response);
  return Promise.resolve( response.Stacks.filter( stack => shouldDeleteStack(stack, config) ));
};

const shouldDeleteStack = (stack, config) => {
  logger.trace('Seeing if stack should be deleted', stack);
  return stackIsNonProdOrAutomation(stack, config)
      && stackIsStale(stack, config)
      && stackIsInDeletableStatus(stack, config);
};

// Stack doesn't have a stage tag or tag isn't production/automation
const stackIsNonProdOrAutomation = (stack, config) => {
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  logger.trace('Stack stage is', stage);
  return !stage || config.stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
};

// Stack hasn't been updated recently - last updated setting configured in CloudWatch alarm, set in serverless.yml
const stackIsStale = (stack, config) => {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((new Date() - stackLastUpdated) / 36e5);
  logger.trace(`Stack was last updated ${lastUpdated} hours ago`);
  return lastUpdated >= parseInt(config.staleAfter);
};

// Stack status is stable and not in error state
const stackIsInDeletableStatus = (stack, config) => {
  logger.trace('Stack status is', stack.StackStatus);
  return config.statusesToDelete.indexOf(stack.StackStatus) > -1;
};

const publishStacksForDeletion = stacks => {
  return Promise.all( stacks.map( stack => publishStackForDeletion(stack) ));
};

const publishStackForDeletion = stack => {
  const params = {
    Message: JSON.stringify({
      stack: stack.StackName,
      bucketsToEmpty: getBucketsToEmpty(stack)
    }),
    TopicArn: process.env.DELETE_STACK_TOPIC
  };
  logger.trace('Publishing deletion request for stack with params', params);
  logger.info(`The ${stack.StackName} stack is ready for Valhalla - informing the valkyries`);
  return sns.publish(params).promise();
};

//If have additional buckets that need to be emptied, get and return them here
const getBucketsToEmpty = stack => {
  const serverlessBucketDisplayNameOutput = stack.Outputs.find( output => output.OutputKey === 'ServerlessDeploymentBucketName');
  return serverlessBucketDisplayNameOutput ? [serverlessBucketDisplayNameOutput.OutputValue] : [];
};
