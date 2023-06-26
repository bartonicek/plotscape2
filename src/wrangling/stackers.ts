import { StackFn } from "../types";

export const stackPartitions = <T>(
  partitions: Record<string, any>[][],
  depth: number,
  stackfn: (node: Record<string, any>, stackedValue: T) => void,
  initialValue: any
) => {
  const temp = Symbol();
  const parents = new Set<Record<string | symbol, any>>();

  for (const part of partitions[depth]) {
    const parent = part.parent ?? {};
    parents.add(parent);
    if (!(temp in parent)) parent[temp] = initialValue;
    parent[temp] = stackfn(part, parent[temp]);
  }

  for (const parent of parents) delete parent[temp];
};

export const stackRectVertical = (
  part: Record<string, any>,
  stacked: number
) => {
  part.y0 = stacked + part.y0;
  part.y1 = stacked + part.y1;
  return part.y1;
};

export const stackRectHorizontal: StackFn<number> = (
  part: Record<string, any>,
  stacked: number
) => {
  part.x0 = stacked;
  part.x1 = stacked + part.x1;
  return part.x1;
};
