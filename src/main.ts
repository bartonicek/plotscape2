import {
  Accessor,
  Setter,
  createEffect,
  createRoot,
  createSignal,
  on,
  untrack,
} from "solid-js";
import { loadJSON, rectOverlap } from "./funs";
import { Plot } from "./structures/Plot";
import { Scene } from "./structures/Scene";
import "./styles.css";
import { Factor } from "./wranglers/Factor";
import { Marker } from "./wranglers/Marker";
import { Wrangler } from "./wranglers/Wrangler";
import { sumReducer } from "./wranglers/reducers";
import { HistoPlot } from "./wrappers/HistoPlot";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new HistoPlot(scene1, { v1: "displ" });
  // const plot3 = new Plot(scene1);
  // const plot4 = new Plot(scene1);1
});
