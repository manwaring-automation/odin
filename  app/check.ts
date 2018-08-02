import { CloudWatchLogsEvent, Callback, Context } from 'aws-lambda';
import { publishStacksToDelete } from './shared';

export async function handler(event: CloudWatchLogsEvent, context: Context, callback: Callback) {
  try {
    await publishStacksToDelete(event);
    return callback(null, 'Finished checking stacks for deletion');
  } catch (err) {
    return callback(err);
  }
}
