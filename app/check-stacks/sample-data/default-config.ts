// import { readFileSync } from 'fs';
// import { safeLoad } from 'js-yaml';
import { Config } from '../config';

// const odinConfig = safeLoad(readFileSync('odin.yml', 'utf8'));

// export const defaultConfig: Config = {
//   bucketsToEmpty: odinConfig.bucketsToEmpty,
//   deleteableStatuses: odinConfig.deleteableStatuses,
//   emptyAllBuckets: odinConfig.emptyAllBuckets,
//   namesToRetain: odinConfig.namesToRetain,
//   stagesToRetain: odinConfig.stagesToRetain,
//   staleAfter: odinConfig.hourly.staleAfter
// };

export const defaultConfig: Config = {
  bucketsToEmpty: ['ServerlessDeploymentBucket', 'DocumentBucket', 'S3BucketSite', 'ApiDocumentationBucket'],
  deleteableStatuses: ['CREATE_COMPLETE', 'ROLLBACK_COMPLETE', 'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_COMPLETE'],
  emptyAllBuckets: true,
  namesToRetain: [/ControlTower/, 'AWSControlTowerBP-BASELINE-CLOUDTRAIL-MASTER'],
  stagesToRetain: [
    'PROD',
    'PRODUCTION',
    'QA',
    'DEVELOPMENT',
    'DEV',
    'AUTO',
    'AUTOMATION',
    'INFRA',
    'INFRASTRUCTURE',
    'COMMON'
  ],
  staleAfter: '2'
};
