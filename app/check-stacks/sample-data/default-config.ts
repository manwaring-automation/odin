import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { Config } from '../config';

const odinConfig = safeLoad(readFileSync('odin.yml', 'utf8'));

export const defaultDailyConfig: Config = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.daily };

export const defaultHourlyConfig: Config = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.hourly };
