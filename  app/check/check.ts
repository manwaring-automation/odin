import { CloudWatchLogsEvent, Callback, Context, Handler } from 'aws-lambda';
import * as log from 'winston';
import { publishStacksToDelete } from '../shared';

log.configure({ level: process.env.LOG_LEVEL });

export const handler: Handler = async (event: CloudWatchLogsEvent, context: Context, callback: Callback) => {
  try {
    await publishStacksToDelete(event);
    return callback(null, 'Finished checking stacks for deletion');
  } catch (err) {
    return callback(err);
  }
};
