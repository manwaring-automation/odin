export interface Config {
  staleAfter: string;
  stagesToRetain: string[];
  deleteableStatuses: string[];
  namesToRetain: (string | RegExp)[];
  emptyAllBuckets: boolean;
  bucketsToEmpty: string[];
}
