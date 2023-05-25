import { Scale } from "./Scale";

export class ScaleIdentity implements Scale {
  identity: boolean;
  constructor() {
    this.identity = true;
  }
  pushforward = (value: number) => value;
  pullback = (value: number) => value;
}
