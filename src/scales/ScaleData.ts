import { Accessor } from "solid-js";
import { just } from "../funs";
import { Tuple2 } from "../types";
import { ScaleContinuous } from "./ScaleContinuous";
import { ScaleDiscrete } from "./ScaleDiscrete";
import { ScaleIdentity } from "./ScaleIdentity";
import { Scale } from "./Scale";

export class ScaleData {
  identity: boolean;
  scale: Scale;
  domain: Tuple2<Accessor<number>>;
  codomain: Tuple2<Accessor<number>>;
  expand: Tuple2<Accessor<number>>;

  constructor() {
    this.identity = true;
    this.scale = new ScaleIdentity();
    this.domain = [just(0), just(1)];
    this.codomain = [just(0), just(1)];
    this.expand = [just(0.1), just(0.1)];
  }

  pushforward = (value: number) => this.scale.pushforward(value);
  pullback = (value: number) => this.scale.pullback(value);

  setCodomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    if (!this.identity) {
      this.scale.setCodomain!(lower, upper);
      return this;
    }
    this.codomain = [lower, upper];
    return this;
  };

  // Setting domain changes scale to Continuous
  setDomain = (lower: Accessor<number>, upper: Accessor<number>) => {
    if (!this.scale.identity) {
      this.domain = [lower, upper];
      this.scale.setDomain!(lower, upper);
      return this;
    }
    this.identity = false;
    this.domain = [lower, upper];
    this.scale = new ScaleContinuous()
      .setExpand(just(0.1), just(0.1))
      .setDomain(lower, upper)
      .setCodomain(...this.codomain);
    return this;
  };

  // Setting values changes scale to Discrete
  setValues = (values: Accessor<string[]>) => {
    if (!this.scale.identity) {
      this.scale.setValues!(values);
      return this;
    }
    this.identity = false;
    this.scale = new ScaleDiscrete()
      .setExpand(just(0.1), just(0.1))
      .setValues(values)
      .setCodomain(...this.codomain)
      .setExpand(...this.expand);
    return this;
  };
}
