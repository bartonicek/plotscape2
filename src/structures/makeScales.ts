import { ScaleContinuous } from "../scales/ScaleContinuous";
import { ScaleIdentity } from "../scales/ScaleIdentity";
import { Plot } from "./Plot";
import { just } from "../funs";

export const makeScales = (plot: Plot) => {
  const {
    width,
    height,
    innerWidth,
    innerHeight,
    innerLeft,
    innerRight,
    innerBottom,
    innerTop,
  } = plot.store;

  const outerPctX = new ScaleContinuous()
    .setDomain(just(0), just(1))
    .setCodomain(just(0), width);

  const outerPctY = new ScaleContinuous()
    .setDomain(just(0), just(1))
    .setCodomain(just(0), height);

  const innerPctX = new ScaleContinuous()
    .setDomain(just(0), just(1))
    .setCodomain(innerLeft, innerRight);

  const innerPctY = new ScaleContinuous()
    .setDomain(just(0), just(1))
    .setCodomain(innerBottom, innerTop);

  const outerAbsX = new ScaleIdentity();
  const outerAbsY = new ScaleIdentity();

  const dataX = new ScaleContinuous()
    .setCodomain(just(0), innerWidth)
    .setExpand(just(0.1), just(0.1));
  const dataY = new ScaleContinuous()
    .setCodomain(just(0), innerHeight)
    .setExpand(just(0.1), just(0.1));

  return {
    outerPct: { x: outerPctX, y: outerPctY },
    innerPct: { x: innerPctX, y: innerPctY },
    outerAbs: { x: outerAbsX, y: outerAbsY },
    data: { x: dataX, y: dataY },
  };
};
