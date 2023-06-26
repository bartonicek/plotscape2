import * as draw from "../drawfuns";
import { RectEncodings } from "../encodingTypes";
import { rectOverlap } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { makeCanvasContext } from "../makeCanvasContext";
import { Plot } from "../plot/Plot";
import { makePlotStore } from "../plot/makePlotStore";
import { ScaleData } from "../scales/ScaleData";
import { makeSceneStore } from "../scene/makeSceneStore";
import { StackFn, Tuple2, Tuple4 } from "../types";
import { Encoder } from "../wrangling/Encoder";
import { Partition } from "../wrangling/Partition";
import { stackPartitions, stackRectVertical } from "../wrangling/stackers";
import { Representation } from "./Representation";

export class Rectangles implements Representation {
  partitions: Partition[];
  encoder: Encoder;
  stackfns: Record<number, { stackfn: StackFn<number>; initialValue: number }>;

  localStore: ReturnType<typeof makePlotStore>;
  globalStore: ReturnType<typeof makeSceneStore>;

  scales: { x: ScaleData; y: ScaleData };
  context: CanvasRenderingContext2D;

  constructor(plot: Plot) {
    this.encoder = plot.encoder;
    this.partitions = plot.wrangler.partitions;
    this.stackfns = {};

    this.localStore = plot.store;
    this.globalStore = plot.scene.store;

    this.scales = plot.scales.inner.data;
    this.context = makeCanvasContext(plot, { inner: true, name: "base" });
  }

  stack = (depth: number, stackfn: StackFn<number>, initialValue: number) => {
    this.stackfns[depth] = { stackfn, initialValue };
    return this;
  };

  draw = () => {
    const { scales, context, stackfns, encoder } = this;
    const [scaleX, scaleY] = [scales.x.pushforward, scales.y.pushforward];
    const partitions = encoder.partitionsAbove(2);

    draw.clear(context);

    if (stackfns[1]) {
      const { stackfn, initialValue } = stackfns[1];
      stackPartitions(partitions, 1, stackfn, initialValue);
    }
    if (stackfns[2]) {
      const { stackfn, initialValue } = stackfns[2];
      stackPartitions(partitions, 2, stackfn, initialValue);
    }

    for (let i = 0; i < partitions[2].length; i++) {
      const { x0, x1 } = partitions[2][i].parent;
      const { y0, y1, group, transient } = partitions[2][i];

      const [x0s, x1s] = [x0, x1].map(scaleX);
      const [y0s, y1s] = [y0, y1].map(scaleY);

      const color = graphicParameters.groupColours[group - 1];
      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
      if (transient) {
        draw.rectangle(context, x0s, x1s, y0s, y1s, {
          alpha: 0.25,
          color: `#E41A1C`,
          stroke: "#000000",
        });
      }
    }
  };

  checkSelection = (coords: Tuple4<number>) => {
    const { stackfns, scales, encoder } = this;
    const partitions = encoder.partitionsAbove(1);

    if (stackfns[1]) {
      const { stackfn, initialValue } = stackfns[1];
      stackPartitions(partitions, 1, stackfn, initialValue);
    }

    const selX = [coords[0], coords[2]] as Tuple2<number>;
    const selY = [coords[1], coords[3]] as Tuple2<number>;
    const selectedCases: number[] = [];

    for (let i = 0; i < partitions[1].length; i++) {
      const { x0, x1, y0, y1, cases } = partitions[1][i];
      const objX = [x0, x1].map(scales.x.pushforward) as Tuple2<number>;
      const objY = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
      if (rectOverlap(objX, objY, selX, selY)) selectedCases.push(...cases);
    }

    return selectedCases;
  };
}
