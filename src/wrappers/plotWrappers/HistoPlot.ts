import { max, min } from "../../funs";
import { Rectangles } from "../../representations.ts/Rectangles";
import { Plot } from "../../structures/Plot";
import { Scene } from "../../structures/Scene";
import { Factor } from "../../wranglers/Factor";
import { Wrangler } from "../../wranglers/Wrangler";
import { countReducer, sumReducer } from "../../wranglers/reducers";
import { makeHisto } from "../wranglerWrappers/HistoWrangler";

export class HistoPlot extends Plot {
  constructor(scene: Scene, mapping: { v1: string }) {
    super(scene, mapping);

    this.wrangler = makeHisto(this);
    const { limits } = this.wrangler;
    this.scales.data.x.setDomain(limits.xMin, limits.xMax);
    this.scales.data.y.setDomain(limits.yMin, limits.yMax);

    Object.assign(this.keyActions, {
      Equal: () => this.wrangler.set.widthX((width) => (width * 11) / 10),
      Minus: () => this.wrangler.set.widthX((width) => (width * 9) / 10),
      BracketRight: () => this.wrangler.set.anchorI((anchor) => anchor + 1),
      BracketLeft: () => this.wrangler.set.anchorI((anchor) => anchor - 1),
    });

    this.addRepresentation(new Rectangles(this));
  }
}
