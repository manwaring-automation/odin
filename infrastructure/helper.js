'use strict';
const { short, branch } = require('git-rev-sync');
const { blue, bold } = require('chalk');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');
const prettyMs = require('pretty-ms');

const environmentType = () => (process.env.AWS_PROFILE && !process.env.CI ? 'offline' : 'default');

const stage = () => {
  let stage;
  if (process.env.STAGE) {
    stage = process.env.STAGE;
  } else if (getUserName()) {
    stage = getUserName();
  } else if (branch()) {
    stage = branch();
  } else {
    stage = 'unknown';
  }
  return stage;
};

const profile = () => {
  let profile;
  if (process.env.AWS_PROFILE) {
    profile = process.env.AWS_PROFILE;
  } else if (process.env.PROFILE) {
    profile = process.env.PROFILE;
  } else {
    const configs = getConfigs();
    if (configs && configs.defaultProfile) {
      profile = configs.defaultProfile;
    } else {
      profile = 'default';
    }
  }
  return profile;
};

const revision = () => short();

const announce = () => {
  console.log(blue(`Starting ${getDescriptiveText()}`));
};

const summarize = () => {
  console.log(blue(`Finished ${getDescriptiveText()}`));
  console.log(blue(`Action duration: ${bold(getDuration())}`));
};

const getDescriptiveText = () =>
  `${getAction()} the ${bold(stage())} ${getAppName()} with the ${bold(profile())} profile`;

const getAppName = () => `${bold(process.env.APP_NAME)} project`;

const getAction = () => {
  const action = process.argv[1];
  const plural = action.slice(-1).toUpperCase() === 'S';
  return `${bold(action)} ${plural ? 'for' : 'of'}`;
};

const getDuration = () => {
  const start = process.argv[2];
  let startDate = new Date();
  startDate.setTime(start * 1000);
  const duration = prettyMs(new Date() - startDate);
  return duration.toString();
};

const getUserName = () => {
  let username;
  const name = process.env.USER ? process.env.USER : 'a.rgo';
  if (name.split('.').length > 1) {
    const first = name.split('.')[0].substring(0, 1);
    const last = name.split('.')[1];
    username = `${first}${last}`;
  } else {
    username = `${name}`;
  }
  return username;
};

const getConfigs = () => safeLoad(readFileSync('infrastructure/configurations.yml', 'utf-8'));

module.exports = {
  environmentType: environmentType,
  stage: stage,
  revision: revision,
  profile: profile,
  announce: announce,
  summarize: summarize
};
