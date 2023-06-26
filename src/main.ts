import "./styles.css";
import { createEffect, createRoot } from "solid-js";
import { loadJSON } from "./funs";
import { Scene } from "./scene/Scene";
import { HistoPlot } from "./wrappers/plotWrappers/HistoPlot";
import { SpinePlot } from "./wrappers/plotWrappers/SpinePlot";
import { BarPlot } from "./wrappers/plotWrappers/BarPlot";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new SpinePlot(scene1, { v1: "displ" });
  const plot3 = new BarPlot(scene1, { v1: "cyl" });
  scene1.setRowsCols(2, 1);
});
