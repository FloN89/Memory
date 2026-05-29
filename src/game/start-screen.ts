import { preloadImages } from "./assets";
import { renderSettingsScreen } from "./settings-screen";
import { START_ASSETS } from "./themes";
import { setCssImage } from "./utils";

/** Renders the complete start screen markup and activates its interactions. */
export const renderStartScreen = (field: HTMLElement): void => {
  setupStartScreenRoot(field);
  field.innerHTML = renderStartScreenMarkup();
  initStartScreen(field);
};

/** Applies the start-screen root class and accessibility label. */
const setupStartScreenRoot = (field: HTMLElement): void => {
  field.className = "start-screen";
  field.setAttribute("aria-label", "Start Screen");
};

/** Renders the full start screen markup. */
const renderStartScreenMarkup = (): string => {
  return `
    ${renderStartCopy()}
    ${renderPlayButton()}
    ${renderControllerImage()}
  `;
};

/** Renders the headline copy for the start screen. */
const renderStartCopy = (): string => {
  return `
    <div class="start-screen__copy">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
    </div>
  `;
};

/** Renders the play button. */
const renderPlayButton = (): string => {
  return `
    <button class="start-screen__play" data-play-button type="button" aria-label="Spiel starten" aria-pressed="false">
      <span class="visually-hidden">Spiel starten</span>
    </button>
  `;
};

/** Renders the decorative controller image. */
const renderControllerImage = (): string => {
  return `<img class="start-screen__controller" data-controller alt="" aria-hidden="true" draggable="false" />`;
};

/** Initializes the start screen assets and connects the play button to the settings screen. */
export const initStartScreen = (field: HTMLElement): void => {
  const playButton = getPlayButton(field);

  setControllerImage(field);
  setStartCssImages();
  preloadStartAssets();
  bindHoverClass(playButton);
  playButton.addEventListener("click", () => renderSettingsScreen(field));
};

/** Returns the required play button or throws a clear error. */
const getPlayButton = (field: HTMLElement): HTMLButtonElement => {
  const playButton = field.querySelector<HTMLButtonElement>("[data-play-button]");

  if (!playButton) {
    throw new Error('Element "[data-play-button]" wurde nicht gefunden.');
  }

  return playButton;
};

/** Sets the controller image source when the image exists. */
const setControllerImage = (field: HTMLElement): void => {
  const controller = field.querySelector<HTMLImageElement>("[data-controller]");

  if (controller) {
    controller.src = START_ASSETS.controller;
  }
};

/** Stores start-screen images in CSS custom properties. */
const setStartCssImages = (): void => {
  setCssImage(document.documentElement, "--play-button-image", START_ASSETS.playButton);
  setCssImage(document.documentElement, "--play-button-hover-image", START_ASSETS.playButtonHover);
};

/** Preloads all start-screen images. */
const preloadStartAssets = (): void => {
  preloadImages([
    START_ASSETS.controller,
    START_ASSETS.playButton,
    START_ASSETS.playButtonHover,
  ]);
};

/** Adds and removes the shared hover class for pointer and keyboard interactions. */
const bindHoverClass = (button: HTMLButtonElement): void => {
  button.addEventListener("pointerenter", () => addHoverClass(button));
  button.addEventListener("focus", () => addHoverClass(button));
  button.addEventListener("pointerleave", () => removeHoverClass(button));
  button.addEventListener("blur", () => removeHoverClass(button));
};

/** Adds the hover class to an element. */
const addHoverClass = (element: HTMLElement): void => {
  element.classList.add("is-hovered");
};

/** Removes the hover class from an element. */
const removeHoverClass = (element: HTMLElement): void => {
  element.classList.remove("is-hovered");
};