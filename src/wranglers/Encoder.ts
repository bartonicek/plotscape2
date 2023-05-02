import { Accessor, Setter, createSignal } from "solid-js";
import { identity, mapObject } from "../funs";

type LimitStore = {
  min: Accessor<number>;
  max: Accessor<number>;
  setMin: Setter<number>;
  setMax: Setter<number>;
};

export class Encoder {
  output: Accessor<Record<string, any>[][]>;
  encodefn: (label: Record<string, string>[]) => Record<string, string>;
  trackLimits: Record<string, boolean>;

  encodingKeys: string[];
  limits: Record<string, LimitStore>;

  constructor(output: Accessor<Record<string, any>[][]>) {
    this.output = output;
    this.encodefn = identity;
    this.trackLimits = {};
    this.limits = {};
    this.encodingKeys = [];
  }

  encode = (
    encodefn: (label: Record<string, string>[]) => Record<string, string>,
    continuous: Record<string, boolean>
  ) => {
    this.encodefn = encodefn;
    this.trackLimits = continuous;

    const initial = encodefn(this.output()[0]);
    this.encodingKeys = Object.keys(initial);

    this.limits = mapObject(initial, (key) => {
      if (!continuous[key]) return;
      const [min, setMin] = createSignal(Infinity);
      const [max, setMax] = createSignal(-Infinity);
      return [key, { min, setMin, max, setMax }];
    });
  };

  encodings = () => {
    const output = this.output();
    const { encodefn, trackLimits, limits, encodingKeys } = this;

    const result = Array(output.length);

    // Reset the limits of all continuous encodings
    for (const key of encodingKeys) {
      if (!trackLimits[key]) continue;
      limits[key].setMin(Infinity);
      limits[key].setMax(-Infinity);
    }

    for (let i = 0; i < output.length; i++) {
      result[i] = encodefn(output[i]);
      for (const key of encodingKeys) {
        if (!trackLimits[key]) continue;
        limits[key].setMin((value) => Math.min(value, result[i][key]));
        limits[key].setMax((value) => Math.max(value, result[i][key]));
      }
    }

    return result;
  };
}
