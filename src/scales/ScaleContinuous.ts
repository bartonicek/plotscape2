import { Accessor, createMemo } from "solid-js";
import { just } from "../funs";
import { Tuple2 } from "../types";
import { Scale } from "./Scale";

export class ScaleContinuous implements Scale {
  identity: boolean;
  domain: Tuple2<Accessor<number>>;
  codomain: Tuple2<Accessor<number>>;
  expand: Tuple2<Accessor<number>>;

  constructor() {
    this.identity = false;
    this.domain = [just(0), just(1)];
    this.codomain = [just(0), just(1)];
    this.expand = [just(0), just(0)];
  }

  static of = () => new ScaleContinuous();

  domainRange = () => this.domain[1]() - this.domain[0]();
  codomainRange = () => this.codomain[1]() - this.codomain[0]();

  setDomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    // Need to expand the domain
    const [expandLower, expandUpper] = this.expand;
    const range = () => upper() - lower();
    const newLower = () => lower() - expandLower() * range();
    const newUpper = () => upper() + expandUpper() * range();
    this.domain = [createMemo(newLower), createMemo(newUpper)];
    return this;
  };

  setCodomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.codomain = [lower, upper];
    return this;
  };

  setExpand = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.expand = [lower, upper];
    return this;
  };

  pushforward = (value: number) => {
    const { domain, codomain, domainRange, codomainRange } = this;
    return (
      codomain[0]() + ((value - domain[0]()) / domainRange()) * codomainRange()
    );
  };

  pullback = (value: number) => {
    const { domain, codomain, domainRange, codomainRange } = this;
    return (
      domain[0]() + ((value - codomain[0]()) / codomainRange()) * domainRange()
    );
  };
}
