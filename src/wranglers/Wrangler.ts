import { Accessor, Setter, createMemo, createSignal } from "solid-js";
import { EncodeFn, ReduceFn, Reducer } from "../types";
import { Factor } from "./Factor";
import { Marker } from "./Marker";
import { ReactivePartition } from "./ReactivePartition";
import { identity, just, last, mapObject, rectOverlap } from "../funs";

export class Wrangler {
  get: Record<string, Accessor<any>>;
  set: Record<string, Setter<any>>;

  partitions: ReactivePartition[];
  encodefn: EncodeFn;
  limits: Record<string, Accessor<number>>;

  reducables: Record<string, { array: any[] } & Reducer<any, any>>;
  statics: Record<string, any>;

  constructor() {
    this.get = {};
    this.set = {};

    this.reducables = {};
    this.statics = {};

    this.encodefn = identity;
    this.limits = {};
    this.partitions = [new ReactivePartition(this, just(Factor.singleton()))];
  }

  encode = (encodefn: EncodeFn) => {
    this.encodefn = encodefn;
    this.partitions.forEach((partition) => (partition.encodefn = encodefn));
    return this;
  };

  trackLimits = (
    limitObject: Record<
      string,
      [ReduceFn<number, number>, (label: Record<string, any>) => number, number]
    >
  ) => {
    for (const [key, [reducefn, selector, initialValue]] of Object.entries(
      limitObject
    )) {
      this.limits[key] = () =>
        this.encodings().reduce(
          (result, nextValue) => reducefn(result, selector(nextValue)),
          initialValue
        );
    }
    return this;
  };

  encodings = () =>
    Object.values(last(this.partitions).encodings()) as Record<string, any>[];

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
    let partition = this.partitions[this.partitions.length - 1];
    for (const key of keys) {
      partition = partition.nest(this.get[key]);
      this.partitions.push(partition);
    }
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
}
