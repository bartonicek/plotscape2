import { Accessor, untrack } from "solid-js";
import { Factor } from "../wranglers/Factor";

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
      // 0: { group: 0, persistent: false, cases: [] },
      1: { group: 1, persisent: true, cases: [] },
      2: { group: 2, persistent: false, cases: [] },
      3: { group: 3, persisent: true, cases: [] },
      4: { group: 4, persisent: true, cases: [] },
      129: { group: 2, persistent: false, cases: [] },
      130: { group: 2, persistent: true, cases: [] },
      131: { group: 3, persistent: true, cases: [] },
      132: { group: 4, persistent: true, cases: [] },
    };

    this.cases = cases;
    this.group = group;
  }

  clearTransient = () => {
    for (let i = 0; i < this.indices.length; i++) {
      this.indices[i] = this.indices[i] & ~128;
    }
  };

  clearAll = () => {
    this.indices.fill(1);
  };

  factor = () => {
    const { indices, indexSet, labels } = this;
    const [cases, group] = [this.cases(), untrack(this.group)];

    if (group === 128) {
      for (let i = 0; i < cases.length; i++) {
        indices[cases[i]] = indices[cases[i]] | 128;
      }
    } else {
      for (let i = 0; i < cases.length; i++) indices[cases[i]] = group;
    }

    return new Factor(indices, indexSet, labels);
  };
}
