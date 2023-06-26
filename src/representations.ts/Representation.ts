import { StackFn, Tuple4 } from "../types";

export type Representation = {
  stack: (
    depth: number,
    stackfn: StackFn<number>,
    initialValue: number
  ) => Representation;
  draw: () => void;
  checkSelection: (selectionRect: Tuple4<number>) => number[];
};
