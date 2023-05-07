import { makeSceneStore } from "./structures/makeSceneStore";
import { makePlotStore } from "./structures/makePlotStore";

export type Tuple2<T> = [T, T];
export type Tuple4<T> = [T, T, T, T];

export type Dataframe = Record<string, any[]>;

export type ReduceFn<T, U> = (result: U, nextValue: T) => U;
export type Reducer<T, U> = { reducefn: ReduceFn<T, U>; initialValue: U };

export type CombineFn<T> = (x: T, y: T) => T;
export type CompareFn<T> = (x: T, y: T) => boolean;
export type EncodeFn = (label: Record<string, any>[]) => Record<string, any>;

export type PlotStore = ReturnType<typeof makePlotStore>;
export type SceneStore = ReturnType<typeof makeSceneStore>;
