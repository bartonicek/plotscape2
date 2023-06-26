import { max, sum } from "../funs";

export const makeDefaultSummaries = (
  mappings: Record<string, string>,
  data: Record<string, any[]>
) => {
  const result = {} as Record<string, Record<string, number>>;

  for (const [key1, key2] of Object.entries(mappings)) {
    const arr = data[key2];
    const summaries = {} as Record<string, number>;
    summaries.sum = arr.reduce(sum);
    summaries.mean = summaries.sum / arr.length;
    summaries.min = arr.reduce((a, b) => Math.min(a, b), Infinity);
    summaries.max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
    summaries.range = summaries.max - summaries.min;
    result[key1] = summaries;
  }

  return result;
};
