import { StackFn } from "../types";

export const stackPartitions = <T>(
  partition: Record<string, any>[],
  stackfn: (node: Record<string, any>, stackedValue: T) => void,
  initialValue: T
) => {
  const temp = Symbol();
  const seenParts = new Set<Record<string | symbol, any>>();
  const seenParents = new Set<Record<string | symbol, any>>();

  for (const part of partition) {
    const parent = part.parent ?? {};
    if (seenParts.has(part)) continue;

    seenParts.add(part);
    seenParents.add(parent);

    if (!(temp in parent)) parent[temp] = initialValue;
    parent[temp] = stackfn(part, parent[temp]);
  }

  for (const parent of seenParents) delete parent[temp];
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
