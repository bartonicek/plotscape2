import { Accessor } from "solid-js";
import { Reducer } from "../types";
import { Factor } from "./Factor";
import { Wrangler } from "./Wrangler";

export class ReactivePartition {
  depth: number;
  parent?: ReactivePartition;
  child?: ReactivePartition;

  factor: Accessor<Factor>;
  wrangler: Wrangler;

  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;
  encodefn: (label: Record<string, string>[]) => Record<string, string>;

  constructor(
    wrangler: Wrangler,
    factor: Accessor<Factor>,
    parent?: ReactivePartition
  ) {
    this.wrangler = wrangler;
    this.parent = parent;
    this.depth = (parent?.depth ?? -1) + 1;
    this.factor = factor;

    this.reducables = wrangler.reducables;
    this.statics = wrangler.statics;
    this.encodefn = wrangler.encodefn;
  }

  nest = (factor: Accessor<Factor>) => {
    const productFactor = () => Factor.product(this.factor(), factor());
    return new ReactivePartition(this.wrangler, productFactor, this);
  };

  labels = () => {
    const [staticLabels, computedLabels, parentLabels, parentIndexMap] = [
      this.staticLabels(),
      this.computedLabels(),
      this.parent?.labels(),
      this.parentIndexMap(),
    ];

    const { statics } = this;
    const keys = Object.keys(computedLabels);
    const result = {} as Record<string, any>[][];

    for (let i = 0; i < keys.length; i++) {
      const key = parseInt(keys[i], 10);

      const labelSet = Object.assign(
        {},
        statics,
        staticLabels[key],
        computedLabels[key]
      );

      const parentLabelSet = parentLabels?.[parentIndexMap?.[key] ?? 0] ?? [];
      result[key] = [...parentLabelSet, labelSet];
    }

    return result;
  };

  parentIndexMap = () => {
    if (!this.parent) return;
    const [factor, parentFactor] = [this.factor(), this.parent?.factor()];
    const result = {} as Record<number, number>;
    for (let i = 0; i < factor.indices.length; i++) {
      if (!(factor.indices[i] in result)) {
        result[factor.indices[i]] = parentFactor.indices[i];
      }
    }
    return result;
  };

  staticLabels = () => this.factor().labels;
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
        result[0][key] = array.reduce(reducefn);
        continue;
      }

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        if (!result?.[index]?.[key]) result[index][key] = initialValue;
        result[index][key] = reducefn(result[index][key], array?.[i]);
      }
    }

    return result;
  };
}
