import * as draw from "../drawfuns";
import { RectEncodings } from "../encodingTypes";
import { rectOverlap } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { makeCanvasContext } from "../makeCanvasContext";
import { Plot } from "../plot/Plot";
import { makePlotStore } from "../plot/makePlotStore";
import { ScaleData } from "../scales/ScaleData";
import { makeSceneStore } from "../scene/makeSceneStore";
import { Tuple2, Tuple4 } from "../types";
import { Partition } from "../wranglers/Partition";
import { stackPartitions, stackRectVertical } from "../wranglers/stackers";

export class Rectangles {
  partitions: Partition[];
  stackfn: any;

  localStore: ReturnType<typeof makePlotStore>;
  globalStore: ReturnType<typeof makeSceneStore>;

  scales: { x: ScaleData; y: ScaleData };
  context: CanvasRenderingContext2D;

  constructor(plot: Plot) {
    this.partitions = plot.wrangler.partitions;
    this.stackfn = stackRectVertical;

    this.localStore = plot.store;
    this.globalStore = plot.scene.store;

    this.scales = plot.scales.inner.data;
    this.context = makeCanvasContext(plot, { inner: true, name: "base" });
  }

  draw = () => {
    const { stackfn } = this;

    const { scales, context } = this;
    const partitions = this.partitions[2].upperLabelSet();
    const [scaleX, scaleY] = [scales.x.pushforward, scales.y.pushforward];

    draw.clear(context);

    stackPartitions(partitions, 2, this.stackfn, 0);

    for (let i = 0; i < partitions[2].length; i++) {
      const { x0, x1, y0, y1, group } = partitions[2][i];

      const [x0s, x1s] = [x0, x1].map(scaleX);
      const [y0s, y1s] = [y0, y1].map(scaleY);

      const color = graphicParameters.groupColours[group - 1];
      draw.rectangle(context, x0s, x1s, y0s, y1s, { alpha: 1, color });
    }
  };

  getSelectedCases = (coords: Tuple4<number>) => {
    const scales = this.scales;
    const partitions = this.partitions[1].upperLabelSet()[1];

    const selX = [coords[0], coords[2]] as Tuple2<number>;
    const selY = [coords[1], coords[3]] as Tuple2<number>;
    const selectedCases: number[] = [];

    for (let i = 0; i < partitions.length; i++) {
      const { x0, x1, y0, y1, cases } = partitions[i];
      const objX = [x0, x1].map(scales.x.pushforward) as Tuple2<number>;
      const objY = [y0, y1].map(scales.y.pushforward) as Tuple2<number>;
      if (rectOverlap(objX, objY, selX, selY)) selectedCases.push(...cases);
    }

    return selectedCases;
  };
}
