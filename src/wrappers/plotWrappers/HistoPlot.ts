import { createEffect } from "solid-js";
import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { clear } from "../../drawfuns";
import { Plot } from "../../plot/Plot";
import { Rectangles } from "../../representations.ts/Rectangles";
import { Scene } from "../../scene/Scene";
import { buildHisto } from "../wranglerWrappers/HistoWrangler";

export class HistoPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    this.wrangler = buildHisto(this);
    const { limits } = this.wrangler;
    for (const scale of Object.values(this.scales)) {
      scale.data.x.setDomain!(limits.xMin, limits.xMax);
      scale.data.y.setDomain!(limits.yMin, limits.yMax);
    }

    createEffect(() => console.log(this.wrangler.get.bins().labels));

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.width((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.width((width) => (width * 9) / 10),
      // BracketRight: () => this.wrangler.set.anchor((anchor) => anchor + 1),
      // BracketLeft: () => this.wrangler.set.anchor((anchor) => anchor - 1),
    });

    const xAxis = new AxisLabelsContinuous(this, "x");
    const yAxis = new AxisLabelsContinuous(this, "y");

    this.addRepresentation(new Rectangles(this));
    this.addAuxilary(xAxis);
    this.addAuxilary(yAxis);
  }
}
