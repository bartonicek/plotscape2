import { text } from "../drawfuns";
import { prettyBreaks } from "../funs";
import { Plot } from "../plot/Plot";
import { PlotScales, PlotStore } from "../types";

export class AxisLabelsContinuous {
  along: "x" | "y";
  context: CanvasRenderingContext2D;
  scales: PlotScales;
  store: PlotStore;

  constructor(plot: Plot, along: "x" | "y") {
    this.along = along;
    this.context = plot.layers.over.context;
    this.scales = plot.scales;
    this.store = plot.store;
  }

  draw = () => {
    const { context, scales, along } = this;

    const scale = scales.dataOuter[along];
    const [lower, upper] = [scale.domainMinExp(), scale.domainMaxExp()];

    const { height, innerBottom, innerLeft } = this.store;
    const breaks = prettyBreaks(lower, upper);

    const yBase = height() - innerBottom() + 3;
    const xBase = innerLeft() - 3;

    if (along === "x") {
      context.textBaseline = "top";
      context.textAlign = "center";

      for (let i = 0; i < breaks.length; i++) {
        const label = breaks[i].toString();
        const x = scale.pushforward(breaks[i]);

        text(context, label, x, yBase);
      }
    } else {
      context.textBaseline = "middle";
      context.textAlign = "right";

      for (let i = 0; i < breaks.length; i++) {
        const label = breaks[i].toString();
        const y = scale.pushforward(breaks[i]);

        text(context, label, xBase, height() - y);
      }
    }
  };
}
