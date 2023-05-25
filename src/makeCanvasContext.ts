import html from "solid-js/html";
import { Plot } from "./plot/Plot";
import { createEffect } from "solid-js";

type GraphicLayerOptions = {
  name: string;
  inner: boolean;
  scalingFactor?: number;
};

export const makeCanvasContext = (plot: Plot, options: GraphicLayerOptions) => {
  const scalingFactor = options.scalingFactor ?? 3;

  const canvas = html`<canvas />`;
  canvas.classList.add(`plotscape-${options.name}`);
  if (options.inner) {
    canvas.style.marginLeft = plot.store.marginLeft() + "px";
    canvas.style.marginTop = plot.store.marginTop() + "px";
  }

  plot.container.appendChild(canvas);
  const context = canvas.getContext("2d");

  const width = options.inner ? plot.store.innerWidth : plot.store.width;
  const height = options.inner ? plot.store.innerHeight : plot.store.height;

  createEffect(() => {
    const [w, h] = [width(), height()];
    canvas.style.width = w + `px`;
    canvas.style.height = h + `px`;
    canvas.width = Math.ceil(w * scalingFactor);
    canvas.height = Math.ceil(h * scalingFactor);
    context.scale(scalingFactor, scalingFactor);
  });

  return context;
};
