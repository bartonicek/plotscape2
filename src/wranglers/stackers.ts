import { RectEncodings } from "../encodingTypes";
import { just } from "../funs";
import { CombineFn, CompareFn } from "../types";

export const makeStacker =
  <T extends Record<string, any>>(
    comparefn: CompareFn<T>,
    stackfn: CombineFn<T>
  ) =>
  (result: T, nextValue: T) => {
    if (!result) return nextValue;
    if (!comparefn(result, nextValue)) return nextValue;
    return stackfn(result, nextValue);
  };

export type StackFn<T extends Record<string, any>> = ReturnType<
  typeof makeStacker<T>
>;

export const stackRectVertical = makeStacker<RectEncodings>(
  (result, nextValue) => result.x0 === nextValue.x0,
  (result, nextValue) => {
    nextValue.y0 = result.fill;
    nextValue.fill = result.fill + nextValue.fill;
    return nextValue;
  }
);

export const stackRectIdentity = makeStacker<RectEncodings>(
  just(true),
  (_, nextValue) => {
    nextValue.y1 = nextValue.fill;
    return nextValue;
  }
);
