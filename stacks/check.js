'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

module.exports.handler = (event, context, callback) => {
  console.log('Received event to check stack status for automatic deletion with configuration', event);
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
  console.log('Received list stacks response', response);
  return Promise.resolve( response.Stacks.filter( stack => shouldDeleteStack(stack, config) ));
};

const shouldDeleteStack = (stack, config) => {
  console.log('Seeing if stack should be deleted', stack);
  return stackIsNonProdOrAutomation(stack)
      && stackIsStale(stack, config)
      && stackIsInDeletableStatus(stack);
};

// Stack doesn't have a stage tag or tag isn't production/automation
const stackIsNonProdOrAutomation = stack => {
  const stagesToRetain = ['PROD', 'PRODUCTION', 'AUTO', 'AUTOMATION'];
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  console.log('Stack stage is', stage);
  return !stage || stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
};

// Stack hasn't been updated recently - last updated setting configured in CloudWatch alarm, set in serverless.yml
const stackIsStale = (stack, config) => {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((new Date() - stackLastUpdated) / 36e5);
  console.log(`Stack was last updated ${lastUpdated} hours ago`);
  return lastUpdated >= parseInt(config.staleAfter);
};

// Stack status is stable and not in error state
const stackIsInDeletableStatus = stack => {
  const statusesToDelete = ['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE'];
  console.log('Stack status is', stack.StackStatus);
  return statusesToDelete.indexOf(stack.StackStatus) > -1;
};

const publishStacksForDeletion = stacks => {
  return Promise.all( stacks.map( stack => publishStackForDeletion(stack) ));
};

const publishStackForDeletion = stack => {
  const serverlessBucketDisplayNameOutput = stack.Outputs.find( output => output.OutputKey === 'ServerlessDeploymentBucketName');
  const params = {
    Message: JSON.stringify({
      stack: stack.StackName,
      deploymentBucket: serverlessBucketDisplayNameOutput ? serverlessBucketDisplayNameOutput.OutputValue : ''
    }),
    TopicArn: process.env.DELETE_STACK_TOPIC
  };
  console.log('Publishing deletion request for stack with params', params);
  return sns.publish(params).promise();
};