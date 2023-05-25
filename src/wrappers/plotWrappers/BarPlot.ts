import { createEffect } from "solid-js";
import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { clear } from "../../drawfuns";
import { Plot } from "../../plot/Plot";
import { Bars } from "../../representations.ts/Bars";
import { Scene } from "../../scene/Scene";
import { buildBar } from "../wranglerWrappers/BarWrangler";

export class BarPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    this.wrangler = buildBar(this);
    const { limits } = this.wrangler;

    console.log(this.wrangler.encodings());

    for (const layer of Object.values(this.layers)) {
      layer.scales.data.x.setValues!(() => ["A", "B", "C"]);
      layer.scales.data.y.setDomain!(limits.yMin, limits.yMax);
    }

    const xAxis = new AxisLabelsContinuous(this, "x");
    const yAxis = new AxisLabelsContinuous(this, "y");

    // createEffect(() => {
    //   clear(this.layers.over.context);
    //   xAxis.draw();
    //   yAxis.draw();
    // });

    // this.addRepresentation(new Bars(this));
  }
}
