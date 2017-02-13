'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

module.exports.handler = (event, context) => {
  listAllStacks()
    .then(getStacksToDelete)
    .then(publishStacksForDeletion)
    .then( () => console.log('Finished checking stacks for deletion'))
    .catch( err => console.log('Error checking stacks for deletion', err));
};

let listAllStacks = () => {
  const params = {};
  return cloudFormation.describeStacks(params).promise();
};

let getStacksToDelete = (response) => {
  console.log('Received list stacks response', response);
  return Promise.resolve( response.Stacks.filter( stack => shouldDeleteStack(stack) ));
};

let shouldDeleteStack = (stack) => {
  console.log('Seeing if stack should be deleted', stack);
  return stackIsNonProdOrAutomation(stack)
      && stackIsStale(stack)
      && stackIsInDeletableStatus(stack);
};

// Stack doesn't have a stage tag or tag isn't production/automation
let stackIsNonProdOrAutomation = (stack) => {
  const stagesToRetain = ['PROD', 'PRODUCTION', 'AUTO', 'AUTOMATION'];
  const stage = stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE');
  console.log('Stack stage is', stage);
  return !stage || stagesToRetain.indexOf(stage.Value.toUpperCase()) < 0;
};

// Stack hasn't been updated in 6 hours
let stackIsStale = (stack) => {
  const stackLastUpdated = stack.LastUpdatedTime ? stack.LastUpdatedTime : stack.CreationTime;
  const lastUpdated = Math.floor((new Date() - stackLastUpdated) / 36e5);
  console.log(`Stack was last updated ${lastUpdated} hours ago`);
  return lastUpdated > 6;
};

let stackIsInDeletableStatus = (stack) => {
  const statusesToDelete = ['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE'];
  return statusesToDelete.indexOf(stack.StackStatus) > -1;
};

let publishStacksForDeletion = (stacks) => {
  return Promise.all( stacks.map( stack => publishStackForDeletion(stack) ));
};

let publishStackForDeletion = (stack) => {
  const params = {
    Message: stack.StackName,
    TopicArn: `arn:aws:sns:us-east-1:${process.env.ACCOUNT_ID}:delete-stack`
  };
  return sns.publish(params).promise();
};