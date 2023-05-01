import html from "solid-js/html";
import { Dataframe } from "../types";
import { GraphicLayer } from "./GraphicLayer";
import { Scene } from "./Scene";
import { makeLayers } from "./makeLayers";
import { makeLocalStore } from "./makeLocalStore";
import { createEffect, onMount } from "solid-js";
import {
  onKeyDown,
  onMousedown,
  onMousemove,
  onMouseup,
  onResize,
} from "./localEventHandlers";
import { makeScales } from "./makeScales";
import { Wrangler } from "../wrangler/Wrangler";

export class Plot {
  data: Dataframe;
  scene: Scene;
  container: HTMLDivElement;

  wrangler: Wrangler;

  layers: Record<string, GraphicLayer>;
  store: ReturnType<typeof makeLocalStore>;
  scales: ReturnType<typeof makeScales>;

  keyActions: Record<string, () => void>;

  constructor(scene: Scene) {
    this.data = scene.data;
    this.scene = scene;

    this.container = html`<div class="plotscape-container" />`;
    scene.app.appendChild(this.container);

    this.wrangler = new Wrangler();

    this.store = makeLocalStore(this);
    this.layers = makeLayers(this);
    this.scales = makeScales(this);

    onMount(() => {
      this.container.addEventListener("mousedown", onMousedown(this));
      this.container.addEventListener("mousemove", onMousemove(this));
      this.container.addEventListener("mouseup", onMouseup(this));
      window.addEventListener("resize", onResize(this));
      window.addEventListener("keydown", onKeyDown(this));
    });

    this.keyActions = {};

    scene.addPlot(this);
  }

  resize = () => onResize(this)();

  activate = () => this.store.activate();
  deactivate = () => this.store.deactivate();
}
