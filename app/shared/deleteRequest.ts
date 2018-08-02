export class DeleteRequest {
  constructor(stackName: string) {
    this.stackName = stackName;
  }
  stackName: string;
}
