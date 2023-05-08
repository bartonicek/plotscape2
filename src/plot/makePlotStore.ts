import { createEffect, createSignal } from "solid-js";
import { just, toInt } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { Plot } from "./Plot";

export const makePlotStore = (plot: Plot) => {
  const { container } = plot;

  const [active, setActive] = createSignal(false);
  const activate = () => {
    setActive(true);
    plot.container.classList.add("active");
  };

  const deactivate = () => {
    setActive(false);
    plot.container.classList.remove("active");
  };

  const [width, setWidth] = createSignal(
    toInt(getComputedStyle(container)["width"])
  );

  const [height, setHeight] = createSignal(
    toInt(getComputedStyle(container)["height"])
  );

  const [holding, setHolding] = createSignal(false);
  const [mouseX, setMouseX] = createSignal(0);
  const [mouseY, setMouseY] = createSignal(0);
  const [clickX, setClickX] = createSignal(0);
  const [clickY, setClickY] = createSignal(0);

  const { marginLines, fontsize } = graphicParameters;
  const marginBottom = just(marginLines[0] * fontsize);
  const marginLeft = just(marginLines[1] * fontsize);
  const marginTop = just(marginLines[2] * fontsize);
  const marginRight = just(marginLines[3] * fontsize);

  const innerClickX = () => {
    return clickX() - marginLeft();
  };

  const innerWidth = () => width() - marginLeft() - marginRight();
  const innerHeight = () => height() - marginBottom() - marginTop();
  const innerLeft = marginLeft;
  const innerRight = () => width() - marginRight();
  const innerBottom = marginBottom;
  const innerTop = () => height() - marginTop();

  const signals = {
    active,
    width,
    height,
    holding,
    mouseX,
    mouseY,
    clickX,
    clickY,
    innerWidth,
    innerHeight,
    innerLeft,
    innerRight,
    innerTop,
    innerBottom,
    marginBottom,
    marginLeft,
    marginTop,
    marginRight,
    innerClickX,
    activate,
    deactivate,
    setWidth,
    setHeight,
    setHolding,
    setMouseX,
    setMouseY,
    setClickX,
    setClickY,
  };

  return signals;
};
