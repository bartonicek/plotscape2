import { just } from "../funs";

export const sumReducer = {
  reducefn: (x: number, y: number) => x + y,
  initialValue: just(0),
};

export const countReducer = {
  reducefn: (x: number) => x + 1,
  initialValue: just(0),
};

export const productReducer = {
  reducefn: (x: number, y: number) => x * y,
  initialValue: just(0),
};

export const pushReducer = {
  reducefn: (x: number[], y: number) => {
    x.push(y);
    return x;
  },
  initialValue: () => Array.from(Array(0)),
};
