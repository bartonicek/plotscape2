import { max, min } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Factor } from "../../wranglers/Factor";
import { Wrangler } from "../../wranglers/Wrangler";
import { countReducer } from "../../wranglers/reducers";

export const buildHisto = (plot: Plot) => {
  return new Wrangler()
    .bindMarker(plot.scene.marker)
    .bindData(plot.mapping, plot.scene.data)
    .bind("width", () => 5)
    .bind("anchor", () => 0)
    .bind("bins", ({ v1, width, anchor }) =>
      Factor.bin(v1(), width(), anchor())
    )
    .partitionBy("bins", "marker")
    .addReducer("summary", countReducer)
    .addStatic("empty", 0)
    .relabelAll(({ binMin, binMax, empty, summary }) => ({
      x0: binMin,
      x1: binMax,
      y0: empty,
      y1: summary,
    }))
    .trackLimit("xMin", "x0", 1, Math.min, Infinity)
    .trackLimit("xMax", "x1", 1, Math.max, -Infinity)
    .trackLimit("yMin", "y0", 1, Math.min, 0)
    .trackLimit("yMax", "y1", 1, Math.max, -Infinity);
};
