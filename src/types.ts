export type ReduceFn<T, U> = (result: U, nextValue: T) => U;
export type Reducer<T, U> = { reducefn: ReduceFn<T, U>; initialValue: U };
