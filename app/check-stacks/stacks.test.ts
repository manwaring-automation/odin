const AWS = require('aws-sdk');
import { defaultDailyConfig, describeStacksOutput } from './sample-data';

const mockDescribeStacks = jest
  .fn()
  .mockImplementation(() => ({ promise: () => Promise.resolve(describeStacksOutput) }));
jest.mock('aws-sdk', () => {
  return {
    CloudFormation: jest.fn(() => ({ describeStacks: mockDescribeStacks }))
  };
});

describe('Check stacks', () => {
  beforeEach(() => {
    jest.resetModules();
    console.debug = jest.fn();
  });

  it('Gets stacks to delete', async () => {
    const { CloudFormationStacks } = require('./stacks');
    const stacks = new CloudFormationStacks(defaultDailyConfig);
    await stacks.getStacksToDelete();
    // expect();
  });
});
