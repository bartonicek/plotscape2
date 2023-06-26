import { max, min } from "../../funs";
import { Plot } from "../../plot/Plot";
import { Marker } from "../../scene/Marker";
import { Factor } from "../../wrangling/Factor";
import { Wrangler } from "../../wrangling/Wrangler";
import { countReducer } from "../../wrangling/reducers";

export const buildHisto = (
  mapping: Record<string, string>,
  data: Record<string, any[]>,
  marker: Marker,
  defaults: Record<string, Record<string, number>>
) => {
  return new Wrangler()
    .bindMarker(marker)
    .bindData(mapping, data)
    .bind("width", () => defaults["v1"].range / 20)
    .bind("anchor", () => defaults["v1"].min)
    .bind("bins", ({ v1, width, anchor }) =>
      Factor.bin(v1(), width(), anchor())
    )
    .partitionBy("bins", "marker")
    .addReducer("summary", countReducer)
    .addStatic("empty", 0);
};
