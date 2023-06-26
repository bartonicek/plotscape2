import { Accessor } from "solid-js";
import { just } from "../funs";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { ScaleData } from "../scales/ScaleData";
import { ScaleIdentity } from "../scales/ScaleIdentity";
import { Plot } from "./Plot";
import { makePlotStore } from "./makePlotStore";

export const makeScales = (store: ReturnType<typeof makePlotStore>) => {
  const inner = {
    abs: {
      x: new ScaleIdentity(),
      y: new ScaleIdentity(),
    },
    pct: {
      x: new ScaleContinuous().setCodomain(just(0), store.innerWidth),
      y: new ScaleContinuous().setCodomain(just(0), store.innerHeight),
    },
    data: {
      x: new ScaleData().setCodomain(just(0), store.innerWidth),
      y: new ScaleData().setCodomain(just(0), store.innerHeight),
    },
  };

  const outer = {
    abs: {
      x: new ScaleIdentity(),
      y: new ScaleIdentity(),
    },
    pct: {
      x: new ScaleContinuous().setCodomain(just(0), store.width),
      y: new ScaleContinuous().setCodomain(just(0), store.height),
    },
    data: {
      x: new ScaleData().setCodomain(store.innerLeft, store.innerRight),
      y: new ScaleData().setCodomain(store.innerBottom, store.innerTop),
    },
  };

  return { inner, outer };
};
