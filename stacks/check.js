'use strict';
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });

module.exports.hello = (event, context) => {
  listStacks()
    .then(getOldNonProdStacks)
    .then(publishForDeletion)
    .then( () => console.log('Finished checking stacks for deletion'));
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

let getOldNonProdStacks = (response) => {
  return Promise.resolve(response.Stacks.filter(stack => {
    console.log(stack);
    return true;
  }));
};

let publishForDeletion = (stacks) => {
  
};