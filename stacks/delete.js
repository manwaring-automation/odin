'use strict';
const AWS = require('aws-sdk');

module.exports.handler = (event, context, callback) => {
  getStackName(event)
    .then(deleteStack)
    .then( stack => console.log('Successfully deleted stack', stack))
    .catch( err => console.error('Error deleting stack', err));
};

let getStackName = (event) => {
  return Promise.resolve(event.Records[0].Sns.Message);
};

let deleteStack = (stackName) => {
    console.log('Deleting stack with name', stackName);
    return Promise.resolve(stackName);
};
