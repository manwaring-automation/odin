'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports.handler = (event, context, callback) => {
  console.log('Received event to delete stack', event);
  getStackConfig(event)
    .then(deleteStack)
    .then( stack => callback(null, `Successfully deleted stack  ${stack}`) )
    .catch( err => callback(err) );
};

const getStackConfig = event => {
  return Promise.resolve(event.Records[0].Sns.Message);
};

const deleteStack = config => {
  console.log('Deleting stack with config', config);
  return config.deploymentBucket ? deleteDeploymentBucketAndStack(config) : doDeleteStack(config.stack);
};

const deleteDeploymentBucketAndStack = config => {
  return listObjects(config.deploymentBucket)
          .then( objects => deleteObjects(objects, config.deploymentBucket) )
          .then(response => doDeleteStack(config.stack) );
};

const listObjects = bucket => {
  const params = { Bucket: bucket };
  console.log('Listing objects with params', params);
  s3.listObjectsV2(params).promise();
};

const deleteObjects = (objects, bucket) => {
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: objects.Contents.map( object => { return { Key: object.Key } })
    }
  };
  console.log('Deleting object with params', params);
  return s3.deleteObjects(params).promise();
};

const doDeleteStack = stack => {
  const params = { StackName: stack };
  console.log('Deleting stack with params', params);
  return cloudFormation.deleteStack(params).promise();
};
