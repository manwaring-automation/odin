import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { Config } from '../../check-stacks/config';

const odinConfig = load(readFileSync('odin.yml', 'utf8'));

export const defaultDailyConfig: Config = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.daily };

export const defaultHourlyConfig: Config = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.hourly };
