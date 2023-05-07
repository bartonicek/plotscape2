import { Accessor, createEffect, on } from "solid-js";
import html from "solid-js/html";
import { clear, rectangle } from "../drawfuns";
import { call, throttle } from "../funs";
import { Rectangles } from "../representations.ts/Rectangles";
import { Dataframe, PlotStore, Tuple4 } from "../types";
import { Marker } from "../wranglers/Marker";
import { Wrangler } from "../wranglers/Wrangler";
import { GraphicLayer } from "./GraphicLayer";
import { Scene } from "./Scene";
import {
  onKeyDown,
  onMouseDown,
  onMouseMove,
  onMouseup,
  onResize,
} from "./localEventHandlers";
import { makeLayers } from "./makeLayers";
import { makePlotStore } from "./makePlotStore";
import { makeScales } from "./makeScales";

export class Plot {
  data: Dataframe;
  scene: Scene;
  container: HTMLDivElement;
  mapping: Record<string, string>;

  layers: Record<string, GraphicLayer>;
  store: PlotStore;
  scales: ReturnType<typeof makeScales>;

  wrangler: Wrangler;
  marker: Marker;
  representations: Rectangles[];

  keyActions: Record<string, () => void>;

  constructor(scene: Scene, mapping: Record<string, string>) {
    this.data = scene.data;
    this.scene = scene;
    this.mapping = mapping;

    this.container = html`<div class="plotscape-container" />`;
    scene.app.appendChild(this.container);

    this.store = makePlotStore(this);
    this.layers = makeLayers(this);
    this.scales = makeScales(this);

    this.wrangler = new Wrangler();
    this.marker = scene.marker;
    this.representations = [];

    const { container } = this;

    createEffect(() => {
      container.addEventListener("mousedown", onMouseDown(this));
      container.addEventListener("mousemove", throttle(onMouseMove(this), 50));
      container.addEventListener("mouseup", onMouseup(this));
      window.addEventListener("resize", onResize(this));
      window.addEventListener("keydown", throttle(onKeyDown(this), 50));
    });

    createEffect(() => {
      const { context } = this.layers.user;
      const { clickX, clickY, mouseX, mouseY } = this.store;
      const [x0, x1, y0, y1] = [clickX, mouseX, clickY, mouseY].map(call);

      clear(context);
      rectangle(context, x0, x1, y0, y1, { alpha: 0.25 });
    });

    this.keyActions = {};

    scene.addPlot(this);
  }

  resize = () => onResize(this)();

  activate = () => this.store.activate();
  deactivate = () => this.store.deactivate();

  addRepresentation = (representation: Rectangles) => {
    this.representations.push(representation);

    const { clickX, clickY, mouseX, mouseY } = this.store;
    const { setSelectedCases } = this.scene.store;
    const selection: Tuple4<Accessor<number>> = [
      clickX,
      clickY,
      mouseX,
      mouseY,
    ];

    createEffect(representation.draw);
    createEffect(
      on(selection, (selection) => {
        setSelectedCases(representation.getSelectedCases(selection));
      })
    );
  };
}
