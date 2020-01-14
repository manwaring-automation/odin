import { CloudFormation, S3 } from 'aws-sdk';

const resourceSummaries: CloudFormation.StackResourceSummaries = [
  {
    LogicalResourceId: 'bucket',
    PhysicalResourceId: 'my-stack-bucket-1vc62xmplgguf',
    ResourceType: 'AWS::S3::Bucket',
    LastUpdatedTimestamp: new Date('December 17, 2019 03:24:00'),
    ResourceStatus: 'CREATE_COMPLETE',
    DriftInformation: {
      StackResourceDriftStatus: 'IN_SYNC'
    }
  }
];

export const listStackResourcesResponse = {
  StackResourceSummaries: resourceSummaries
};

export const listObjectsV2Output: S3.ListObjectsV2Output = {
  Contents: [
    {
      Key: 'index.html',
      ETag: '"0622528de826c0df5db1258a23b80be5"',
      LastModified: new Date('December 17, 2019 03:24:00'),
      Owner: {
        DisplayName: 'my-username',
        ID: '7009a8971cd660687538875e7c86c5b672fe116bd438f46db45460ddcd036c32'
      },
      Size: 38,
      StorageClass: 'STANDARD'
    }
  ],
  IsTruncated: false
};

export const listObjectVersionsOutput: S3.ListObjectVersionsOutput = {
  Versions: [
    {
      LastModified: new Date('December 17, 2019 03:24:00'),
      VersionId: 'Rb_l2T8UHDkFEwCgJjhlgPOZC0qJ.vpD',
      ETag: '"0622528de826c0df5db1258a23b80be5"',
      StorageClass: 'STANDARD',
      Key: 'index.html',
      Owner: {
        DisplayName: 'my-username',
        ID: '7009a8971cd660687538875e7c86c5b672fe116bd438f46db45460ddcd036c32'
      },
      IsLatest: true,
      Size: 38
    }
  ],
  IsTruncated: false
};
