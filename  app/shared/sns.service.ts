import { SNS } from 'aws-sdk';
import * as log from 'winston';
import { DeleteRequest } from './deleteRequest';

log.configure({ level: process.env.LOG_LEVEL });
const sns = new SNS({ apiVersion: '2010-03-31' });

export function publishStackForDeletion(stack, config): Promise<any> {
  const params = {
    Message: JSON.stringify(new DeleteRequest(stack.StackName)),
    TopicArn: process.env.DELETE_STACK_TOPIC
  };
  log.debug('Publishing deletion request for stack with params', params);
  log.info(`The ${stack.StackName} stack is ready for Valhalla - informing the valkyries`);
  return sns.publish(params).promise();
}
