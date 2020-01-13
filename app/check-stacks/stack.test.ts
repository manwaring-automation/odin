import { CloudFormationStack } from './stack';
import {
  deletableStack,
  notStaleCreate,
  notStaleUpdate,
  retainName,
  retainStatus,
  retainStage,
  defaultDailyConfig
} from './sample-data';

describe('Check stack', () => {
  beforeEach(() => {
    jest.resetModules();
    console.log = jest.fn();
    console.debug = jest.fn();
  });

  it('Indicates deletable when deletable', async () => {
    const stack = new CloudFormationStack(deletableStack, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(true);
  });

  it('Indicates not deletable when created stack not stale', async () => {
    const stack = new CloudFormationStack(notStaleCreate, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(false);
  });

  it('Indicates not deletable when updated stack not stale', async () => {
    const stack = new CloudFormationStack(notStaleUpdate, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(false);
  });

  it('Indicates not deletable when stack name should retain', async () => {
    const stack = new CloudFormationStack(retainName, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(false);
  });

  it('Indicates not deletable when stack status should retain', async () => {
    const stack = new CloudFormationStack(retainStatus, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(false);
  });

  it('Indicates not deletable when stack stage should retain', async () => {
    const stack = new CloudFormationStack(retainStage, defaultDailyConfig);
    const shouldDelete = await stack.shouldDelete();
    expect(shouldDelete).toEqual(false);
  });
});
