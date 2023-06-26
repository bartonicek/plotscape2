import { Accessor } from "solid-js";
import * as draw from "../drawfuns";
import { rectOverlap } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { GraphicLayer } from "../plot/GraphicLayer";
import { Plot } from "../plot/Plot";
import { makePlotStore } from "../plot/makePlotStore";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { makeSceneStore } from "../scene/makeSceneStore";
import { Tuple2, Tuple4 } from "../types";
import { StackFn, stackRectVertical } from "../wrangling/stackers";
import { BarEncodings, RectEncodings } from "../encodingTypes";
import { ScaleDiscrete } from "../scales/ScaleDiscrete";

export class Bars {
  layers: Record<string, GraphicLayer>;
  encodings: Accessor<BarEncodings[]>;
  stackfn: StackFn<RectEncodings>;
  scales: { x: ScaleDiscrete; y: ScaleContinuous };

  localStore: ReturnType<typeof makePlotStore>;
  globalStore: ReturnType<typeof makeSceneStore>;

  constructor(plot: Plot) {
    this.layers = plot.layers;
    this.encodings = plot.wrangler.encodings as Accessor<BarEncodings[]>;
    this.stackfn = stackRectVertical;
    this.scales = plot.scales.dataInner;

    this.localStore = plot.store;
    this.globalStore = plot.scene.store;
  }

  draw = () => {
    const { layers, scales, stackfn } = this;
    const encodings = this.encodings();
    const context = layers.base.context;
    const [scaleX, scaleY] = [scales.x.pushforward, scales.y.pushforward];

    const width = scaleX(encodings[1].x) - scaleX(encodings[0].x);

    // draw.clear(context);

    for (let i = 0; i < encodings.length; i++) {
      const { x, y0, y1, group } = stackfn(encodings[i - 1], encodings[i]);

      const [x0s, x1s] = [-1, +1].map((e) => scaleX(x) - 0.5 * e);
      const [y0s, y1s] = [y0, y1].map(scaleY);

      const color = graphicParameters.groupColours[group - 1];

      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
    }
  };

  getSelectedCases = () => {
    return [];
  };

  //   getSelectedCases = (coords: Tuple4<number>) => {
  //     const { scales } = this;
  //     const encodings = this.encodings();

  //     const selX = [coords[0], coords[2]] as Tuple2<number>;
  //     const selY = [coords[1], coords[3]] as Tuple2<number>;
  //     const selectedCases: number[] = [];

  //     for (let i = 0; i < encodings.length; i++) {
  //       const { x, y0, y1, cases } = encodings[i];
  //       const objX = scales.x.pushforward(x) as Tuple2<number>;
  //       const objY = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
  //       if (rectOverlap(objX, objY, selX, selY)) selectedCases.push(...cases);
  //     }

  //     return selectedCases;
  //   };
}
