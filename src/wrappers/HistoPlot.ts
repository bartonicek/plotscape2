import { max, min } from "../funs";
import { Rectangles } from "../representations.ts/Rectangles";
import { Plot } from "../structures/Plot";
import { Scene } from "../structures/Scene";
import { Factor } from "../wranglers/Factor";
import { Wrangler } from "../wranglers/Wrangler";
import { countReducer, sumReducer } from "../wranglers/reducers";

export class HistoPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene);

    this.wrangler = new Wrangler()
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
      .addReducer("count", "v1", countReducer)
      .addStatic("empty", 0)
      .encode((label) => ({
        x0: label[1].binMin,
        x1: label[1].binMax,
        y0: label[1].empty,
        y1: label[1].count,
        height: label[2].count,
        group: label[2].group,
        cases: label[2].cases,
      }))
      .trackLimits({
        xMin: [Math.min, (label) => label.x0, Infinity],
        xMax: [Math.max, (label) => label.x1, -Infinity],
        yMin: [Math.min, (label) => label.y0, Infinity],
        yMax: [Math.max, (label) => label.y1, -Infinity],
      });

    const { limits } = this.wrangler;
    this.scales.data.x.setDomain(limits.xMin, limits.xMax);
    this.scales.data.y.setDomain(limits.yMin, limits.yMax);

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.widthX((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.widthX((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchorI((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchorI((anchor) => anchor - 1),
    });

    this.addRepresentation(new Rectangles(this));
  }
}
