'use strict';

module.exports.hello = (event, context, callback) => {
  getStackName()
    .then(deleteStack)
    .then( stack => console.log('Successfully deleted stack', stack))
    .catch( err => console.error('Error deleting stack', stack));
};
