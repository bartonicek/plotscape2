import { clear } from "../drawfuns";
import { Scene } from "./Scene";

export const onDoubleClick = (scene: Scene) => () => {
  scene.plots.forEach((plot) => plot.deactivate());
  scene.marker.clearAll();
  scene.store.setGroup(128);
  scene.store.setSelectedCases([]);
};

export const onMousedown = (scene: Scene) => (event: MouseEvent) => {
  const target = event.target;
  scene.plots.forEach((plot) => clear(plot.user)); // Clear drag rectangles
  // Only deactivate if clicked outside of any plot area
  if (
    target instanceof Element &&
    target.classList.value === "plotscape-scene"
  ) {
    scene.plots.forEach((plot) => plot.store.deactivate());
  }
};

export const onKeyDown = (scene: Scene) => (event: KeyboardEvent) => {
  const key = event.code;
  scene.keyActions[key]?.();
};

export const onKeyUp = (scene: Scene) => () => {
  scene.store.setGroup(128);
};
