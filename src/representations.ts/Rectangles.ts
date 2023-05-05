import { Accessor, createEffect, untrack } from "solid-js";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { GraphicLayer } from "../structures/GraphicLayer";
import { makeLocalStore } from "../structures/makeLocalStore";
import { makeGlobalStore } from "../structures/makeGlobalStore";
import { Plot } from "../structures/Plot";
import { rectOverlap, stackerIdentity, stackerRect } from "../funs";
import { Tuple2, Tuple4 } from "../types";
import { graphicParameters } from "../graphicParameters";

export class Rectangles {
  layers: Record<string, GraphicLayer>;
  encodings: Accessor<Record<string, any>[]>;
  scales: { x: ScaleContinuous; y: ScaleContinuous };
  localStore: ReturnType<typeof makeLocalStore>;
  globalStore: ReturnType<typeof makeGlobalStore>;

  constructor(plot: Plot) {
    this.layers = plot.layers;
    this.encodings = plot.wrangler.encodings;
    this.scales = plot.scales.data;
    this.localStore = plot.store;
    this.globalStore = plot.scene.store;
  }

  draw = () => {
    const { layers, scales } = this;
    const encodings = this.encodings();
    const context = layers.base.context;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1, group } = stackerRect(
        encodings[i - 1],
        encodings[i]
      );

      const [x0s, x1s] = [x0, x1].map(scales.x.pushforward);
      const [y0s, y1s] = [y0, y1].map(scales.y.pushforward);

      context.fillStyle = graphicParameters.groupColours[group];

      const [w, h] = [x1s - x0s, y1s - y0s];
      context.fillRect(x0s, scales.y.codomain[1]() - y0s, w, -h);
      context.strokeRect(x0s, scales.y.codomain[1]() - y0s, w, -h);
    }
  };

  updateSelection = (coords: number[]) => {
    const { scales } = this;
    const encodings = this.encodings();

    const selX = [coords[0], coords[2]] as Tuple2<number>;
    const selY = [coords[1], coords[3]] as Tuple2<number>;
    const selectedCases: number[] = [];

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1, cases } = encodings[i];
      const objX = [x0, x1].map(scales.x.pushforward) as Tuple2<number>;
      const objY = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
      if (rectOverlap(objX, objY, selX, selY)) selectedCases.push(...cases);
    }

    return this.globalStore.setSelectedCases(selectedCases);
  };
}
