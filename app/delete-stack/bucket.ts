import { S3 } from 'aws-sdk';

const s3 = new S3({ apiVersion: '2006-03-01' });

export class Bucket {
  constructor(private bucketName: string) {}

  async empty(): Promise<any> {
    console.debug('Emptying bucket', this.bucketName);
    const files = await this.getAllFiles();
    const versions = await this.getAllVersions(files);
    await this.deleteAllFileVersions(versions);
  }

  private async getAllFiles(): Promise<S3.Object[]> {
    let files: S3.Object[] = [];
    let output: S3.ListObjectsV2Output;
    do {
      let params: S3.ListObjectsV2Request = { Bucket: this.bucketName };
      if (output && output.IsTruncated) {
        params['ContinuationToken'] = output.NextContinuationToken;
      }
      console.debug('Getting bucket objects with params', params);
      output = await s3.listObjectsV2(params).promise();
      if (output?.Contents?.length) {
        files = [...files, ...output.Contents];
      }
    } while (output.IsTruncated);
    return files;
  }

  private async getAllVersions(files: S3.Object[]): Promise<S3.ObjectVersion[]> {
    const [...versions] = await Promise.all(files.map(file => this.getAllFileVersions(file)));
    return versions.reduce((a, b) => [...a, ...b], []);
  }

  private async getAllFileVersions(file: S3.Object): Promise<S3.ObjectVersion[]> {
    let versions: S3.ObjectVersion[] = [];
    let output: S3.ListObjectVersionsOutput;
    do {
      let params: S3.ListObjectVersionsRequest = { Bucket: this.bucketName, Prefix: file.Key };
      if (output && output.IsTruncated) {
        params['NextKeyMarker'] = output.NextKeyMarker;
        params['NextVersionIdMarker'] = output.NextVersionIdMarker;
      }
      console.debug('Getting file versions with params', params);
      output = await s3.listObjectVersions(params).promise();
      versions = [...versions, ...output.Versions];
    } while (output.IsTruncated);
    return versions;
  }

  private async deleteAllFileVersions(versions: S3.ObjectVersion[]): Promise<any> {
    const promises = [];
    while (versions.length > 1000) {
      promises.push(this.deleteVersions(versions.splice(0, 999)));
    }
    promises.push(this.deleteVersions(versions));
    return Promise.all([promises]);
  }

  private async deleteVersions(versions: S3.ObjectVersion[]): Promise<any> {
    const params = {
      Bucket: this.bucketName,
      Delete: {
        Objects: versions.map(version => ({ Key: version.Key, VersionId: version.VersionId }))
      }
    };
    console.debug('Deleting file versions with params', params);
    return versions.length ? s3.deleteObjects(params).promise() : Promise.resolve();
  }
}
