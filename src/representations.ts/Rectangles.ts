import { Accessor, createEffect, untrack } from "solid-js";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { GraphicLayer } from "../structures/GraphicLayer";
import { makeLocalStore } from "../structures/makeLocalStore";
import { makeGlobalStore } from "../structures/makeGlobalStore";
import { Plot } from "../structures/Plot";
import { rectOverlap } from "../funs";
import { Tuple2 } from "../types";

export class Rectangles {
  layers: Record<string, GraphicLayer>;
  encodings: Accessor<Record<string, any>[]>;
  scales: { x: ScaleContinuous; y: ScaleContinuous };
  localStore: ReturnType<typeof makeLocalStore>;
  globalStore: ReturnType<typeof makeGlobalStore>;

  constructor(plot: Plot) {
    this.layers = plot.layers;
    this.encodings = plot.encoder.encodings;
    this.scales = plot.scales.data;
    this.localStore = plot.store;
    this.globalStore = plot.scene.store;
  }

  draw = () => {
    const { layers, scales } = this;
    const encodings = this.encodings();
    const context = layers.base.context;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "steelblue";

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1 } = encodings[i];
      const [x0s, x1s] = [x0, x1].map(scales.x.pushforward);
      const [y0s, y1s] = [y0, y1].map(scales.y.pushforward);
      const [w, h] = [x1s - x0s, y1s - y0s];
      context.fillRect(x0s, scales.y.codomain[1] - y0s, w, -h);
      context.strokeRect(x0s, scales.y.codomain[1] - y0s, w, -h);
    }
  };

  updateSelection = () => {
    const { scales } = this;
    const encodings = untrack(this.encodings);

    const { clickX, clickY, mouseX, mouseY } = this.localStore;
    const selX = [clickX(), mouseX()] as Tuple2<number>;
    const selY = [clickY(), mouseY()] as Tuple2<number>;

    const selectedCases: number[] = [];

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1, cases } = encodings[i];
      const xs = [x0, x1].map(scales.x.pushforward) as Tuple2<number>;
      const ys = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
      if (rectOverlap(xs, ys, selX, selY)) selectedCases.push(...cases);
    }

    // console.log(selectedCases)
    // this.globalStore.setSelectedCases(selectedCases);
  };
}
