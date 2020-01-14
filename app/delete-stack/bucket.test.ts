const AWS = require('aws-sdk');
import { listObjectsV2Output, listObjectVersionsOutput } from './sample-data';

const mockListObjectsV2 = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve(listObjectsV2Output) }));
const mockListObjectVersions = jest
  .fn()
  .mockImplementation(() => ({ promise: () => Promise.resolve(listObjectVersionsOutput) }));
const mockDeleteObjects = jest.fn().mockImplementation(() => ({ promise: () => Promise.resolve() }));
jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      listObjectsV2: mockListObjectsV2,
      listObjectVersions: mockListObjectVersions,
      deleteObjects: mockDeleteObjects
    }))
  };
});

describe('Delete stack bucket', () => {
  beforeEach(() => {
    // jest.resetModules();
    console.debug = jest.fn();
  });

  it('Empties the bucket', async () => {
    const { Bucket } = require('./bucket');
    const bucket = new Bucket();
    await bucket.empty();
    // expect();
  });
});
