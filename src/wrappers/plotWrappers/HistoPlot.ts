import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { Plot } from "../../plot/Plot";
import { Rectangles } from "../../representations.ts/Rectangles";
import { Scene } from "../../scene/Scene";
import { stackRectVertical } from "../../wrangling/stackers";
import { bin1DCounts } from "../wranglerWrappers/bin1DCounts";

export class HistoPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    const { data, marker, defaults } = this;

    this.wrangler = bin1DCounts(mapping, data, marker, defaults);
    this.encoder
      .registerPartitions(this.wrangler.partitions)
      .relabelAll(({ binMin, binMax, empty, summary }) => ({
        x0: binMin,
        x1: binMax,
        y0: empty,
        y1: summary,
      }))
      .trackLimit("xMin", "x0", 1, Math.min, Infinity)
      .trackLimit("xMax", "x1", 1, Math.max, -Infinity)
      .trackLimit("yMin", "y0", 1, Math.min, 0)
      .trackLimit("yMax", "y1", 1, Math.max, -Infinity);

    const { limits } = this.encoder;

    for (const scale of Object.values(this.scales)) {
      scale.data.x.setDomain!(limits.xMin, limits.xMax);
      scale.data.y.setDomain!(limits.yMin, limits.yMax);
    }

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.width((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.width((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchor((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchor((anchor) => anchor - 1),
    });

    const xAxis = new AxisLabelsContinuous(this, "x");
    const yAxis = new AxisLabelsContinuous(this, "y");

    const rects = new Rectangles(this).stack(2, stackRectVertical, 0);

    this.addRepresentation(rects);
    this.addAuxilary(xAxis);
    this.addAuxilary(yAxis);
  }
}
