import { Accessor, createEffect } from "solid-js";
import html from "solid-js/html";
import { Plot } from "./Plot";

type GraphicLayerOptions = {
  name: string;
  inner: boolean;
  scalingFactor?: number;
};

export class GraphicLayer {
  scalingFactor: number;
  width: Accessor<number>;
  height: Accessor<number>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(plot: Plot, options: GraphicLayerOptions) {
    const { store } = plot;
    const { inner, scalingFactor = 3 } = options;
    this.scalingFactor = scalingFactor ?? 3;
    this.width = inner ? store.innerWidth : store.width;
    this.height = inner ? store.innerHeight : store.height;

    const canvas = html`<canvas />`;
    canvas.classList.add(`plotscape-${options.name}`);
    if (inner) {
      canvas.style.marginLeft = store.marginLeft() + "px";
      canvas.style.marginTop = store.marginTop() + "px";
    }

    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    plot.container.appendChild(canvas);

    createEffect(() => {
      const [width, height] = [this.width(), this.height()];
      canvas.style.width = width + `px`;
      canvas.style.height = height + `px`;
      canvas.width = Math.ceil(width * scalingFactor);
      canvas.height = Math.ceil(height * scalingFactor);
      this.context.scale(this.scalingFactor, scalingFactor);
    });
  }

  static of = (plot: Plot, options: GraphicLayerOptions) =>
    new GraphicLayer(plot, options);

  clear = () => this.context.clearRect(0, 0, this.width(), this.height());
}
