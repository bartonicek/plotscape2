import { Accessor, createMemo } from "solid-js";
import { Scale } from "./Scale";
import { Tuple2 } from "../types";
import { call, just } from "../funs";

export class ScaleContinuous implements Scale<number> {
  domain: Tuple2<Accessor<number>>;
  codomain: Tuple2<Accessor<number>>;
  expand: Tuple2<Accessor<number>>;

  constructor() {
    this.domain = [just(0), just(1)];
    this.codomain = [just(0), just(1)];
    this.expand = [just(0), just(0)];
  }

  static of = () => new ScaleContinuous();

  setDomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    this.domain = [createMemo(lower), createMemo(upper)];
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
    const { domain, codomain, expand } = this;
    let [domainMin, domainMax] = domain.map(call);
    const [codomainMin, codomainMax] = codomain.map(call);
    const [expandMin, expandMax] = expand.map(call);

    // Rescale domain by expand
    let domainRange = domainMax - domainMin;
    domainMin = domainMin - expandMin * domainRange;
    domainMax = domainMax + expandMax * domainRange;
    domainRange = domainMax - domainMin;

    const codomainRange = codomainMax - codomainMin;

    return codomainMin + ((value - domainMin) / domainRange) * codomainRange;
  };

  pullback = (value: number) => {
    const { domain, codomain, expand } = this;
    let [domainMin, domainMax] = domain.map(call);
    const [codomainMin, codomainMax] = codomain.map(call);
    const [expandMin, expandMax] = expand.map(call);

    // Rescale domain by expand
    let domainRange = domainMax - domainMin;
    domainMin = domainMin - expandMin * domainRange;
    domainMax = domainMax + expandMax * domainRange;
    domainRange = domainMax - domainMin;

    const codomainRange = codomainMax - codomainMin;

    return domainMin + ((value - codomainMin) / codomainRange) * domainRange;
  };
}
