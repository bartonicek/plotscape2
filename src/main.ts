import {
  Accessor,
  Setter,
  createEffect,
  createRoot,
  createSignal,
  untrack,
} from "solid-js";
import { loadJSON, rectOverlap } from "./funs";
import { Plot } from "./structures/Plot";
import { Scene } from "./structures/Scene";
import "./styles.css";
import { HistoPlot } from "./wrappers/HistoPlot";
import { Factor } from "./wranglers/Factor";
import { Marker } from "./wranglers/Marker";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new HistoPlot(scene1, { v1: "displ" });
  // const plot3 = new Plot(scene1);
  // const plot4 = new Plot(scene1);
});

// const [cases, setCases] = createSignal([1, 2, 3]);
// const [group, setGroup] = createSignal(1);

// const marker1 = new Marker(10, cases, group);

// createEffect(() => console.log(marker1.factor().indices));

// setGroup(2);
// setCases([1, 2, 3, 4, 5, 6]);
