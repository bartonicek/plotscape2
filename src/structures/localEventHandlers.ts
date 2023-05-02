import { batch } from "solid-js";
import { callWith, throttle, toInt } from "../funs";
import { Plot } from "./Plot";

export const onResize = (plot: Plot) => () => {
  const { setWidth, setHeight } = plot.store;
  setWidth(toInt(getComputedStyle(plot.container)["width"]));
  setHeight(toInt(getComputedStyle(plot.container)["height"]));
};

export const onMousedownInner = (plot: Plot) => (event: MouseEvent) => {
  const {
    innerHeight,
    setHolding,
    setClickX,
    setClickY,
    setMouseX,
    setMouseY,
  } = plot.store;

  plot.scene.plots.forEach((plot) => plot.deactivate());
  plot.activate();

  const [x, y] = [event.offsetX, innerHeight() - event.offsetY];
  setHolding(true);
  batch(() => {
    setClickX(x), setClickY(y), setMouseX(x), setMouseY(y);
  });
};

export const onMouseup = (plot: Plot) => () => plot.store.setHolding(false);

export const onMousemoveInner = (plot: Plot) => (event: MouseEvent) => {
  if (!plot.store.holding()) return;

  const { innerHeight } = plot.store;
  const { setMouseX, setMouseY } = plot.store;

  const [x, y] = [event.offsetX, innerHeight() - event.offsetY];

  batch(() => {
    setMouseX(x), setMouseY(y);
  });
};

export const onKeyDown = (plot: Plot) => (event: KeyboardEvent) => {
  if (!plot.store.active()) return;

  const key = event.code;
  plot.keyActions[key]?.();
};