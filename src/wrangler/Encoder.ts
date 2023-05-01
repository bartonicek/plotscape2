import { Accessor, Setter, createSignal } from "solid-js";
import { mapObject } from "../funs";

type LimitStore = {
  min: Accessor<number>;
  max: Accessor<number>;
  setMin: Setter<number>;
  setMax: Setter<number>;
};

export class Encoder {
  output: Accessor<Record<string, any>[][]>;
  encodefn: (label: Record<string, string>[]) => Record<string, string>;
  continuous: Record<string, boolean>;

  encodingKeys: string[];
  limits: Record<string, LimitStore>;

  constructor(
    output: Accessor<Record<string, any>[][]>,
    encodefn: (label: Record<string, string>[]) => Record<string, string>,
    continuous: Record<string, boolean>
  ) {
    this.output = output;
    this.encodefn = encodefn;
    this.continuous = continuous;

    const initial = encodefn(output()[0]);
    this.encodingKeys = Object.keys(initial);

    this.limits = mapObject(initial, (key) => {
      if (!continuous[key]) return;
      const [min, setMin] = createSignal(Infinity);
      const [max, setMax] = createSignal(-Infinity);
      return [key, { min, setMin, max, setMax }];
    });
  }

  encodings = () => {
    const output = this.output();
    const { encodefn, continuous, limits, encodingKeys } = this;

    const result = Array(output.length);

    // Reset the limits of all continuous encodings
    for (const key of encodingKeys) {
      if (!continuous[key]) continue;
      limits[key].setMin(Infinity);
      limits[key].setMax(-Infinity);
    }

    for (let i = 0; i < output.length; i++) {
      result[i] = encodefn(output[i]);
      for (const key of encodingKeys) {
        if (!continuous[key]) continue;
        limits[key].setMin((value) => Math.min(value, result[i][key]));
        limits[key].setMax((value) => Math.max(value, result[i][key]));
      }
    }

    return result;
  };
}
