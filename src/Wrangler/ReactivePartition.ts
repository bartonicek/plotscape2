import { Accessor } from "solid-js";
import { intToChar } from "../funs";
import { Reducer } from "../types";
import { Factor } from "./Factor";

export class ReactivePartition {
  parent?: ReactivePartition;
  depth: number;
  factor: Accessor<Factor>;
  reducables: Record<string, { array: any[] } & Reducer<any, any>>;

  constructor(factor: Accessor<Factor>, parent?: ReactivePartition) {
    this.parent = parent;
    this.depth = (parent?.depth ?? -1) + 1;
    this.factor = factor;

    this.reducables = parent?.reducables ?? {};
  }

  nest = (factor: Accessor<Factor>) => {
    return new ReactivePartition(
      () => Factor.product(this.factor(), factor()),
      this
    );
  };

  addReducer = <T, U>(key: string, array: T[], reducer: Reducer<T, U>) => {
    if (this.parent) this.parent.addReducer(key, array, reducer);
    else this.reducables[key] = { array, ...reducer };
    return this;
  };

  labels = () => {
    const [staticLabels, computedLabels] = [
      this.staticLabels(),
      this.computedLabels(),
    ];
    const [parentLabels, childParentMap] = this.parent
      ? [this.parent.labels(), this.childParentMap()]
      : [undefined, undefined];

    const keys = Object.keys(staticLabels);
    const result = {} as Record<string, any>;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as unknown as number;
      const parentKey = childParentMap?.[key] ?? "";

      result[key] = Object.assign(
        {},
        parentLabels?.[parentKey] ?? {},
        staticLabels[key],
        computedLabels[key]
      );
    }

    return result;
  };

  childParentMap = () => {
    const [factor, parentFactor] = [this.factor(), this.parent!.factor()];
    const result = {} as Record<number, number>;
    for (let i = 0; i < factor.indices.length; i++) {
      if (!(factor.indices[i] in result)) {
        result[factor.indices[i]] = parentFactor.indices[i];
      }
    }
  };

  staticLabels = () => {
    const factor = this.factor();
    const result = {} as Record<string, any>;
    // Disgusting thing just to prepend depth before label keys
    for (const [key1, value1] of Object.entries(factor.labels)) {
      result[key1 as unknown as number] = {} as Record<string, any>;
      for (const [key2, value2] of Object.entries(value1)) {
        result[key1 as unknown as number][`${intToChar(this.depth)}_${key2}`] =
          value2;
      }
    }
    return result;
  };

  computedLabels = () => {
    const { reducables } = this;
    const { indexSet, indices } = this.factor();
    const keys = Object.keys(reducables);

    const result = {} as Record<number, any>;
    for (const index of indexSet) result[index] = {};

    for (let j = 0; j < keys.length; j++) {
      const key = `${intToChar(this.depth)}_${keys[j]}`;
      const { array, reducefn, initialValue } = reducables[keys[j]];

      for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        if (!result?.[index]?.[key]) result[index][key] = initialValue;
        result[index][key] = reducefn(result[index][key], array[i]);
      }
    }

    return result;
  };
}
