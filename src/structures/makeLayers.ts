import { GraphicLayer } from "./GraphicLayer";
import { Plot } from "./Plot";

const names = ["under", "base", "user", "highlight", "over"];

export const makeLayers = (plot: Plot) => {
  const layers: [string, GraphicLayer][] = [];
  for (const name of names) {
    const inner = ["base", "user", "highlight"].includes(name);
    layers.push([name, new GraphicLayer(plot, { name, inner })]);
  }
  return Object.fromEntries(layers);
};
