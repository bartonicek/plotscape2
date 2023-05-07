export type RepresentationEncodings = {
  fill: number;
  group: number;
  cases: number[];
};

export type RectEncodings = RepresentationEncodings & {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};
