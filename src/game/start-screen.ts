import { preloadImages } from "./assets";
import { renderSettingsScreen } from "./settings-screen";
import { startAssets } from "./themes";
import { setCssImage } from "./utils";

export const initStartScreen = (field: HTMLElement): void => {
  const playButton = field.querySelector<HTMLButtonElement>("[data-play-button]");
  const controller = field.querySelector<HTMLImageElement>("[data-controller]");

  if (!playButton) {
    throw new Error('Element "[data-play-button]" wurde nicht gefunden.');
  }

  if (controller) {
    controller.src = startAssets.controller;
  }

  setCssImage(document.documentElement, "--play-button-image", startAssets.playButton);
  setCssImage(document.documentElement, "--play-button-hover-image", startAssets.playButtonHover);
  preloadImages([
    startAssets.controller,
    startAssets.playButton,
    startAssets.playButtonHover,
  ]);

  bindHoverClass(playButton);
  playButton.addEventListener("click", () => renderSettingsScreen(field));
};

const bindHoverClass = (button: HTMLButtonElement): void => {
  button.addEventListener("pointerenter", () => {
    button.classList.add("is-hovered");
  });

  button.addEventListener("pointerleave", () => {
    button.classList.remove("is-hovered");
  });

  button.addEventListener("focus", () => {
    button.classList.add("is-hovered");
  });

  button.addEventListener("blur", () => {
    button.classList.remove("is-hovered");
  });
};