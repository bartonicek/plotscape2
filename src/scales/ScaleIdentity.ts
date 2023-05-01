import { Scale } from "./Scale";

export class ScaleIdentity implements Scale<number> {
  pushforward = (value: number) => value;
  pullback = (value: number) => value;
}
