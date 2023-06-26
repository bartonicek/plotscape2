import { Accessor } from "solid-js";
import { Partition } from "./Partition";
import { ReduceFn, RelabelFn } from "../types";

export class Encoder {
  limits: Record<string, Accessor<number>>;
  partitions: Partition[];
  relabelfns: RelabelFn[];

  constructor() {
    this.limits = {};
    this.partitions = [];
    this.relabelfns = [];
  }

  registerPartitions = (partitions: Partition[]) => {
    this.partitions = partitions;
    return this;
  };

  relabelAt = (depth: number, relabelfn: RelabelFn) => {
    this.partitions[depth].relabelfn = (label) => {
      const labels = relabelfn(label);
      if (label.group) labels.group = label.group;
      if (label.cases) labels.cases = label.cases;
      if (label.parent) labels.parent = label.parent;
      if (label.transient) labels.transient = label.transient;
      return labels;
    };
    return this;
  };

  relabelAll = (relabelfn: RelabelFn) => {
    const depth = this.partitions.length;
    for (let i = 0; i < depth; i++) this.relabelAt(i, relabelfn);
    return this;
  };

  partitionsAbove = (depth: number) => {
    const labels = this.partitions[depth].upperLabelArrays();
    return labels;
  };

  trackLimit = (
    limitKey: string,
    varKey: string,
    depth: number,
    reducefn: ReduceFn<number, number>,
    initialValue: number
  ) => {
    this.limits[limitKey] = () =>
      this.partitions[depth]
        .upperLabelArrays()
        [depth].reduce((a, b) => reducefn(a, b[varKey]), initialValue);
    return this;
  };
}
