import { renderMemoryGame } from "./memory-game";
import {
  preloadSettingsAssets,
  settingsAssets,
  themeConfigs,
} from "./themes";
import type {
  BoardSize,
  PlayerKey,
  SettingName,
  SettingsState,
  ThemeKey,
} from "./types";
import { capitalize, setCssImage } from "./utils";

const state: SettingsState = {
  theme: null,
  player: null,
  boardSize: null,
};

let hoveredTheme: ThemeKey | null = null;
let field: HTMLElement;

export const renderSettingsScreen = (root: HTMLElement): void => {
  field = root;
  field.className = "settings-screen";
  field.setAttribute("aria-label", "Settings");

  setSettingsCssImages();
  preloadSettingsAssets();

  field.innerHTML = `
    <div class="settings-screen__inner">
      <section class="settings-screen__left" aria-label="Game settings">
        <h1 class="settings-screen__title">Settings</h1>

        <div class="settings-screen__groups">
          <fieldset class="settings-group settings-group--themes">
            <legend>
              <img
                class="settings-group__icon"
                src="${settingsAssets.icons.themes}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Game themes</span>
            </legend>

            ${renderRadio("theme", "code-vibes", "Code vibes theme", state.theme === "code-vibes")}
            ${renderRadio("theme", "gaming", "Gaming theme", state.theme === "gaming")}
            ${renderRadio("theme", "foods", "Foods theme", state.theme === "foods")}
          </fieldset>

          <fieldset class="settings-group settings-group--player">
            <legend>
              <img
                class="settings-group__icon"
                src="${settingsAssets.icons.player}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Choose player</span>
            </legend>

            ${renderRadio("player", "blue", "Blue", state.player === "blue")}
            ${renderRadio("player", "orange", "Orange", state.player === "orange")}
          </fieldset>

          <fieldset class="settings-group settings-group--board">
            <legend>
              <img
                class="settings-group__icon"
                src="${settingsAssets.icons.board}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Board size</span>
            </legend>

            ${renderRadio("boardSize", "16", "16 cards", state.boardSize === 16)}
            ${renderRadio("boardSize", "24", "24 cards", state.boardSize === 24)}
            ${renderRadio("boardSize", "36", "36 cards", state.boardSize === 36)}
          </fieldset>
        </div>
      </section>

      <section class="settings-screen__right" aria-label="Theme preview">
        <div class="theme-preview" data-theme-preview>
          <img
            class="theme-preview__image"
            data-theme-preview-image
            alt=""
            draggable="false"
          />
        </div>

        <div class="settings-summary" aria-label="Selected settings">
          <span class="settings-summary__item" data-summary-theme>Game theme</span>
          <span class="settings-summary__divider" data-summary-divider-theme aria-hidden="true"></span>

          <span class="settings-summary__item" data-summary-player>Player</span>
          <span class="settings-summary__divider" data-summary-divider-player aria-hidden="true"></span>

          <span class="settings-summary__item" data-summary-board>Board size</span>

          <button class="settings-summary__start" data-settings-start type="button" disabled>
            <span class="visually-hidden">Start</span>
          </button>
        </div>
      </section>
    </div>
  `;

  bindSettingsEvents();
  updateSettingsUi();
};

const setSettingsCssImages = (): void => {
  setCssImage(field, "--settings-start-button-image", settingsAssets.startButton);
  setCssImage(field, "--settings-start-button-hover-image", settingsAssets.startButtonHover);
  setCssImage(field, "--settings-start-button-disabled-image", settingsAssets.startButtonDisabled);
  setCssImage(field, "--settings-title-line-image", settingsAssets.titleLine);
  setCssImage(field, "--settings-theme-hover-line-image", settingsAssets.themeHoverLine);
  setCssImage(field, "--settings-summary-line-empty-image", settingsAssets.summaryLineEmpty);
  setCssImage(field, "--settings-summary-line-selected-image", settingsAssets.summaryLineSelected);
};

const renderRadio = (
  name: SettingName,
  value: string,
  label: string,
  checked = false,
): string => {
  return `
    <label class="settings-radio" data-radio-name="${name}">
      <input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} />
      <span class="settings-radio__text">${label}</span>
    </label>
  `;
};

