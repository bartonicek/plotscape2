import { Accessor } from "solid-js";
import { ScaleContinuous } from "../scales/ScaleContinuous";

export class Rectangles {
  context: CanvasRenderingContext2D;
  encodings: Accessor<Record<string, any>[]>;
  scales: { x: ScaleContinuous; y: ScaleContinuous };

  constructor(
    context: CanvasRenderingContext2D,
    encodings: Accessor<Record<string, any>[]>,
    scales: { x: ScaleContinuous; y: ScaleContinuous }
  ) {
    this.context = context;
    this.encodings = encodings;
    this.scales = scales;
  }

  draw = () => {
    const { context, scales } = this;
    const encodings = this.encodings();

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "steelblue";

    for (let i = 0; i < encodings.length; i++) {
      const { x0, x1, y0, y1 } = encodings[i];
      const [x0s, x1s, y0s, y1s] = [
        scales.x.pushforward(x0),
        scales.x.pushforward(x1),
        scales.y.pushforward(y0),
        scales.y.pushforward(y1),
      ];

      const [w, h] = [x1s - x0s, y1s - y0s];

      context.fillRect(x0s, scales.y.codomain[1] - y0s, w, -h);
      context.strokeRect(x0s, scales.y.codomain[1] - y0s, w, -h);
    }
  };
}
