import { Accessor } from "solid-js";
import { Scale } from "./Scale";
import { Tuple2 } from "../types";
import { call, just } from "../funs";

export class ScaleContinuous implements Scale<number> {
  private _domain: Tuple2<Accessor<number>>;
  private _codomain: Tuple2<Accessor<number>>;
  private _expand: Tuple2<Accessor<number>>;

  constructor() {
    this._domain = [just(0), just(1)];
    this._codomain = [just(0), just(1)];
    this._expand = [just(0), just(0)];
  }

  static of = () => new ScaleContinuous();

  setDomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this._domain = [lower, upper];
    return this;
  };

  setCodomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this._codomain = [lower, upper];
    return this;
  };

  setExpand = (lower: Accessor<number>, upper: Accessor<number>) => {
    this._expand = [lower, upper];
    return this;
  };

  get domain() {
    const [domainMin, domainMax, expandMin, expandMax] = [
      this._domain[0](),
      this._domain[1](),
      this._expand[0](),
      this._expand[1](),
    ];

    const range = domainMax - domainMin;
    return [
      domainMin - expandMin * range,
      domainMax + expandMax * range,
    ] as Tuple2<number>;
  }

  get codomain() {
    return [this._codomain[0](), this._codomain[1]()] as Tuple2<number>;
  }

  get domainRange() {
    return this.domain[1] - this.domain[0];
  }

  get codomainRange() {
    return this.codomain[1] - this.codomain[0];
  }

  pushforward = (value: number) => {
    const { domain, codomain, domainRange, codomainRange } = this;
    return codomain[0] + ((value - domain[0]) / domainRange) * codomainRange;
  };

  pullback = (value: number) => {
    const { domain, codomain, domainRange, codomainRange } = this;
    return domain[0] + ((value - codomain[0]) / codomainRange) * domainRange;
  };
}
