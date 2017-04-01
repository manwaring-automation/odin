'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });

module.exports.handler = (event, context, callback) => {
  console.log('Received event to delete stack', event);
  getStackName(event)
    .then(deleteStack)
    .then( stack => callback(null, `Successfully deleted stack  ${stack}`) )
    .catch( err => callback(err) );
};

let getStackName = (event) => {
  return Promise.resolve(event.Records[0].Sns.Message);
};

let deleteStack = (stackName) => {
  const params = { StackName: stackName };
  console.log('Deleting stack with params', params);
  return cloudFormation.deleteStack(params).promise();
};