const bindSettingsEvents = (): void => {
  const themeInputs = field.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const themeLabels = field.querySelectorAll<HTMLLabelElement>(
    ".settings-group--themes .settings-radio",
  );

  const playerInputs = field.querySelectorAll<HTMLInputElement>('input[name="player"]');
  const boardInputs = field.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');
  const startButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  themeLabels.forEach((label) => bindThemeHover(label));
  themeInputs.forEach((input) => bindThemeInput(input));
  playerInputs.forEach((input) => bindPlayerInput(input));
  boardInputs.forEach((input) => bindBoardInput(input));

  startButton?.addEventListener("click", () => {
    if (!state.theme || !state.player || !state.boardSize) {
      return;
    }

    renderMemoryGame(field, {
      theme: state.theme,
      player: state.player,
      boardSize: state.boardSize,
      startedAt: Date.now(),
    });
  });
};

const bindThemeHover = (label: HTMLLabelElement): void => {
  const input = label.querySelector<HTMLInputElement>('input[name="theme"]');

  if (!input) {
    return;
  }

  const themeValue = input.value as ThemeKey;

  label.addEventListener("pointerenter", () => {
    hoveredTheme = themeValue;
    updateSettingsUi();
  });

  label.addEventListener("pointerleave", () => {
    hoveredTheme = null;
    updateSettingsUi();
  });

  label.addEventListener("focusin", () => {
    hoveredTheme = themeValue;
    updateSettingsUi();
  });

  label.addEventListener("focusout", () => {
    hoveredTheme = null;
    updateSettingsUi();
  });
};

const bindThemeInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    state.theme = input.value as ThemeKey;
    hoveredTheme = null;
    updateSettingsUi();
  });
};

const bindPlayerInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    state.player = input.value as PlayerKey;
    updateSettingsUi();
  });
};

const bindBoardInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    state.boardSize = Number(input.value) as BoardSize;
    updateSettingsUi();
  });
};

const updateSettingsUi = (): void => {
  const preview = field.querySelector<HTMLElement>("[data-theme-preview]");
  const previewImage = field.querySelector<HTMLImageElement>("[data-theme-preview-image]");

  const summaryTheme = field.querySelector<HTMLElement>("[data-summary-theme]");
  const summaryPlayer = field.querySelector<HTMLElement>("[data-summary-player]");
  const summaryBoard = field.querySelector<HTMLElement>("[data-summary-board]");

  const themeDivider = field.querySelector<HTMLElement>("[data-summary-divider-theme]");
  const playerDivider = field.querySelector<HTMLElement>("[data-summary-divider-player]");
  const startButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  updatePreview(preview, previewImage);
  updateSummary(summaryTheme, summaryPlayer, summaryBoard);

  themeDivider?.classList.toggle("is-selected", state.theme !== null);
  playerDivider?.classList.toggle("is-selected", state.player !== null);

  if (startButton) {
    startButton.disabled = !(state.theme && state.player && state.boardSize);
  }
};

const updatePreview = (
  preview: HTMLElement | null,
  previewImage: HTMLImageElement | null,
): void => {
  const previewTheme = hoveredTheme ?? state.theme ?? "code-vibes";
  const previewThemeData = themeConfigs[previewTheme];

  if (!preview || !previewImage) {
    return;
  }

  preview.dataset.placeholder = "";
  previewImage.hidden = false;
  previewImage.src = previewThemeData.previewImage;
  previewImage.alt = `${previewThemeData.label} preview`;

  previewImage.onerror = () => {
    previewImage.hidden = true;
    preview.dataset.placeholder = `${previewThemeData.label} Bild nicht gefunden`;
  };
};

const updateSummary = (
  summaryTheme: HTMLElement | null,
  summaryPlayer: HTMLElement | null,
  summaryBoard: HTMLElement | null,
): void => {
  if (summaryTheme) {
    summaryTheme.textContent = state.theme
      ? themeConfigs[state.theme].label
      : "Game theme";
  }

  if (summaryPlayer) {
    summaryPlayer.textContent = state.player ? capitalize(state.player) : "Player";
  }

  if (summaryBoard) {
    summaryBoard.textContent = state.boardSize
      ? `${state.boardSize} cards`
      : "Board size";
  }
};