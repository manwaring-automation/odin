export interface Config {
  staleAfter: number;
  stagesToRetain: string[];
  deleteableStatuses: string[];
  namesToRetain: string[];
  emptyAllBuckets: boolean;
  bucketsToEmpty: string[];
}
