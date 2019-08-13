'use strict';
const { short } = require('git-rev-sync');

const revision = () => short();

module.exports = { revision };
