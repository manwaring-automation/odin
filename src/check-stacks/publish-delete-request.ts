import { SNS } from 'aws-sdk';
import { Config } from './config';
import { DeleteRequest } from '../delete-stack/delete-request';

const sns = new SNS({ apiVersion: '2010-03-31' });

export class PublishDeleteRequest {
  constructor(private stackName: string, private config: Config) {}

  publish(): Promise<any> {
    const deleteRequest: DeleteRequest = { stackName: this.stackName, config: this.config };
    const params = {
      Message: JSON.stringify(deleteRequest),
      TopicArn: process.env.DELETE_STACK_TOPIC
    };
    console.debug('Publishing delete request with params', params);
    return sns.publish(params).promise();
  }
}
