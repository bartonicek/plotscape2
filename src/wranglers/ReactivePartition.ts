import { Accessor, createMemo } from "solid-js";
import { EncodeFn, Label, Reducer, StackFn } from "../types";
import { Factor } from "./Factor";
import { Wrangler } from "./Wrangler";

export class ReactivePartition {
  depth: number;
  parent?: ReactivePartition;
  child?: ReactivePartition;

  factor: Accessor<Factor>;
  wrangler: Wrangler;
  encodefn: EncodeFn;

  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;

  constructor(
    wrangler: Wrangler,
    factor: Accessor<Factor>,
    parent?: ReactivePartition
  ) {
    if (parent) parent.child = this;
    this.parent = parent;
    this.depth = (parent?.depth ?? -1) + 1;

    this.wrangler = wrangler;
    this.factor = factor;
    this.encodefn = wrangler.encodefn;

    this.reducables = wrangler.reducables;
    this.statics = wrangler.statics;
  }

  nest = (factor: Accessor<Factor>) => {
    const productFactor = () => Factor.product(this.factor(), factor());
    return new ReactivePartition(this.wrangler, productFactor, this);
  };

  encodings = () => {
    const [staticLabels, computedLabels, parentLabels, parentIndexMap] = [
      this.staticLabels(),
      this.computedLabels(),
      this.parent?.encodings(),
      this.parentIndexMap(),
    ];

    const { child, statics, encodefn } = this;
    const keys = Object.keys(computedLabels);

    const result = {} as Record<string, any>[][] | Record<string, any>[];

    for (let i = 0; i < keys.length; i++) {
      const key = parseInt(keys[i], 10);
      const ownLabels = [statics, staticLabels[key], computedLabels[key]];
      const ownLabelSet = Object.assign({}, ...ownLabels);

      const parentLabelSet = parentLabels?.[parentIndexMap?.[key] ?? 0] ?? [];

      // Need to copy parent labels since each may have multiple children
      const combinedLabelSet: Record<string, any>[] = [
        ...(parentLabelSet as Record<string, any>[]),
        ownLabelSet,
      ];

      // If leaf partition, encode labels into graphical encodings and stack
      if (!child) {
        const encodings = encodefn(combinedLabelSet);
        result[key] = encodings;
      } else result[key] = combinedLabelSet;
    }

    return result;
  };

  parentIndexMap = () => {
    if (!this.parent) return;
    const [factor, parentFactor] = [this.factor(), this.parent?.factor()];
    const result = {} as Record<number, number>;
    for (let i = 0; i < factor.indices.length; i++) {
      if (!(factor.indices[i] in result)) {
        result[factor.indices[i]] = parentFactor.indices[i] ?? 0;
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
