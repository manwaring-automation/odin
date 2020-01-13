import { CloudFormation } from 'aws-sdk';
import { Config } from './config';

export class CloudFormationStack {
  name: string;

  constructor(private stack: CloudFormation.Stack, private config: Config) {
    this.name = stack.StackName;
  }

  shouldDelete(): boolean {
    return this.stageIsDeletable() && this.isStale() && this.statusIsDeletable() && this.nameIsDeletable();
  }

  private stageIsDeletable(): boolean {
    const stage = this.stack.Tags.find(tag => tag.Key.toUpperCase() === 'STAGE')?.Value?.toUpperCase();
    const canDelete = this.config.stagesToRetain.indexOf(stage) < 0;
    console.debug(`${this.name} is stage ${stage} ${this.getDeletableLog(canDelete)}`);
    return canDelete;
  }

  private isStale(): boolean {
    const lastUpdated: any = this.stack.LastUpdatedTime || this.stack.CreationTime;
    const timeSinceLastUpdate = Math.floor((<any>new Date() - lastUpdated) / 36e5);
    const canDelete = timeSinceLastUpdate >= this.config.staleAfter;
    console.debug(
      `${this.name} was last updated at ${lastUpdated} (${timeSinceLastUpdate} hours ago) ${this.getDeletableLog(
        canDelete
      )}`
    );
    return canDelete;
  }

  private statusIsDeletable(): boolean {
    const status = this.stack.StackStatus;
    const canDelete = this.config.deleteableStatuses.indexOf(status) > -1;
    console.debug(`${this.name} is in status ${status} ${this.getDeletableLog(canDelete)}`);
    return canDelete;
  }

  private nameIsDeletable(): boolean {
    const canDelete = !this.config.namesToRetain.some(name => this.name.toUpperCase().match(name.toUpperCase()));
    console.debug(
      `${this.name} ${canDelete ? "doesn't have" : 'has'} a reserved name ${this.getDeletableLog(canDelete)}`
    );
    return canDelete;
  }

  private getDeletableLog(canDelete: boolean): string {
    return `and ${canDelete ? 'can' : "can't"} be deleted`;
  }
}
