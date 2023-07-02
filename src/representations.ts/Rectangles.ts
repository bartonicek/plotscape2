import { createMemo, untrack } from "solid-js";
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
    const parts1 = encoder.partsAt(1);
    const parts2 = encoder.partsAt(2);

    draw.clear(context);

    if (stackfns[0] && !encoder.stacked[0]) {
      const { stackfn, initialValue } = stackfns[0];
      stackPartitions(parts2, stackfn, initialValue);
      encoder.stacked[0] = true;
    }

    if (stackfns[1] && !encoder.stacked[1]) {
      const { stackfn, initialValue } = stackfns[1];
      stackPartitions(parts1, stackfn, initialValue);
      encoder.stacked[1] = true;
    }

    for (const part of parts2) {
      const { x0, x1 } = part.parent;
      const { y0, y1, group, transient } = part;

      const [x0s, x1s] = [x0, x1].map(scaleX);
      const [y0s, y1s] = [y0, y1].map(scaleY);

      const transientOpts = {
        alpha: 0.75,
        color: graphicParameters.groupColours[1],
      };

      const color = graphicParameters.groupColours[group - 1];
      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
      if (transient) draw.rectangle(context, x0s, x1s, y0s, y1s, transientOpts);
    }
  };

  checkSelection = (coords: Tuple4<number>) => {
    const { stackfns, scales, encoder } = this;
    const parts = encoder.partsAt(1);

    if (stackfns[1]) {
      const { stackfn, initialValue } = stackfns[1];
      stackPartitions(parts, stackfn, initialValue);
    }

    const selX = [coords[0], coords[2]] as Tuple2<number>;
    const selY = [coords[1], coords[3]] as Tuple2<number>;
    const selectedCases: number[] = [];

    for (const part of parts) {
      const { x0, x1, y0, y1, cases } = part;
      const objX = [x0, x1].map(scales.x.pushforward) as Tuple2<number>;
      const objY = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
      if (rectOverlap(objX, objY, selX, selY)) selectedCases.push(...cases);
    }

    return selectedCases;
  };
}
