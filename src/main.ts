import { Accessor, createRoot } from "solid-js";
import { loadJSON } from "./funs";
import { Plot } from "./structures/Plot";
import { Scene } from "./structures/Scene";
import "./styles.css";
import { HistoPlot } from "./wrappers/HistoPlot";
import { Factor } from "./wrangler/Factor";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMtcars = await loadJSON("mtcars.json");
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new HistoPlot(scene1, { v1: "displ" });
  const plot3 = new Plot(scene1);
  const plot4 = new Plot(scene1);
});
