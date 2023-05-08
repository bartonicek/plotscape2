import { createSignal } from "solid-js";

export const makeSceneStore = () => {
  const [group, setGroup] = createSignal(1);
  const [selectedCases, setSelectedCases] = createSignal<number[]>([]);

  return { group, selectedCases, setGroup, setSelectedCases };
};
