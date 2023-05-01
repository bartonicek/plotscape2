import { Accessor, createEffect } from "solid-js";
import html from "solid-js/html";
import { Plot } from "./Plot";

type GraphicLayerOptions = {
  name: string;
  inner: boolean;
  scalingFactor: number;
};

export class GraphicLayer {
  scalingFactor: number;
  width: Accessor<number>;
  height: Accessor<number>;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(plot: Plot, options: GraphicLayerOptions) {
    this.scalingFactor = options.scalingFactor ?? 3;

    const { store } = plot;
    const { inner } = options;
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
      canvas.style.width = this.width() + `px`;
      canvas.style.height = this.height() + `px`;
      canvas.width = Math.ceil(this.width() * this.scalingFactor);
      canvas.height = Math.ceil(this.height() * this.scalingFactor);
      this.context.scale(this.scalingFactor, this.scalingFactor);
    });
  }

  static of = (plot: Plot, options: GraphicLayerOptions) =>
    new GraphicLayer(plot, options);

  clear = () => this.context.clearRect(0, 0, this.width(), this.height());
}
