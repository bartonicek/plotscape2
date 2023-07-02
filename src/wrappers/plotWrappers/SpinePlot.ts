import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { just } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Rectangles } from "../../representations.ts/Rectangles";
import { Scene } from "../../scene/Scene";
import {
  stackRectHorizontal,
  stackRectVertical,
} from "../../wrangling/stackers";
import { bin1DCounts } from "../wranglerWrappers/bin1DCounts";

export class SpinePlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    const { data, marker, defaults } = this;

    this.wrangler = bin1DCounts(mapping, data, marker, defaults);
    this.encoder
      .registerPartitions(this.wrangler.partitions)
      .relabelAt(2, (label) => ({
        x0: label.parent.x0,
        x1: label.parent.x1,
        y0: label.empty,
        y1: label.summary / label.parent.y1,
      }))
      .relabelAt(1, (label) => ({
        x0: label.empty,
        x1: label.summary,
        y0: label.empty,
        y1: label.summary,
      }))
      .relabelAt(0, (label) => ({ x1: label.summary }))
      .trackLimit("xMin", "x0", 1, Math.min, Infinity)
      .trackLimit("xMax", "x1", 0, Math.max, 0)
      .trackLimit("yMin", "y0", 1, Math.min, 0)
      .trackLimit("yMax", "y1", 1, Math.max, -Infinity);

    const { limits } = this.encoder;

    for (const scale of Object.values(this.scales)) {
      scale.data.x.setDomain!(limits.xMin, limits.xMax);
      scale.data.y.setDomain!(just(0), just(1));
    }

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.width((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.width((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchor((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchor((anchor) => anchor - 1),
    });

    const xAxis = new AxisLabelsContinuous(this, "x");
    const yAxis = new AxisLabelsContinuous(this, "y");

    const rects = new Rectangles(this)
      .stack(0, stackRectVertical, 0)
      .stack(1, stackRectHorizontal, 0);

    this.addRepresentation(rects);
    this.addAuxilary(xAxis);
    this.addAuxilary(yAxis);
  }
}
