import { Config } from '../check-stacks/config';

export interface DeleteRequest {
  stackName: string;
  config: Config;
}
