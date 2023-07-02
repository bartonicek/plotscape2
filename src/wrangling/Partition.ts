import { Accessor, createMemo } from "solid-js";
import { identity, last, toInt } from "../funs";
import { Reducer, RelabelFn } from "../types";
import { Factor } from "./Factor";
import { Wrangler } from "./Wrangler";

export class Partition {
  depth: number;
  parent?: Partition;
  child?: Partition;

  factor: Accessor<Factor>;
  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;

  relabelfn: RelabelFn;

  constructor(factor: Accessor<Factor>, parent?: Partition) {
    this.parent = parent;
    this.depth = (parent?.depth ?? -1) + 1;

    this.factor = factor;
    this.reducables = {};
    this.statics = {};

    this.relabelfn = identity;
  }

  addStatic = (key: string, value: any) => {
    this.statics[key] = value;
  };

  addReducer = <T, U>(key: string, array: T[], reducer: Reducer<T, U>) => {
    this.reducables[key] = { array, ...reducer };
  };

  nest = (factor: Accessor<Factor>) => {
    const productFactor = () => Factor.product(this.factor(), factor());
    const childPartition = new Partition(productFactor, this);
    this.child = childPartition;
    return childPartition;
  };

  partsAboveRecursive = (): Record<string, any>[][] => {
    const [factorLabels, computedLabels] = [
      this.factorLabels(),
      this.computedLabels(),
    ];

    const { statics, parent, relabelfn } = this;
    const keys = Object.keys(computedLabels).map(toInt);
    const result = {} as Record<string, any>[];

    if (!parent) {
      for (const key of keys) {
        const ownLabels = {
          ...statics,
          ...factorLabels[key],
          ...computedLabels[key],
        };
        result[key] = relabelfn(ownLabels);
      }

      return [result];
    }

    const ancestorLabels = parent.partsAboveRecursive();
    const parentLabels = last(ancestorLabels);
    const parentIndexMap = this.parentIndexMap()!;

    for (let key of keys) {
      const ownLabels = {
        ...statics,
        ...factorLabels[key],
        ...computedLabels[key],
      };

      const combinedLabels = relabelfn({
        ...ownLabels,
        parent: parentLabels[parentIndexMap[key]],
      });
      result[key] = combinedLabels;
    }

    ancestorLabels.push(result);
    return ancestorLabels;
  };

  parentIndexMap = () => {
    if (!this.parent) return;
    const [factor, parentFactor] = [this.factor(), this.parent.factor()];
    const result = {} as Record<number, number>;
    for (let i = 0; i < factor.indices.length; i++) {
      if (!(factor.indices[i] in result)) {
        result[factor.indices[i]] = parentFactor.indices[i] ?? 0;
      }
    }
    return result;
  };

  factorLabels = () => this.factor().labels;
  computedLabels = () => {
    const { reducables } = this;
    const { indexSet, indices, singleton } = this.factor();
    const keys = Object.keys(reducables);

    const result = {} as Record<number, any>;
    for (const index of indexSet) result[index] = {};

    for (let j = 0; j < keys.length; j++) {
      const { array, reducefn, initialValue } = reducables[keys[j]];
      const key = keys[j];

      if (singleton) {
        result[0][key] = array.reduce(reducefn, initialValue());
        continue;
      }

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];

        if (result?.[index]?.[key] === undefined) {
          result[index][key] = initialValue();
        }
        result[index][key] = reducefn(result[index][key], array?.[i]);
      }
    }

    return result;
  };
}
