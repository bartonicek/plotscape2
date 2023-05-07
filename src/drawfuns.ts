export function clear(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas.getBoundingClientRect();
  context.clearRect(0, 0, width, height);
}

type RectangleOptions = { color: string; alpha: number };
export function rectangle(
  context: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  options?: Partial<RectangleOptions>
) {
  const [w, h] = [x1 - x0, y1 - y0];
  const { height } = context.canvas.getBoundingClientRect();
  const opts = Object.assign({}, { color: "black", alpha: 1 }, options);

  context.save();
  context.fillStyle = opts.color;
  context.globalAlpha = opts.alpha;
  context.fillRect(x0, height - y0, w, -h);
  context.restore();
}
