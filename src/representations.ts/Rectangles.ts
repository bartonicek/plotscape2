import { Accessor } from "solid-js";
import * as draw from "../drawfuns";
import { rectOverlap } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { makeCanvasContext } from "../makeCanvasContext";
import { Plot } from "../plot/Plot";
import { makePlotStore } from "../plot/makePlotStore";
import { ScaleData } from "../scales/ScaleData";
import { makeSceneStore } from "../scene/makeSceneStore";
import { Tuple2, Tuple4 } from "../types";
import { StackFn, stackRectVertical } from "../wranglers/stackers";
import { RectEncodings } from "../encodingTypes";

export class Rectangles {
  encodings: Accessor<RectEncodings[]>;
  stackfn: StackFn<RectEncodings>;

  localStore: ReturnType<typeof makePlotStore>;
  globalStore: ReturnType<typeof makeSceneStore>;

  scales: { x: ScaleData; y: ScaleData };
  context: CanvasRenderingContext2D;

  constructor(plot: Plot) {
    this.encodings = plot.wrangler.encodings as Accessor<RectEncodings[]>;
    this.stackfn = stackRectVertical;

    this.localStore = plot.store;
    this.globalStore = plot.scene.store;

    this.scales = plot.scales.inner.data;
    this.context = makeCanvasContext(plot, { inner: true, name: "base" });
  }

  draw = () => {
    const { stackfn } = this;

    const { scales, context } = this;
    const encodings = this.encodings();
    const [scaleX, scaleY] = [scales.x.pushforward, scales.y.pushforward];

    draw.clear(context);

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, fill, group } = stackfn(
        encodings[i - 1],
        encodings[i]
      );

      const [x0s, x1s] = [x0, x1].map(scaleX);
      const [y0s, y1s] = [y0, fill].map(scaleY);

      const color = graphicParameters.groupColours[group - 1];
      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
    }
  };

  getSelectedCases = (coords: Tuple4<number>) => {
    const scales = this.scales;
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
