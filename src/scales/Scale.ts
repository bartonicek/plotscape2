import { Accessor } from "solid-js";
import { Tuple2 } from "../types";

export type Scale<T> = {
  domain?: Tuple2<Accessor<number>>;
  codomain?: Tuple2<Accessor<number>>;

  setDomain?: (lower: Accessor<number>, upper: Accessor<number>) => void;
  setCodomain?: (lower: Accessor<number>, upper: Accessor<number>) => void;
  setExpand?: (lower: Accessor<number>, upper: Accessor<number>) => void;

  pushforward: (value: T) => number;
  pullback: (value: number) => T;
};
