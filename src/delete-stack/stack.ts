import { CloudFormation } from 'aws-sdk';
import { Bucket } from './bucket';
import { DeleteRequest } from './delete-request';
import { Config } from '../check-stacks/config';

const cf = new CloudFormation({ apiVersion: '2010-05-15' });

export class CloudFormationStack {
  private stackName: string;
  private config: Config;

  constructor(request: DeleteRequest) {
    this.stackName = request.stackName;
    this.config = request.config;
  }

  async delete() {
    await this.emptyBuckets();
    const params = { StackName: this.stackName };
    console.debug('Deleting stack with params', params);
    return cf.deleteStack(params).promise();
  }

  private async emptyBuckets(): Promise<any> {
    const buckets = await this.getBucketsToEmpty();
    console.debug('Emptying buckets for stack', this.stackName, ...buckets);
    return Promise.all(buckets.map(bucket => bucket.empty()));
  }

  private async getBucketsToEmpty(): Promise<Bucket[]> {
    console.debug('Getting buckets to empty for stack', this.stackName);
    const params = { StackName: this.stackName };
    const resources = await cf
      .listStackResources(params)
      .promise()
      .then(res => res.StackResourceSummaries);
    return resources
      .filter(resource => resource.ResourceType === 'AWS::S3::Bucket')
      .filter(bucket => {
        const { emptyAllBuckets, bucketsToEmpty } = this.config;
        return emptyAllBuckets ? true : bucketsToEmpty.indexOf(bucket.LogicalResourceId) > -1;
      })
      .map(bucket => new Bucket(bucket.PhysicalResourceId));
  }
}
