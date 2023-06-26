import { RelabelFn } from "../types";

export const binToRectV: RelabelFn = ({ binMin, binMax, empty, summary }) => {
  return { x0: binMin, x1: binMax, y0: empty, y1: summary };
};
