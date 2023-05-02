import { Accessor, createMemo } from "solid-js";
import { Scale } from "./Scale";
import { Tuple2 } from "../types";
import { call, just } from "../funs";
export class ScaleDiscrete implements Scale<string> {
  private _domain: Tuple2<Accessor<number>>;
  private _codomain: Tuple2<Accessor<number>>;
  private _expand: Tuple2<Accessor<number>>;
  private _values: Accessor<string[]>;
  private _positions: Accessor<number[]>;

  constructor() {
    this._domain = [just(0), just(1)];
    this._codomain = [just(0), just(1)];
    this._expand = [just(0), just(1)];
    this._values = () => [];
    this._positions = () => {
      const length = this._values().length;
      return Array.from(Array(length), (_, i) => (i + 1) / (length + 1));
    };
  }

  setValues = (values: Accessor<string[]>) => {
    this._values = values;
    return this;
  };

  setCodomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this._codomain = [createMemo(lower), createMemo(upper)];
    return this;
  };

  setExpand = (lower: Accessor<number>, upper: Accessor<number>) => {
    this._expand = [createMemo(lower), createMemo(upper)];
    return this;
  };

  get domain() {
    return this._domain.map(call) as Tuple2<number>;
  }

  get codomain() {
    return this._codomain.map(call) as Tuple2<number>;
  }

  get domainRange() {
    return 1;
  }

  get codomainRange() {
    return this.codomain[1] - this.codomain[0];
  }

  pushforward = (value: string) => {
    const { codomain, codomainRange } = this;
    const [values, positions] = [this._values(), this._positions()];
    return codomain[0] + positions[values.indexOf(value)] * codomainRange;
  };

  pullback = (value: number) => {
    const [values, positions] = [this._values(), this._positions()];
    return values[positions.indexOf(value)];
  };
}
