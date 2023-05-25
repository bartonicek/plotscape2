import { Accessor, createMemo } from "solid-js";
import { EncodeFn, Label, Reducer, StackFn } from "../types";
import { Factor } from "./Factor";
import { Wrangler } from "./Wrangler";
import { last, toInt } from "../funs";

export class Partition {
  depth: number;
  parent?: Partition;
  child?: Partition;

  factor: Accessor<Factor>;
  wrangler: Wrangler;
  encodefn: EncodeFn;
  stackfn: StackFn;

  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;

  constructor(
    wrangler: Wrangler,
    factor: Accessor<Factor>,
    parent?: Partition
  ) {
    if (parent) parent.child = this;
    this.parent = parent;
    this.depth = (parent?.depth ?? -1) + 1;

    this.wrangler = wrangler;
    this.factor = factor;
    this.encodefn = wrangler.encodefn;
    this.stackfn = (_, next) => next;

    this.reducables = wrangler.reducables;
    this.statics = wrangler.statics;
  }

  nest = (factor: Accessor<Factor>) => {
    const productFactor = () => Factor.product(this.factor(), factor());
    return new Partition(this.wrangler, productFactor, this);
  };

  labels = () => {
    const [staticLabels, computedLabels, parentLabels, parentIndexMap] = [
      this.factorLabels(),
      this.computedLabels(),
      this.parent?.labels(),
      this.parentIndexMap(),
    ];

    const { statics } = this;
    const keys = Object.keys(computedLabels);
    const result = {} as Record<string, any>[][];

    for (let i = 0; i < keys.length; i++) {
      const key = parseInt(keys[i], 10);
      const ownLabels = [statics, staticLabels[key], computedLabels[key]];
      const ownLabelSet = Object.assign({}, ...ownLabels);

      const parentLabelSet = parentLabels?.[parentIndexMap?.[key] ?? 0] ?? [];

      // Need to copy parent labels since each parent may have multiple children
      const combinedLabelSet: Record<string, any>[] = [
        ...(parentLabelSet as Record<string, any>[]),
        ownLabelSet,
      ];

      result[key] = combinedLabelSet;
    }

    return result;
  };

  upperLabelSet = (): Record<string, any>[] => {
    const [factorLabels, computedLabels] = [
      this.factorLabels(),
      this.computedLabels(),
    ];

    const { statics, parent } = this;
    const keys = Object.keys(computedLabels).map(toInt);
    const result = {} as Record<string, any>[];

    if (!parent) {
      for (const key of keys) {
        const ownLabels = {
          ...statics,
          ...factorLabels[key],
          ...computedLabels[key],
        };
        result[key] = ownLabels;
      }

      return [result];
    }

    const ancestorLabels = parent.upperLabelSet();
    const parentIndexMap = this.parentIndexMap()!;
    const parentLabelArray = ancestorLabels[ancestorLabels.length - 1]!;

    for (let key of keys) {
      const ownLabels = {
        ...statics,
        ...factorLabels[key],
        ...computedLabels[key],
      };
      const parentLabels = parentLabelArray[parentIndexMap[key]];
      const combinedLabels = { ...ownLabels, parent: parentLabels };

      result[key] = combinedLabels;
    }

    ancestorLabels.push(result);
    return ancestorLabels;
  };

  encodings = () => {
    const labels = Object.values(this.labels());
    const result = Array(labels.length);
    const { stackfn, encodefn } = this;

    let lastEncoding = [] as Record<string, any>;

    for (let i = 0; i < labels.length; i++) {
      const encoding = encodefn(labels[i]);
      result[i] = stackfn(lastEncoding, encoding);
      lastEncoding = encoding;
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
