import { max, min } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Factor } from "../../wranglers/Factor";
import { Wrangler } from "../../wranglers/Wrangler";
import { countReducer } from "../../wranglers/reducers";

export function buildBar(plot: Plot) {
  return new Wrangler()
    .bindMarker(plot.marker)
    .bindData(plot.mapping, plot.scene.data)
    .bind("factor", ({ v1 }) => Factor.from(v1()))
    .partitionBy("factor", "marker")
    .addReducer("count", "v1", countReducer)
    .addStatic("empty", 0)
    .encode((label) => ({
      x: label[1].label,
      y0: label[1].empty,
      y1: label[1].count,
      id: label[1].id,
      fill: label[2].count,
      group: label[2].group,
      cases: label[2].cases,
    }))
    .trackLimits({
      yMin: [Math.min, (label) => label.y0, Infinity],
      yMax: [Math.max, (label) => label.y1, -Infinity],
    });
}
