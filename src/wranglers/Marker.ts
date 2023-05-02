import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  untrack,
} from "solid-js";
import { Factor } from "./Factor";

export class Marker {
  n: number;
  indices: number[];
  indexSet: Set<number>;
  labels: Record<number, Record<string, any>>;

  cases: Accessor<number[]>;
  group: Accessor<number>;

  constructor(n: number, cases: Accessor<number[]>, group: Accessor<number>) {
    this.n = n;

    this.indices = Array<number>(n).fill(1);
    this.indexSet = new Set([0, 1, 2, 3, 4]);
    this.labels = {
      0: { marker: 0 },
      1: { group: 1, persisent: false },
      2: { group: 2, persistent: false },
      3: { group: 3, persisent: false },
      129: { group: 1, persistent: true },
      130: { group: 2, persistent: true },
      131: { group: 3, persistent: true },
    };

    this.cases = cases;
    this.group = group;
  }

  factor = () => {
    const { indices, indexSet, labels } = this;
    const [cases, group] = [this.cases(), untrack(this.group)];

    if (group === 128) {
      for (let i = 0; i < cases.length; i++)
        indices[cases[i]] = indices[cases[i]] | 128;
    } else {
      for (let i = 0; i < cases.length; i++) {
        indices[cases[i]] = group;
      }
    }

    return new Factor(indices, indexSet, labels);
  };

  // clearTransient = () => {
  //   const { indices } = this;
  //   for (let i = 0; i < indices.length; i++) {
  //     indices[i] = indices[i] & ~128;
  //   }
  // };

  // clearAll = () => {
  //   const { indices } = this;
  //   indices.fill(1);
  // };
}
