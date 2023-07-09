import { Accessor, untrack } from "solid-js";
import { Factor } from "../wrangling/Factor";

const NGROUPS = 3;
const addTransient = (x: number) => x & ~128;
const removeTransient = (x: number) => x | 128;

export const group = (n: number) => {
  return NGROUPS - n;
};

export const GROUPS = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

const LABELS = {
  1: { group: GROUPS[1], transient: true, cases: [] },
  2: { group: GROUPS[2], transient: true, cases: [] },
  3: { group: GROUPS[3], transient: true, cases: [] },
  4: { group: GROUPS[4], transient: true, cases: [] },
  129: { group: GROUPS[1], transient: false, cases: [] },
  130: { group: GROUPS[2], transient: false, cases: [] },
  131: { group: GROUPS[3], transient: false, cases: [] },
  132: { group: GROUPS[4], transient: false, cases: [] },
};

export class Marker {
  n: number;
  indices: number[];
  indexSet: Set<number>;
  labels: Record<number, Record<string, any>>;

  cases: Accessor<number[]>;
  group: Accessor<number>;

  constructor(n: number, cases: Accessor<number[]>, group: Accessor<number>) {
    this.n = n;

    this.indices = Array<number>(n).fill(removeTransient(GROUPS[1]));
    this.indexSet = new Set([0, 1, 2, 3, 4, 129, 130, 131, 132]);
    this.labels = LABELS;
    this.cases = cases;
    this.group = group;
  }

  clearAll = () => this.indices.fill(removeTransient(GROUPS[1]));
  clearTransient = () => {
    const { indices } = this;
    for (let i = 0; i < indices.length; i++) {
      indices[i] = removeTransient(indices[i]);
    }
  };

  factor = () => {
    const { indices, indexSet, labels } = this;
    const [cases, group] = [this.cases(), untrack(this.group)];
    const n = cases.length;

    if (group === 128) {
      for (let i = 0; i < n; i++) {
        indices[cases[i]] = addTransient(indices[cases[i]]);
      }
    } else for (let i = 0; i < n; i++) indices[cases[i]] = group;

    return new Factor(indices, indexSet, labels);
  };
}
