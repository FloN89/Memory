import { preloadImages } from "./assets";
import { renderSettingsScreen } from "./settings-screen";
import { startAssets } from "./themes";
import { setCssImage } from "./utils";

/** Renders the complete start screen markup and activates its interactions. */
export const renderStartScreen = (field: HTMLElement): void => {
  field.className = "start-screen";
  field.setAttribute("aria-label", "Start Screen");

  field.innerHTML = `
    <div class="start-screen__copy">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
    </div>

    <button
      class="start-screen__play"
      data-play-button
      type="button"
      aria-label="Spiel starten"
      aria-pressed="false"
    >
      <span class="visually-hidden">Spiel starten</span>
    </button>

    <img
      class="start-screen__controller"
      data-controller
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `;

  initStartScreen(field);
};

/** Initializes the start screen assets and connects the play button to the settings screen. */
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

/** Adds and removes the shared hover class for pointer and keyboard interactions. */
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