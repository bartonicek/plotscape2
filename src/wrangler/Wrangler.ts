import { Accessor, Setter, createMemo, createSignal } from "solid-js";
import { capitalize, invertObject } from "../funs";
import { ReactivePartition } from "./ReactivePartition";
import { Reducer } from "../types";
import { Factor } from "./Factor";

export class Wrangler {
  get: Record<string, Accessor<any>>;
  set: Record<string, Setter<any>>;
  partition: ReactivePartition;

  constructor() {
    this.get = {};
    this.set = {};
    this.partition = new ReactivePartition(() => Factor.singleton());
  }

  bind = (key: string, bindfn: (values?: any) => any) => {
    if (bindfn.length < 1) {
      const [getter, setter] = createSignal(bindfn());
      this.get[key] = createMemo(getter);
      this.set[key] = setter;
      return this;
    }
    this.get[key] = createMemo(() => bindfn(this.get));
    return this;
  };

  bindData = (mapping: Record<string, string>, data: Record<string, any[]>) => {
    for (const [varKey, dataKey] of Object.entries(mapping)) {
      const [getter, setter] = createSignal(data[dataKey]);
      this.get[varKey] = getter;
      this.get["_nothing_"] = () => {};
      this.get["_ones_"] = () =>
        Array(data[Object.keys(data)[0]].length).fill(1);
      this.set[varKey] = setter as Setter<any>;
    }
    return this;
  };

  partitionBy = (...keys: string[]) => {
    this.partition = keys.reduce((result, nextKey) => {
      return result.nest(this.get[nextKey]);
    }, this.partition);
    return this;
  };

  addReducer = <T, U>(
    key: string,
    arrayKey: string,
    reducer: Reducer<T, U>
  ) => {
    this.partition?.addReducer(key, this.get[arrayKey](), reducer);
    return this;
  };

  addStatic = (key: string, value: any) => {
    this.partition?.addStatic(key, value);
    return this;
  };

  output = () => Object.values(this.partition.labels());
}
