import { createRoot } from "solid-js";
import { loadJSON } from "./funs";
import { Scene } from "./scene/Scene";
import "./styles.css";
import { RelabelFn } from "./types";
import { Factor } from "./wranglers/Factor";
import { Wrangler } from "./wranglers/Wrangler";
import { countReducer } from "./wranglers/reducers";
import { stackPartitions, stackRectVertical } from "./wranglers/stackers";
import { HistoPlot } from "./wrappers/plotWrappers/HistoPlot";
import { SpinePlot } from "./wrappers/plotWrappers/SpinePlot";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new SpinePlot(scene1, { v1: "displ" });
  scene1.setRowsCols(2, 1);
});
