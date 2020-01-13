const AWS = require('aws-sdk');
import { defaultDailyConfig } from './sample-data';

const mockPublish = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve() }));
jest.mock('aws-sdk', () => ({ SNS: jest.fn(() => ({ publish: mockPublish })) }));

describe('Check stacks publish delete request', () => {
  beforeEach(() => {
    jest.resetModules();
    console.debug = jest.fn();
  });

  it('Publishes the delete request', async () => {
    const { PublishDeleteRequest } = require('./publish-delete-request');
    const request = new PublishDeleteRequest('stackName', defaultDailyConfig);
    await request.publish();
    // expect();
  });
});
