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
      0: { group: 0, persistent: false, cases: [] },
      1: { group: 1, persisent: false, cases: [] },
      2: { group: 2, persistent: false, cases: [] },
      3: { group: 3, persisent: false, cases: [] },
      4: { group: 4, persisent: false, cases: [] },
      129: { group: 1, persistent: true, cases: [] },
      130: { group: 2, persistent: true, cases: [] },
      131: { group: 3, persistent: true, cases: [] },
      132: { group: 4, persisent: true, cases: [] },
    };

    this.cases = cases;
    this.group = group;
  }

  clearAll = () => {
    this.indices.fill(1);
  };

  factor = () => {
    const { indices, indexSet, labels } = this;
    const [cases, group] = [this.cases(), untrack(this.group)];

    if (group === 128) {
      for (let i = 0; i < cases.length; i++) {
        const labelIndex = indices[cases[i]] | 128;
        indices[cases[i]] = labelIndex;
      }
    } else {
      for (let i = 0; i < cases.length; i++) indices[cases[i]] = group;
    }

    return new Factor(indices, indexSet, labels);
  };
}
