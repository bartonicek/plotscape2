import { createEffect } from "solid-js";
import { just, max, min } from "../funs";
import { Rectangles } from "../representations.ts/Rectangles";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { Plot } from "../structures/Plot";
import { Scene } from "../structures/Scene";
import { Encoder } from "../wrangler/Encoder";
import { Factor } from "../wrangler/Factor";
import { Wrangler } from "../wrangler/Wrangler";
import { countReducer } from "../wrangler/reducers";

export class HistoPlot {
  plot: Plot;
  wrangler: Wrangler;
  encoder: Encoder;
  scales: { x: ScaleContinuous; y: ScaleContinuous };

  constructor(scene: Scene, mapping: { v1: string }) {
    this.plot = new Plot(scene);
    this.wrangler = this.plot.wrangler;
    this.wrangler
      .bindData(mapping, scene.data)
      .bind("widthX", () => 1)
      .bind("anchorI", () => 0)
      .bind("widthDef", ({ v1 }) => (max(v1()) - min(v1())) / 10)
      .bind("anchorDef", ({ v1 }) => min(v1()))
      .bind("width", ({ widthDef, widthX }) => widthDef() * widthX())
      .bind("anchor", ({ anchorDef, anchorI }) => anchorDef() + anchorI())
      .bind("bins", ({ v1, width, anchor }) =>
        Factor.bin(v1(), width(), anchor())
      )
      .partitionBy("bins")
      .addReducer("count", "_ones_", countReducer)
      .addStatic("empty", 0);

    this.encoder = new Encoder(
      this.wrangler.output,
      (label) => ({
        x0: label[1].binMin,
        x1: label[1].binMax,
        y0: label[1].empty,
        y1: label[1].count,
      }),
      { x0: true, x1: true, y0: true, y1: true }
    );

    const { x0, x1, y0, y1 } = this.encoder.limits;

    this.scales = this.plot.scales.data;
    this.scales.x.setDomain(x0.min, x1.max);
    this.scales.y.setDomain(y0.min, y1.max);

    Object.assign(this.plot.keyActions, {
      Equal: () => this.wrangler.set.widthX((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.widthX((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchorI((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchorI((anchor) => anchor - 1),
    });

    const bars = new Rectangles(
      this.plot.layers.base.context,
      this.encoder.encodings,
      this.scales
    );

    createEffect(() => bars.draw());
  }
}
