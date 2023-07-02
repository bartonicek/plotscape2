import { children, createMemo, createRoot } from "solid-js";
import { loadJSON } from "./funs";
import { Scene } from "./scene/Scene";
import "./styles.css";
import { HistoPlot } from "./wrappers/plotWrappers/HistoPlot";
import { SpinePlot } from "./wrappers/plotWrappers/SpinePlot";
import { identity } from "./wrappers/wranglerWrappers/identity2D";

const app = document.querySelector<HTMLDivElement>("#app")!;
const dataMpg = await loadJSON("mpg.json");

createRoot(() => {
  const scene1 = new Scene(app, dataMpg);
  const plot1 = new HistoPlot(scene1, { v1: "hwy" });
  const plot2 = new SpinePlot(scene1, { v1: "displ" });
  //const plot3 = new ScatterPlot(scene1, { v1: "displ", v2: "hwy" });
  scene1.setRowsCols(2, 1);
});

// const obj = { x: [1, 2, 3], y: [4, 5, 6], z: ["a", "b", "c"] };
// const arr = [
//   { x: 1, y: 4, z: "a" },
//   { x: 2, y: 5, z: "b" },
//   { x: 3, y: 6, z: "c" },
// ];

// const DONE = { done: true, value: undefined };

// const addLongIterator = (data: Record<string, any[]>) => {
//   Object.defineProperty(data, Symbol.iterator, {
//     value: function () {
//       const keys = Object.keys(data);
//       let i = 0;
//       return {
//         next() {
//           if (!(i < data[keys[0]].length)) return DONE;
//           const value = {} as Record<string, any>;
//           for (const key of keys) value[key] = data[key][i];
//           i++;
//           return { done: false, value };
//         },
//       };
//     },
//   });
//   return data as typeof data & { [Symbol.iterator](): Iterator<any, any, any> };
// };

// const objIt = addLongIterator(obj);

// for (const x of objIt) console.log(x);
// for (const x of arr) console.log(x);

class Something {
  parent?: Something;
  value: any;
  constructor(value: any) {
    this.value = value;
  }

  createChild = (value: any) => {
    const child = new Something(value);
    child.parent = this;
    return child;
  };

  doSomething = () => {
    console.log(this.value);
    const parentValue = createMemo(
      this.parent?.doSomething ??
        function () {
          return undefined;
        }
    );
    return { me: this.value, parent: parentValue };
  };
}

const x = new Something(10);
const y = x.createChild(20);
