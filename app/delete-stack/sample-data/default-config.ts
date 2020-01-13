import { Config } from '../../check-stacks/config';

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
