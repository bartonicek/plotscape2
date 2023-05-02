import html from "solid-js/html";
import { Dataframe } from "../types";
import { GraphicLayer } from "./GraphicLayer";
import { Scene } from "./Scene";
import { makeLayers } from "./makeLayers";
import { makeLocalStore } from "./makeLocalStore";
import { batch, createEffect, onMount } from "solid-js";
import {
  onKeyDown,
  onMousedownInner,
  onMousemoveInner,
  onMouseup,
  onResize,
} from "./localEventHandlers";
import { makeScales } from "./makeScales";
import { Wrangler } from "../wranglers/Wrangler";
import { Marker } from "../wranglers/Marker";
import { Rectangles } from "../representations.ts/Rectangles";
import { Encoder } from "../wranglers/Encoder";
import { throttle } from "../funs";

export class Plot {
  data: Dataframe;
  scene: Scene;
  container: HTMLDivElement;

  layers: Record<string, GraphicLayer>;
  store: ReturnType<typeof makeLocalStore>;
  scales: ReturnType<typeof makeScales>;

  wrangler: Wrangler;
  encoder: Encoder;
  marker: Marker;
  representations: Rectangles[];

  keyActions: Record<string, () => void>;

  constructor(scene: Scene) {
    this.data = scene.data;
    this.scene = scene;

    this.container = html`<div class="plotscape-container" />`;
    scene.app.appendChild(this.container);

    this.store = makeLocalStore(this);
    this.layers = makeLayers(this);
    this.scales = makeScales(this);

    this.wrangler = new Wrangler();
    this.encoder = new Encoder(this.wrangler.output);
    this.marker = scene.marker;
    this.representations = [];

    const { canvas: topLayer } = this.layers.click;

    onMount(() => {
      topLayer.addEventListener("mousedown", onMousedownInner(this));
      topLayer.addEventListener(
        "mousemove",
        throttle(onMousemoveInner(this), 50)
      );
      topLayer.addEventListener("mouseup", onMouseup(this));
      window.addEventListener("resize", onResize(this));
      window.addEventListener("keydown", throttle(onKeyDown(this), 50));
    });

    this.keyActions = {};

    scene.addPlot(this);
  }

  resize = () => onResize(this)();

  activate = () => this.store.activate();
  deactivate = () => this.store.deactivate();

  addRepresentation = (representation: Rectangles) => {
    this.representations.push(representation);
    createEffect(() => {
      representation.draw();
      representation.updateSelection();
    });
  };
}
