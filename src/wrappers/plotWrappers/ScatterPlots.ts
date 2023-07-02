import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { Plot } from "../../plot/Plot";
import { Scene } from "../../scene/Scene";
import { identity } from "../wranglerWrappers/identity2D";

export class ScatterPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string; v2: string }) {
    super(scene, mapping);

    const { data, marker, defaults } = this;

    this.wrangler = identity(mapping, data, marker, defaults);
    this.encoder
      .registerPartitions(this.wrangler.partitions)
      .relabelAll(({ summary1, summary2 }) => ({
        x: summary1,
        y: summary2,
      }))
      .trackLimit("xMin", "x", 1, Math.min, Infinity)
      .trackLimit("xMax", "x", 1, Math.max, -Infinity)
      .trackLimit("yMin", "y", 1, Math.min, 0)
      .trackLimit("yMax", "y", 1, Math.max, -Infinity);

    const { limits } = this.encoder;

    for (const scale of Object.values(this.scales)) {
      scale.data.x.setDomain!(limits.xMin, limits.xMax);
      scale.data.y.setDomain!(limits.yMin, limits.yMax);
    }

    const xAxis = new AxisLabelsContinuous(this, "x");
    const yAxis = new AxisLabelsContinuous(this, "y");

    // const rects = new Rectangles(this).stack(2, stackRectVertical, 0);

    // this.addRepresentation(rects);
    // this.addAuxilary(xAxis);
    // this.addAuxilary(yAxis);
  }
}
