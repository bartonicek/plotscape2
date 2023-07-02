import { Marker } from "../../scene/Marker";
import { Factor } from "../../wrangling/Factor";
import { Wrangler } from "../../wrangling/Wrangler";
import { countReducer } from "../../wrangling/reducers";

export function cat1DCounts(
  mapping: Record<string, string>,
  data: Record<string, any[]>,
  marker: Marker,
  defaults: Record<string, Record<string, number>>
) {
  return new Wrangler()
    .bindMarker(marker)
    .bindData(mapping, data)
    .bind("factor", ({ v1 }) => Factor.from(v1()))
    .partitionBy("factor", "marker")
    .addReducer("summary", countReducer, "v1")
    .addStatic("empty", 0);
}
