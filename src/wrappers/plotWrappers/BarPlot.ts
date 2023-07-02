import { createEffect } from "solid-js";
import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { clear } from "../../drawfuns";
import { Plot } from "../../plot/Plot";
import { Bars } from "../../representations.ts/Bars";
import { Scene } from "../../scene/Scene";
import { cat1DCounts } from "../wranglerWrappers/cat1DCounts";

export class BarPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    const { marker, defaults } = this;
    const { data } = this.scene;

    this.wrangler = cat1DCounts(mapping, data, marker, defaults);

    this.encoder
      .registerPartitions(this.wrangler.partitions)
      .relabelAll((label) => ({
        x: label.label,
        y0: label.empty,
        y1: label.summary,
      }));

    // for (const layer of Object.values(this.layers)) {
    //   layer.scales.data.x.setValues!(() => ["A", "B", "C"]);
    //   layer.scales.data.y.setDomain!(limits.yMin, limits.yMax);
    // }

    // const xAxis = new AxisLabelsContinuous(this, "x");
    // const yAxis = new AxisLabelsContinuous(this, "y");

    // createEffect(() => {
    //   clear(this.layers.over.context);
    //   xAxis.draw();
    //   yAxis.draw();
    // });

    // this.addRepresentation(new Bars(this));
  }
}
