import {
  Accessor,
  Setter,
  createEffect,
  createRoot,
  createSignal,
  on,
  untrack,
} from "solid-js";
import { loadJSON, prettyBreaks, rectOverlap } from "./funs";
import { Plot } from "./plot/Plot";
import { Scene } from "./scene/Scene";
import "./styles.css";
import { Factor } from "./wranglers/Factor";
import { Marker } from "./scene/Marker";
import { Wrangler } from "./wranglers/Wrangler";
import { sumReducer } from "./wranglers/reducers";
import { HistoPlot } from "./wrappers/plotWrappers/HistoPlot";
import { SpinePlot } from "./wrappers/plotWrappers/SpinePlot";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new HistoPlot(scene1, { v1: "displ" });
  // const plot3 = new Plot(scene1);
  // const plot4 = new Plot(scene1);1

  scene1.setRowsCols(2, 1);
});

const label1 = JSON.parse(
  `{"x0":1.06,"x1":1.6,"y0":0,"y1":5,"fill":5,"group":1,"cases":[99,100,101,102,103]}`
);
const label2 = JSON.parse(
  `{"x0":1.06,"x1":2.14,"y0":0,"y1":38,"fill":38,"group":1,"cases":[0,1,2,3,7,8,9,10,104,105,106,107,115,116,117,118,193,194,195,196,197,207,208,209,210,212,213,214,215,216,221,222,223,224,227,228,229,230]}`
);

function encode(
  previousLabel: Record<string, any>[],
  nextLabel: Record<string, any>[]
) {
  if (previousLabel[1].x0 !== previousLabel[1].x0) return nextLabel;
}
