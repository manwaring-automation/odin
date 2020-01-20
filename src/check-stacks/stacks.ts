import { CloudFormation } from 'aws-sdk';
import { CloudFormationStack } from './stack';
import { Config } from './config';

const cf = new CloudFormation({ apiVersion: '2010-05-15' });

export class CloudFormationStacks {
  constructor(private config: Config) {}

  async getStacksToDelete(): Promise<string[]> {
    const params = {};
    const stacks = await cf
      .describeStacks(params)
      .promise()
      .then(response => response.Stacks);
    return stacks
      .map(stack => new CloudFormationStack(stack, this.config))
      .filter(stack => stack.shouldDelete())
      .map(stack => stack.name);
  }
}
