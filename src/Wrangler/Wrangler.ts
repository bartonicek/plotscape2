import { Accessor, Setter, createSignal } from "solid-js";
import { capitalize } from "../funs";
import { ReactivePartition } from "./ReactivePartition";
import { Reducer } from "../types";

export class Wrangler {
  getters: Record<string, Accessor<any>>;
  setters: Record<string, Setter<any>>;
  partition?: ReactivePartition;

  constructor() {
    this.getters = {};
    this.setters = {};
  }

  bind = (key: string, bindfn: (values?: any) => any) => {
    if (bindfn.length < 1) {
      const [getter, setter] = createSignal(bindfn());
      this.getters[key] = getter;
      this.setters[`set${capitalize(key)}`] = setter;
      return this;
    }
    this.getters[key] = () => bindfn(this.getters);
    return this;
  };

  bindData = (data: Record<string, any[]>, mapping: Record<string, string>) => {
    for (const [varKey, dataKey] of Object.entries(mapping)) {
      const [getter, setter] = createSignal(data[dataKey]);
      this.getters[varKey] = getter;
      this.setters[`set${capitalize(varKey)}`] = setter as Setter<any>;
    }
    return this;
  };

  partitionBy = (...keys: string[]) => {
    const partition = new ReactivePartition(this.getters[keys.shift()!]);
    if (!keys.length) {
      this.partition = partition;
      return this;
    }
    this.partition = keys.reduce((result, nextKey) => {
      return result.nest(this.getters[nextKey]);
    }, partition);
    return this;
  };

  addReducer = <T, U>(
    key: string,
    arrayKey: string,
    reducer: Reducer<T, U>
  ) => {
    this.partition?.addReducer(key, this.getters[arrayKey](), reducer);
    return this;
  };
}
