const { readFileSync } = require('fs');
const { load } = require('js-yaml');

const odinConfig = load(readFileSync('odin.yml', 'utf8'));

const daily = () => {
  const rules = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.daily };
  return JSON.stringify(rules);
};

const hourly = () => {
  const rules = { ...odinConfig.staticRules, ...odinConfig.dynamicRules.hourly };
  return JSON.stringify(rules);
};

module.exports = { hourly, daily };
