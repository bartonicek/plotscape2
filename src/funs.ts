export const diff = (x: number, y: number) => x - y;
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

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const intToChar = (int: number) => String.fromCharCode(int + 97);
