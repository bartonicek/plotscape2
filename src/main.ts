import { createEffect, createSignal } from "solid-js";
import { Factor } from "./Wrangler/Factor";
import { ReactivePartition } from "./Wrangler/ReactivePartition";
import { Wrangler } from "./Wrangler/Wrangler";
import { loadJSON } from "./funs";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMtcars = await loadJSON("mtcars.json");

const sumReducer = {
  reducefn: (x: number, y: number) => x + y,
  initialValue: 0,
};

const wrangler1 = new Wrangler()
  .bindData(dataMtcars, { v1: "mpg", v2: "am" })
  .bind("width", () => 5)
  .bind("f1", ({ v1, width }) => Factor.bin(v1(), width()))
  .bind("f2", ({ v2 }) => Factor.from(v2()))
  .partitionBy("f1", "f2")
  .addReducer("sum", "v1", sumReducer);

createEffect(() => console.log(wrangler1.partition?.labels()));
wrangler1.setters.setWidth(3);
