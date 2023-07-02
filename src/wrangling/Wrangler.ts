import { Accessor, Setter, createMemo, createSignal } from "solid-js";
import { just, last, relabelWith } from "../funs";
import { Marker } from "../scene/Marker";
import { ReduceFn, Reducer, RelabelFn } from "../types";
import { Factor } from "./Factor";
import { Partition } from "./Partition";

export class Wrangler {
  n: number;

  get: Record<string | symbol, Accessor<any>>;
  set: Record<string | symbol, Setter<any>>;

  partitions: Partition[];
  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;
  limits: Record<string, Accessor<number>>;
  nothing: symbol;

  constructor() {
    this.n = 0;

    this.get = {};
    this.set = {};

    this.reducables = {};
    this.statics = {};
    this.partitions = [new Partition(just(Factor.singleton()))];
    this.limits = {};
    this.nothing = Symbol();
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

  bindMarker = (marker: Marker) => {
    this.get["marker"] = createMemo(marker.factor);
    return this;
  };

  bindData = (mapping: Record<string, string>, data: Record<string, any[]>) => {
    this.n = data[Object.keys(data)[0]].length;
    for (const [varKey, dataKey] of Object.entries(mapping)) {
      const [getter, setter] = createSignal(data[dataKey]);
      this.get[varKey] = getter;
      this.get[this.nothing] = () => Array(this.n).fill(0);
      this.set[varKey] = setter as Setter<any>;
    }
    return this;
  };

  partitionBy = (...keys: string[]) => {
    let partition = this.partitions[this.partitions.length - 1];
    for (const key of keys) {
      partition = partition.nest(this.get[key]);
      this.partitions.push(partition);
    }
    return this;
  };

  addReducer = <T, U>(
    key: string,
    reducer: Reducer<T, U>,
    arrayKey?: string
  ) => {
    const { get, nothing, partitions } = this;
    const array = get[arrayKey ?? nothing]();
    for (const partition of partitions) {
      partition.addReducer(key, array, reducer);
    }
    return this;
  };

  addStatic = (key: string, value: any) => {
    for (const partition of this.partitions) partition.addStatic(key, value);
    return this;
  };
}
