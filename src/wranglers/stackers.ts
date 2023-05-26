export const stackPartitions = <T>(
  partitions: Record<string, any>[][],
  depth: number,
  stackfn: (node: Record<string, any>, stackedValue: T) => void,
  initialValue: any
) => {
  const temp = Symbol();
  const parents = new Set<Record<string | symbol, any>>();

  for (const part of partitions[depth]) {
    const parent = part.parent;
    parents.add(parent);
    if (!(temp in parent)) parent[temp] = initialValue;
    parent[temp] = stackfn(part, parent[temp]);
  }

  for (const parent of parents) delete parent[temp];
};

export const stackRectVertical = (
  node: Record<string, any>,
  stacked: number
) => {
  node.y0 = stacked;
  node.y1 = stacked + node.y1;
  return node.y1;
};
