export type Tuple2<T> = [T, T];
export type Tuple4<T> = [T, T, T, T];

export type Dataframe = Record<string, any[]>;

export type ReduceFn<T, U> = (result: U, nextValue: T) => U;
export type Reducer<T, U> = { reducefn: ReduceFn<T, U>; initialValue: U };
