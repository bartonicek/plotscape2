import {
  appendToKeys,
  diff,
  disjointUnion,
  mapObject,
  prependToKeys,
  sum,
} from "../funs";

export class Factor {
  singleton: boolean;

  indices: number[];
  indexSet: Set<number>;
  labels: Record<number, Record<string, any>>;

  constructor(
    indices: number[],
    indexSet: Set<number>,
    labels: Record<number, any>,
    singleton = false
  ) {
    this.indices = indices;
    this.indexSet = indexSet;
    this.labels = labels;
    this.singleton = singleton;
  }

  static singleton = () => new Factor([], new Set([0]), { 0: {} }, true);

  static from = (values: string[], labels?: string[]) => {
    labels = labels ? labels : Array.from(new Set(values)).sort();

    const labelObj = {} as Record<string, any>;
    for (let i = 0; i < labels.length; i++)
      labelObj[i] = { label: labels[i], cases: [] };

    const indices = Array(values.length);
    const indexSet = new Set<number>();

    for (let i = 0; i < values.length; i++) {
      const index = labels.indexOf(values[i]);
      indices[i] = index;
      labelObj[index].cases.push(i);
      indexSet.add(index);
    }

    return new Factor(indices, indexSet, labelObj);
  };

  static bin = (values: number[], width?: number, anchor?: number) => {
    const [min, max] = [Math.min(...values), Math.max(...values)];
    const nbins = width ? Math.floor((max - min) / width) + 1 : 10;
    width = width ?? (max - min) / (nbins - 1);
    anchor = anchor ?? min;

    const breakMin = min - width + ((anchor - min) % width);
    const breakMax = max + width - ((max - anchor) % width);

    const breaks = Array(nbins + 2);
    breaks[0] = breakMin;
    breaks[breaks.length - 1] = breakMax;
    for (let i = 1; i < breaks.length; i++) breaks[i] = breakMin + i * width;

    const indices = Array(values.length);
    const indexSet = new Set<number>();

    const labels = {} as Record<number, any>;

    for (let j = 0; j < values.length; j++) {
      const index = breaks.findIndex((br) => br >= values[j]) - 1;
      indices[j] = index;
      indexSet.add(index);
      if (!labels[index]) {
        labels[index] = { cases: [] };
      }
      labels[index].cases.push(j);
    }

    const usedIndices = Array.from(indexSet).sort(diff);
    for (let k = 0; k < usedIndices.length; k++) {
      const [lwr, upr] = [usedIndices[k], usedIndices[k] + 1];
      Object.assign(labels[usedIndices[k]], {
        binMin: breaks[lwr],
        binMax: breaks[upr],
      });
    }

    return new Factor(indices, indexSet, labels);
  };

  static product = (...factors: Factor[]) => {
    factors = factors.filter((x) => !x.singleton);
    if (factors.length === 0) return Factor.singleton(); // All singletons
    if (factors.length === 1) return factors[0]; // One non-singleton factor

    const n = factors[0].indices.length;
    const indices = Array(n);
    const indexSet = new Set<number>();
    const labels = {} as Record<number, any>;

    for (let i = 0; i < n; i++) {
      const factorIndices = factors.map((x) => x.indices[i]);

      // Combined index determines order, first factor has biggest weight,...
      const combinedIndex = parseInt(factorIndices.join(""), 10);

      if (!indexSet.has(combinedIndex)) {
        labels[combinedIndex] = factors.reduce((result, nextFactor, k) => {
          const labelsCopy = { ...nextFactor.labels[factorIndices[k]] };
          delete labelsCopy.cases;
          return disjointUnion(result, labelsCopy);
        }, {});
        labels[combinedIndex].cases = [];
        indexSet.add(combinedIndex);
      }

      labels[combinedIndex].cases.push(i);
      indices[i] = combinedIndex;
    }

    return new Factor(indices, indexSet, labels);
  };
}
