import { initStartScreen } from "./game/start-screen";
import { getRequiredElement } from "./game/utils";

export const initMemoryApp = (): void => {
  const field = getRequiredElement<HTMLElement>("#field");
  initStartScreen(field);
};