export const just = (x: any) => () => x;
export const call = (fn: Function) => fn();
export const callWith =
  <T>(x: T) =>
  (fn: (x: T) => any) =>
    fn(x);

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

export const throttle = (delay: number) => (fun: Function) => {
  let lastTime = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastTime < delay) return;
    lastTime = now;
    fun(...args);
  };
};
