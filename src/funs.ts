import { Tuple2 } from "./types";

export const identity = (x: any) => x;
export const just = (x: any) => () => x;
export const call = (fn: Function) => fn();
export const callWith =
  <T>(x: T) =>
  (fn: (x: T) => any) =>
    fn(x);

export const last = (x: any[]) => x[x.length - 1];

export const sum = (x: number, y: number) => x + y;
export const diff = (x: number, y: number) => x - y;
export const toInt = (x: string) => parseInt(x, 10);

export const max = (x: number[]) => Math.max.apply(null, x);
export const min = (x: number[]) => Math.min.apply(null, x);

export const getCSS = (element: HTMLElement, property: string) => {
  return getComputedStyle(element)[property as any];
};

export const loadJSON = async (path: string) => {
  const response = await fetch(path);
  return await response.json();
};
export const appendToKeys = (object: object, suffix: string | number) => {
  const result = {} as Record<string, any>;
  for (const [key, value] of Object.entries(object))
    result[key + suffix] = value;
  return result;
};
export const prependToKeys = (object: object, prefix: string | number) => {
  const result = {} as Record<string, any>;
  for (const [key, value] of Object.entries(object))
    result[prefix + key] = value;
  return result;
};

export const mapObject = (
  object: Record<string, any>,
  mapfn: (key: string, value: any) => [string, any] | undefined
) => {
  const result = {} as Record<string, any>;
  for (const [key, value] of Object.entries(object)) {
    const newKeyValue = mapfn(key, value);
    if (newKeyValue) result[newKeyValue[0]] = newKeyValue[1];
  }
  return result;
};

export const invertObject = (object: object) => {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [value, key])
  );
};

export const drillProp = (object: Record<string, any>, path: string): any => {
  const pathArray = path.split(".");
  return pathArray.reduce((result, nextKey) => result[nextKey], object);
};

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const intToChar = (int: number) => String.fromCharCode(int + 97);

export const throttle = (fun: Function, delay: number) => {
  let lastTime = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastTime < delay) return;
    lastTime = now;
    fun(...args);
  };
};

export const rectOverlap = (
  rect1x: Tuple2<number>,
  rect1y: Tuple2<number>,
  rect2x: Tuple2<number>,
  rect2y: Tuple2<number>
) => {
  return !(
    max(rect1x) < min(rect2x) || // If any holds, rectangles don't overlap
    min(rect1x) > max(rect2x) ||
    max(rect1y) < min(rect2y) ||
    min(rect1y) > max(rect2y)
  );
};

export const incrementNumberSuffix = (
  suffixedString: string,
  amount: number
) => {
  const stringArray = suffixedString.split("");
  const len = stringArray.length;
  if (isNaN(+stringArray[len - 1])) return suffixedString + amount;

  // Find frst index of the number suffix, starting from end of the string
  let i = len - 1;
  while (!isNaN(+stringArray[--i]));

  const suffix = parseInt(stringArray.slice(i + 1, len).join(""), 10) + amount;
  return stringArray.slice(0, i + 1).join("") + suffix;
};

export const disjointUnion = (
  object1: Record<string, any>,
  object2: Record<string, any>
) => {
  const [keys1, keys2] = [object1, object2].map(Object.keys);
  const duplicateKeys = keys1.filter((x) => keys2.includes(x));

  if (!duplicateKeys.length) return Object.assign({}, object1, object2);

  const newKeys1 = duplicateKeys.map((x) => incrementNumberSuffix(x, 0));
  const newKeys2 = duplicateKeys.map((x) => incrementNumberSuffix(x, 1));

  const object1Copy: Record<string, any> = {};
  const object2Copy: Record<string, any> = {};

  const [values1, values2] = [object1, object1].map(Object.values);
  for (let i = 0; i < values1.length; i++) {
    object1Copy[newKeys1[i]] = values1[i];
  }
  for (let j = 0; j < values2.length; j++) {
    object2Copy[newKeys2[j]] = values2[j];
  }

  return Object.assign({}, object1Copy, object2Copy);
};

export const prettyBreaks = (lower: number, upper: number, n = 4) => {
  const range = upper - lower;
  const unitGross = range / n;
  const base = Math.floor(Math.log10(unitGross));

  const neatValues = [1, 2, 4, 5, 10];
  const dists = neatValues.map((e) => (e - unitGross / 10 ** base) ** 2);
  const unitNeat = 10 ** base * neatValues[dists.indexOf(min(dists))];

  const minimumNeat = Math.ceil(lower / unitNeat) * unitNeat;
  const maximumNeat = Math.floor(upper / unitNeat) * unitNeat;

  const middle = Array.from(
    Array(Math.round((maximumNeat - minimumNeat) / unitNeat - 1)),
    (_, i) => minimumNeat + (i + 1) * unitNeat
  );
  const breaks = [minimumNeat, ...middle, maximumNeat].map((e) =>
    parseFloat(e.toFixed(4))
  );

  return breaks;
};
