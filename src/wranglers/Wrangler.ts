import { Accessor, Setter, createMemo, createSignal } from "solid-js";
import { Reducer } from "../types";
import { Factor } from "./Factor";
import { Marker } from "./Marker";
import { ReactivePartition } from "./ReactivePartition";
import { identity, just } from "../funs";

export class Wrangler {
  get: Record<string, Accessor<any>>;
  set: Record<string, Setter<any>>;
  partition: ReactivePartition;

  partitions: ReactivePartition[];
  outputs: Accessor<Record<string, any>[]>[];

  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;
  encodefn: (label: Record<string, string>[]) => Record<string, string>;

  constructor() {
    this.get = {};
    this.set = {};

    this.reducables = {};
    this.statics = {};

    this.partition = new ReactivePartition(this, just(Factor.singleton()));
    this.partitions = [this.partition];
    this.outputs = [this.partition.labels];

    this.encodefn = identity;
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
    let partition = this.partition;
    for (const key of keys) {
      partition = partition.nest(this.get[key]);
      this.partitions.push(partition);
      this.outputs.push(partition.labels);
    }
    this.partition = partition;
    return this;
  };

  addReducer = <T, U>(
    key: string,
    arrayKey: string,
    reducer: Reducer<T, U>
  ) => {
    this.reducables[key] = { array: this.get[arrayKey](), ...reducer };
    return this;
  };

  addStatic = (key: string, value: any) => {
    this.statics[key] = value;
    return this;
  };

  output = () => Object.values(this.partition.labels());
}
