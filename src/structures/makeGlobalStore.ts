import { createSignal } from "solid-js";

export const makeGlobalStore = () => {
  const [group, setGroup] = createSignal(1);

  return { group, setGroup };
};
