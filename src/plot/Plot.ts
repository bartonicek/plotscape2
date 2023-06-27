import { Accessor, createEffect, on } from "solid-js";
import html from "solid-js/html";
import { AxisLabelsContinuous } from "../axes/AxisLabelsContinuous";
import { clear, rectangle } from "../drawfuns";
import { call, throttle } from "../funs";
import { makeCanvasContext } from "../makeCanvasContext";
import { Rectangles } from "../representations.ts/Rectangles";
import { Marker } from "../scene/Marker";
import { Scene } from "../scene/Scene";
import { Dataframe, PlotScales, PlotStore, Tuple4 } from "../types";
import { Wrangler } from "../wrangling/Wrangler";
import { makePlotStore } from "./makePlotStore";
import { makeScales } from "./makeScales";
import {
  onKeyDown,
  onMouseDown,
  onMouseMove,
  onMouseup,
  onResize,
} from "./plotEventHandlers";
import { Representation } from "../representations.ts/Representation";
import { makeDefaultSummaries } from "./makeDefaultSummaries";
import { Encoder } from "../wrangling/Encoder";

export class Plot {
  data: Dataframe;
  scene: Scene;
  store: PlotStore;

  container: HTMLDivElement;
  mapping: Record<string, string>;
  defaults: Record<keyof typeof this.mapping, Record<string, number>>;
  scales: PlotScales;

  wrangler: Wrangler;
  encoder: Encoder;
  marker: Marker;
  representations: Representation[];
  auxilaries: AxisLabelsContinuous[];

  user: CanvasRenderingContext2D;

  keyActions: Record<string, () => void>;

  constructor(scene: Scene, mapping: Record<string, string>) {
    this.data = scene.data;
    this.scene = scene;
    this.mapping = mapping;

    this.container = html`<div class="plotscape-container" />`;
    scene.app.appendChild(this.container);

    this.store = makePlotStore(this.container);
    this.scales = makeScales(this.store);
    this.defaults = makeDefaultSummaries(mapping, scene.data);

    this.wrangler = new Wrangler();
    this.encoder = new Encoder();
    this.marker = scene.marker;
    this.representations = [];
    this.auxilaries = [];

    const { container } = this;

    createEffect(() => {
      container.addEventListener("mousedown", onMouseDown(this));
      container.addEventListener("mousemove", throttle(onMouseMove(this), 50));
      container.addEventListener("mouseup", onMouseup(this));
      window.addEventListener("resize", throttle(onResize(this), 50));
      window.addEventListener("keydown", throttle(onKeyDown(this), 50));
    });

    this.user = makeCanvasContext(this, { inner: true, name: "user" });

    createEffect(() => {
      const { clickX, clickY, mouseX, mouseY } = this.store;
      const [x0, x1, y0, y1] = [clickX, mouseX, clickY, mouseY].map(call);
      clear(this.user);
      rectangle(this.user, x0, x1, y0, y1, { alpha: 0.25 });
    });

    this.keyActions = {};
    scene.addPlot(this);
  }

  resize = () => onResize(this)();

  activate = () => this.store.activate();
  deactivate = () => this.store.deactivate();

  addAuxilary = (auxilary: AxisLabelsContinuous) => {
    this.auxilaries.push(auxilary);
    createEffect(auxilary.draw);
  };

  addRepresentation = (representation: Representation) => {
    this.representations.push(representation);
    createEffect(representation.draw);

    const { clickX, clickY, mouseX, mouseY } = this.store;
    const { setSelectedCases } = this.scene.store;
    const selection = [clickX, clickY, mouseX, mouseY] as Tuple4<
      Accessor<number>
    >;

    createEffect(
      on(selection, (selection) => {
        setSelectedCases(representation.checkSelection(selection));
      })
    );
  };
}
