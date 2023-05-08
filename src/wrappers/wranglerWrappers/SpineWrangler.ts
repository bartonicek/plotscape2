import { Plot } from "../../plot/Plot";
import { buildHisto } from "./HistoWrangler";

export function buildSpine(plot: Plot) {
  return buildHisto(plot)
    .encode((label) => ({
      x0: label[1].empty,
      x1: label[1].count,
      x1Max: label[0].count,
      y0: 0,
      y1: 1,
      fill: label[2].count / label[1].count,
      group: label[2].group,
      cases: label[2].cases,
    }))
    .trackLimits({
      xMin: [Math.min, (label) => label.x0, Infinity],
      xMax: [Math.max, (label) => label.x1Max, -Infinity],
    });
}
