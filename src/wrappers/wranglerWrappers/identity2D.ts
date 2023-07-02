import { Marker } from "../../scene/Marker";
import { Factor } from "../../wrangling/Factor";
import { Wrangler } from "../../wrangling/Wrangler";
import { countReducer, pushReducer } from "../../wrangling/reducers";

export function identity(
  mapping: Record<string, string>,
  data: Record<string, any[]>,
  marker: Marker,
  defaults: Record<string, Record<string, number>>
) {
  return new Wrangler()
    .bindMarker(marker)
    .bindData(mapping, data)
    .partitionBy("marker")
    .addReducer("summary1", pushReducer, "v1")
    .addReducer("summary2", pushReducer, "v2");
}
