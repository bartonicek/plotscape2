import { Accessor, createRoot } from "solid-js";
import { identity, last, loadJSON, argSecond, pick } from "./funs";
import { ScaleData } from "./scales/ScaleData";
import { Scene } from "./scene/Scene";
import "./styles.css";
import { HistoPlot } from "./wrappers/plotWrappers/HistoPlot";
import { BarPlot } from "./wrappers/plotWrappers/BarPlot";
import { Wrangler } from "./wranglers/Wrangler";
import { Partition } from "./wranglers/ReactivePartition";
import { EncodeFn, ReduceFn, StackFn } from "./types";
import { createMutable } from "solid-js/store";
import { stackRectVertical } from "./wranglers/stackers";
import { symbolName } from "typescript";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

const scene1 = new Scene(app, dataMpg);
const plot1 = new HistoPlot(scene1, { v1: "hwy" });
const plot2 = new HistoPlot(scene1, { v1: "displ" });

scene1.setRowsCols(2, 1);

plot1.scene.store.setSelectedCases([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

const labelSet = plot1.wrangler.partitions[2]
  .upperLabelSet()
  .map(Object.values);

const stack = <T>(
  partitions: Record<string, any>[][],
  depth: number,
  stackfn: (node: Record<string, any>, stackedValue: T) => void,
  initialValue: any
) => {
  const temp = Symbol();
  const parents = new Set<Record<string | symbol, any>>();

  for (const part of partitions[depth]) {
    const parent = part.parent;
    parents.add(parent);
    if (!(temp in parent)) parent[temp] = initialValue;
    parent[temp] = stackfn(part, parent[temp]);
  }

  for (const parent of parents) delete parent[temp];
};

const stackStartEnd = (node: Record<string, any>, stacked: number) => {
  node.empty = stacked;
  node.summary = stacked + node.summary;
  return node.summary;
};

stack(labelSet, 2, stackStartEnd, 0);
stack(labelSet, 1, stackStartEnd, 0);
