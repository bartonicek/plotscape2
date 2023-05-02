import { createEffect, onMount } from "solid-js";
import { Dataframe } from "../types";
import { Plot } from "./Plot";
import { makeGlobalStore } from "./makeGlobalStore";
import {
  onDoubleClick,
  onKeyDown,
  onKeyUp,
  onMousedown,
} from "./globalEventHandlers";
import { Marker } from "../wranglers/Marker";

export class Scene {
  app: HTMLDivElement;
  data: Dataframe;
  plots: Plot[];

  store: ReturnType<typeof makeGlobalStore>;
  marker: Marker;

  keyActions: Record<string, () => void>;

  constructor(app: HTMLDivElement, data: Dataframe) {
    this.app = app;
    this.data = data;
    this.plots = [];

    this.store = makeGlobalStore();

    this.app.classList.add("plotscape-scene");

    const n = this.data[Object.keys(this.data)[0]].length;
    const { selectedCases, group } = this.store;
    this.marker = new Marker(n, selectedCases, group);

    this.keyActions = {
      Digit1: () => this.store.setGroup(2),
      Digit2: () => this.store.setGroup(3),
      Digit3: () => this.store.setGroup(4),
    };

    onMount(() => {
      this.app.addEventListener("mousedown", onMousedown(this));
      window.addEventListener("keydown", onKeyDown(this));
      window.addEventListener("keyup", onKeyUp(this));
      window.addEventListener("dblclick", onDoubleClick(this));
    });
  }

  addPlot = (plot: Plot) => {
    this.plots.push(plot);

    const n = this.plots.length;
    const ncols = Math.ceil(Math.sqrt(n));
    const nrows = Math.ceil(n / ncols);

    document.documentElement.style.setProperty("--ncols", ncols.toString());
    document.documentElement.style.setProperty("--nrows", nrows.toString());

    this.plots.forEach((plot) => plot.resize());
  };
}
