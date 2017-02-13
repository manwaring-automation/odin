'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

module.exports.handler = (event, context) => {
  listStacks()
    .then(getStacksToDelete)
    .then(publishStacksForDeletion)
    .then( () => console.log('Finished checking stacks for deletion'))
    .catch( err => console.log('Error checking stacks for deletion', err));
};

let listStacks = () => {
  const params = {
    StackStatusFilter: [
      'CREATE_COMPLETE',
      'ROLLBACK_COMPLETE',
      'UPDATE_COMPLETE',
      'UPDATE_ROLLBACK_COMPLETE'
    ]
  };
  return cloudFormation.listStacks(params).promise();
};

let getStacksToDelete = (response) => {
  console.log('Received list stacks response', response);
  return Promise.resolve(response.Stacks.filter(stack => {
    console.log(stack);
    //TODO logic - if non prod and last create/update date > 6 hour ago then delete
    return true;
  }));
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