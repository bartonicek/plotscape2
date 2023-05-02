import { just, max, min } from "../funs";
import { Rectangles } from "../representations.ts/Rectangles";
import { Plot } from "../structures/Plot";
import { Scene } from "../structures/Scene";
import { Factor } from "../wranglers/Factor";
import { countReducer } from "../wranglers/reducers";

export class HistoPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene);

    this.wrangler
      .bindMarker(this.marker)
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
      .partitionBy("bins", "marker")
      .addReducer("count", "_ones_", countReducer)
      .addStatic("empty", 0);

    this.encoder.encode(
      (label) => ({
        x0: label[1].binMin,
        x1: label[1].binMax,
        y0: label[1].empty,
        y1: label[1].count,
        cases: label[1].cases,
      }),
      { x0: true, x1: true, y0: true, y1: true }
    );

    const { x0, x1, y0, y1 } = this.encoder.limits;
    this.scales.data.x.setDomain(x0.min, x1.max);
    this.scales.data.y.setDomain(y0.min, y1.max);

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.widthX((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.widthX((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchorI((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchorI((anchor) => anchor - 1),
    });

    this.addRepresentation(new Rectangles(this));
  }
}
