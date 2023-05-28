import { createEffect } from "solid-js";
import { AxisLabelsContinuous } from "../../axes/AxisLabelsContinuous";
import { clear } from "../../drawfuns";
import { Plot } from "../../plot/Plot";
import { Rectangles } from "../../representations.ts/Rectangles";
import { Scene } from "../../scene/Scene";
import { buildHisto } from "../wranglerWrappers/HistoWrangler";
import { SpineRectangles } from "../../representations.ts/SpineRectangles";
import { just } from "../../funs";

export class SpinePlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    this.wrangler = buildHisto(this)
      .relabelAt(2, (label) => ({
        y0: label.empty,
        y1: label.summary / label.parent.y1,
      }))
      .relabelAt(1, (label) => ({
        x0: label.empty,
        x1: label.summary,
        y0: label.empty,
        y1: label.summary,
      }))
      .trackLimit("xMax", "y1", 0, Math.max, 0);

    const { limits } = this.wrangler;

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

    this.addRepresentation(new SpineRectangles(this));
    this.addAuxilary(xAxis);
    this.addAuxilary(yAxis);
  }
}
