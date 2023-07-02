import { Accessor, createEffect, createMemo } from "solid-js";
import { Partition } from "./Partition";
import { ReduceFn, RelabelFn } from "../types";
import { last } from "../funs";

export class Encoder {
  limits: Record<string, Accessor<number>>;
  partitions: Partition[];
  relabelfns: RelabelFn[];
  partsArrays: Accessor<Record<string, any>[][]>;
  stacked: [boolean, boolean, boolean];

  constructor() {
    this.limits = {};
    this.partitions = [];
    this.relabelfns = [];
    this.partsArrays = () => [];
    this.stacked = [false, false, false];

    createEffect(() => {
      this.partsArrays();
      this.stacked.fill(false);
    });
  }

  registerPartitions = (partitions: Partition[]) => {
    this.partitions = partitions;
    this.partsArrays = createMemo(() =>
      last(this.partitions).partsAboveRecursive()
    );
    return this;
  };

  relabelAt = (depth: number, relabelfn: RelabelFn) => {
    this.partitions[depth].relabelfn = (label) => {
      const labels = {
        ...relabelfn(label),
        group: label.group,
        cases: label.cases,
        parent: label.parent,
        transient: label.transient,
      };
      return labels;
    };
    return this;
  };

  relabelAll = (relabelfn: RelabelFn) => {
    const depth = this.partitions.length;
    for (let i = 0; i < depth; i++) this.relabelAt(i, relabelfn);
    return this;
  };

  partsAt = (depth: number) => {
    const labels = this.partsArrays()[depth];
    return Object.values(labels);
  };

  trackLimit = (
    limitKey: string,
    varKey: string,
    depth: number,
    reducefn: ReduceFn<number, number>,
    initialValue: number
  ) => {
    const values = Object.values(
      last(this.partitions[depth].partsAboveRecursive())
    );
    this.limits[limitKey] = () => {
      return values.reduce((a, b) => reducefn(a, b[varKey]), initialValue);
    };
    return this;
  };
}
