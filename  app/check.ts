import { CloudWatchLogsEvent, Callback, Context } from 'aws-lambda';
import * as log from 'winston';
import { publishStacksToDelete } from './shared';

log.configure({ level: process.env.LOG_LEVEL });

export async function handler(event: CloudWatchLogsEvent, context: Context, callback: Callback) {
  try {
    await publishStacksToDelete(event);
    return callback(null, 'Finished checking stacks for deletion');
  } catch (err) {
    return callback(err);
  }
}
