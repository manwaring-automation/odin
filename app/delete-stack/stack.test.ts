const AWS = require('aws-sdk');
import { defaultDailyConfig, listStackResourcesResponse, listObjectsV2Output } from './sample-data';
import { DeleteRequest } from './delete-request';

const mockListObjectsV2 = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve(listObjectsV2Output) }));
const mockDeleteStack = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve() }));
const mockListStackResources = jest
  .fn()
  .mockImplementation(() => ({ promise: () => Promise.resolve(listStackResourcesResponse) }));
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({ listObjectsV2: mockListObjectsV2 })),
    CloudFormation: jest.fn(() => ({ deleteStack: mockDeleteStack, listStackResources: mockListStackResources }))
  };
});

describe('Delete stack', () => {
  beforeEach(() => {
    jest.resetModules();
    console.debug = jest.fn();
  });

  it('Deletes the stack', async () => {
    const { CloudFormationStack } = require('./stack');
    const request: DeleteRequest = { stackName: '', config: defaultDailyConfig };
    const stack = new CloudFormationStack(request);
    await stack.delete();
    // expect();
  });
});
