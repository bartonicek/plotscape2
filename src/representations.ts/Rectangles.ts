import { Accessor } from "solid-js";
import { RectEncodings } from "../encodingTypes";
import { rectOverlap } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { GraphicLayer } from "../structures/GraphicLayer";
import { Plot } from "../structures/Plot";
import { makeSceneStore } from "../structures/makeSceneStore";
import { makePlotStore } from "../structures/makePlotStore";
import { Tuple2, Tuple4 } from "../types";
import { StackFn, stackRectVertical } from "../wranglers/stackers";
import * as draw from "../drawfuns";

export class Rectangles {
  layers: Record<string, GraphicLayer>;
  encodings: Accessor<RectEncodings[]>;
  stackfn: StackFn<RectEncodings>;
  scales: { x: ScaleContinuous; y: ScaleContinuous };

  localStore: ReturnType<typeof makePlotStore>;
  globalStore: ReturnType<typeof makeSceneStore>;

  constructor(plot: Plot) {
    this.layers = plot.layers;
    this.encodings = plot.wrangler.encodings as Accessor<RectEncodings[]>;
    this.stackfn = stackRectVertical;
    this.scales = plot.scales.data;

    this.localStore = plot.store;
    this.globalStore = plot.scene.store;
  }

  draw = () => {
    const { layers, scales, stackfn } = this;
    const encodings = this.encodings();
    const context = layers.base.context;
    const [scaleX, scaleY] = [scales.x.pushforward, scales.y.pushforward];

    draw.clear(context);

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1, group } = stackfn(encodings[i - 1], encodings[i]);

      const [x0s, x1s] = [x0, x1].map(scaleX);
      const [y0s, y1s] = [y0, y1].map(scaleY);
      const color = graphicParameters.groupColours[group - 1];

      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
    }
  };

  getSelectedCases = (coords: Tuple4<number>) => {
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

    return selectedCases;
  };
}
