import { max, min } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Factor } from "../../wrangling/Factor";
import { Wrangler } from "../../wrangling/Wrangler";
import { countReducer } from "../../wrangling/reducers";

export function cat1DCounts(plot: Plot) {
  return new Wrangler()
    .bindMarker(plot.marker)
    .bindData(plot.mapping, plot.scene.data)
    .bind("factor", ({ v1 }) => Factor.from(v1()))
    .partitionBy("factor", "marker")
    .addReducer("summary", countReducer, "v1")
    .addStatic("empty", 0);
}
