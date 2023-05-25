import { Accessor } from "solid-js";

export type Scale = {
  identity: boolean;
  setDomain?: (lower: Accessor<number>, upper: Accessor<number>) => void;
  setCodomain?: (lower: Accessor<number>, upper: Accessor<number>) => void;
  setValues?: (values: Accessor<string[]>) => void;
  pushforward: (value: any) => number;
  pullback: (value: number) => any;
};
