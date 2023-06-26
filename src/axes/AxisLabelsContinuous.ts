import { clear, text } from "../drawfuns";
import { prettyBreaks } from "../funs";
import { graphicParameters } from "../graphicParameters";
import { makeCanvasContext } from "../makeCanvasContext";
import { Plot } from "../plot/Plot";
import { ScaleContinuous } from "../scales/ScaleContinuous";
import { ScaleData } from "../scales/ScaleData";
import { PlotScales, PlotStore } from "../types";

export class AxisLabelsContinuous {
  along: "x" | "y";
  context: CanvasRenderingContext2D;
  scales: { x: ScaleData; y: ScaleData };
  store: PlotStore;

  constructor(plot: Plot, along: "x" | "y") {
    this.along = along;
    this.context = makeCanvasContext(plot, { inner: false, name: "over" });
    this.scales = plot.scales.outer.data;
    this.store = plot.store;
  }

  draw = () => {
    const { context, scales, along, store } = this;

    const scale = scales[along];
    const [lower, upper] = [scale.domain[0](), scale.domain[1]()];
    const breaks = prettyBreaks(lower, upper);

    const { height, innerBottom, innerLeft } = store;

    const yBase = height() - innerBottom() + graphicParameters.axisOffset;
    const xBase = innerLeft() - graphicParameters.axisOffset;

    clear(context);

    if (along === "x") {
      context.textBaseline = "top";
      context.textAlign = "center";

      for (let i = 0; i < breaks.length; i++) {
        const label = breaks[i].toString();
        const x = scale.pushforward(breaks[i]);

        text(context, label, x, yBase, {
          fontsize: graphicParameters.fontsize,
        });
      }
    } else if (along === "y") {
      context.textBaseline = "middle";
      context.textAlign = "right";

      for (let i = 0; i < breaks.length; i++) {
        const label = breaks[i].toString();
        const y = scale.pushforward(breaks[i]);

        text(context, label, xBase, height() - y, {
          fontsize: graphicParameters.fontsize,
        });
      }
    }
  };
}
