import { renderStartScreen } from "./game/start-screen";
import { getRequiredElement } from "./game/utils";

/** Finds the game root element and starts the initial screen. */
export const initMemoryApp = (): void => {
  const field = getRequiredElement<HTMLElement>("#field");
  renderStartScreen(field);
};