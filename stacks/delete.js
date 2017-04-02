'use strict';
const AWS = require('aws-sdk');
const cloudFormation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports.handler = (event, context, callback) => {
  const config = getStackConfig(event);
  console.log('Received event to delete stack', config);

  emptyDeploymentBucket(config.deploymentBucket)
    .then(results => deleteStack(config.stack))
    .then( stack => callback(null, `Successfully deleted stack  ${stack}`) )
    .catch( err => callback(err) );
};

const getStackConfig = event => {
  return JSON.parse(event.Records[0].Sns.Message);
};

const emptyDeploymentBucket = bucket => {
  return bucket ? listObjects(bucket).then(objects => deleteObjects(objects, bucket)) : Promise.resolve('');
};

const listObjects = bucket => {
  const params = { Bucket: bucket };
  console.log('Listing objects with params', params);
  return s3.listObjectsV2(params).promise();
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

const deleteStack = stack => {
  const params = { StackName: stack };
  console.log('Deleting stack with params', params);
  return cloudFormation.deleteStack(params).promise();
};
