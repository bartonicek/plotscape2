import { Accessor, createMemo } from "solid-js";
import { Scale } from "./Scale";
import { Tuple2 } from "../types";
import { call, just } from "../funs";
export class ScaleDiscrete implements Scale {
  identity: boolean;
  domain: Tuple2<Accessor<number>>;
  codomain: Tuple2<Accessor<number>>;
  expand: Tuple2<Accessor<number>>;
  values: Accessor<string[]>;
  positions: Accessor<number[]>;

  constructor() {
    this.identity = false;
    this.domain = [just(0), just(1)];
    this.codomain = [just(0), just(1)];
    this.expand = [just(0), just(1)];
    this.values = () => [];
    this.positions = createMemo(() => {
      const length = this.values().length;
      return Array.from(Array(length), (_, i) => (i + 1) / (length + 1));
    });
  }

  setValues = (values: Accessor<string[]>) => {
    this.values = values;
    return this;
  };

  setCodomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.codomain = [createMemo(lower), createMemo(upper)];
    return this;
  };

  setExpand = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.expand = [createMemo(lower), createMemo(upper)];
    return this;
  };

  domainRange = () => 1;
  codomainRange = () => this.codomain[1]() - this.codomain[0]();

  pushforward = (value: string) => {
    const { values, positions, codomain, codomainRange } = this;
    return (
      codomain[0]() + positions()[values().indexOf(value)] * codomainRange()
    );
  };

  pullback = (value: number) => {};
}
