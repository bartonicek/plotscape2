import { max, min } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Factor } from "../../wranglers/Factor";
import { Wrangler } from "../../wranglers/Wrangler";
import { countReducer } from "../../wranglers/reducers";

export function buildHisto(plot: Plot) {
  return new Wrangler()
    .bindMarker(plot.marker)
    .bindData(plot.mapping, plot.scene.data)
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
    .addReducer("summary", "v1", countReducer)
    .addStatic("empty", 0)
    .encode((label) => ({
      x0: label[1].binMin,
      x1: label[1].binMax,
      y0: label[1].empty,
      y1: label[1].summary,
      id: label[1].id,
      fill: label[2].summary,
      group: label[2].group,
      cases: label[2].cases,
    }))
    .trackLimits({
      xMin: [Math.min, (label) => label.x0, Infinity],
      xMax: [Math.max, (label) => label.x1, -Infinity],
      yMin: [Math.min, (label) => label.y0, Infinity],
      yMax: [Math.max, (label) => label.y1, -Infinity],
    });
}
