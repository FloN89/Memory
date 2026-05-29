import { renderMemoryGame } from "./memory-game";
import {
  preloadSettingsAssets,
  SETTINGS_ASSETS,
  THEME_CONFIGS,
} from "./themes";
import {
  BOARD_SIZES,
  PLAYER_KEYS,
  THEME_KEYS,
} from "./types";
import type {
  BoardSize,
  CompleteSettings,
  PlayerKey,
  SettingName,
  SettingsState,
  ThemeKey,
} from "./types";
import { capitalize, setCssImage } from "./utils";

type RadioOption<T extends string | number> = {
  value: T;
  label: string;
};

const DEFAULT_PREVIEW_THEME: ThemeKey = "code-vibes";

const THEME_OPTIONS: Array<RadioOption<ThemeKey>> = [
  { value: "code-vibes", label: "Code vibes theme" },
  { value: "gaming", label: "Gaming theme" },
  { value: "foods", label: "Foods theme" },
];

const PLAYER_OPTIONS: Array<RadioOption<PlayerKey>> = [
  { value: "blue", label: "Blue" },
  { value: "orange", label: "Orange" },
];

const BOARD_OPTIONS: Array<RadioOption<BoardSize>> = [
  { value: 16, label: "16 cards" },
  { value: 24, label: "24 cards" },
  { value: 36, label: "36 cards" },
];

const state: SettingsState = {
  theme: null,
  player: null,
  boardSize: null,
};

let hoveredTheme: ThemeKey | null = null;
let field: HTMLElement;

/** Renders the complete settings screen and activates its interactions. */
export const renderSettingsScreen = (root: HTMLElement): void => {
  field = root;
  setupSettingsRoot();
  setSettingsCssImages();
  preloadSettingsAssets();
  field.innerHTML = renderSettingsMarkup();
  bindSettingsEvents();
  updateSettingsUi();
};

/** Applies the settings root class and accessibility label. */
const setupSettingsRoot = (): void => {
  field.className = "settings-screen";
  field.setAttribute("aria-label", "Settings");
};

/** Renders the complete settings screen markup. */
const renderSettingsMarkup = (): string => {
  return `
    <div class="settings-screen__inner">
      ${renderSettingsLeftSection()}
      ${renderSettingsRightSection()}
    </div>
  `;
};

/** Renders the left settings section with all radio groups. */
const renderSettingsLeftSection = (): string => {
  return `
    <section class="settings-screen__left" aria-label="Game settings">
      <h1 class="settings-screen__title">Settings</h1>
      <div class="settings-screen__groups">
        ${renderThemeGroup()}
        ${renderPlayerGroup()}
        ${renderBoardGroup()}
      </div>
    </section>
  `;
};

/** Renders the theme radio group. */
const renderThemeGroup = (): string => {
  return renderFieldset(
    "themes",
    SETTINGS_ASSETS.icons.themes,
    "Game themes",
    renderThemeOptions(),
  );
};

/** Renders the player radio group. */
const renderPlayerGroup = (): string => {
  return renderFieldset(
    "player",
    SETTINGS_ASSETS.icons.player,
    "Choose player",
    renderPlayerOptions(),
  );
};

/** Renders the board-size radio group. */
const renderBoardGroup = (): string => {
  return renderFieldset(
    "board",
    SETTINGS_ASSETS.icons.board,
    "Board size",
    renderBoardOptions(),
  );
};

/** Renders one settings fieldset with icon and content. */
const renderFieldset = (
  modifier: string,
  icon: string,
  title: string,
  content: string,
): string => {
  return `
    <fieldset class="settings-group settings-group--${modifier}">
      ${renderLegend(icon, title)}
      ${content}
    </fieldset>
  `;
};

/** Renders one fieldset legend with icon. */
const renderLegend = (icon: string, title: string): string => {
  return `
    <legend>
      <img class="settings-group__icon" src="${icon}" alt="" aria-hidden="true" draggable="false" />
      <span>${title}</span>
    </legend>
  `;
};

/** Renders all theme radio inputs. */
const renderThemeOptions = (): string => {
  return THEME_OPTIONS
    .map((option) => renderRadio("theme", option, state.theme === option.value))
    .join("");
};

/** Renders all player radio inputs. */
const renderPlayerOptions = (): string => {
  return PLAYER_OPTIONS
    .map((option) => renderRadio("player", option, state.player === option.value))
    .join("");
};

/** Renders all board-size radio inputs. */
const renderBoardOptions = (): string => {
  return BOARD_OPTIONS
    .map((option) => renderRadio("boardSize", option, state.boardSize === option.value))
    .join("");
};

/** Renders one radio label and input. */
const renderRadio = (
  name: SettingName,
  option: RadioOption<string | number>,
  checked = false,
): string => {
  return `
    <label class="settings-radio" data-radio-name="${name}">
      <input type="radio" name="${name}" value="${option.value}" ${checked ? "checked" : ""} />
      <span class="settings-radio__text">${option.label}</span>
    </label>
  `;
};

/** Renders the right settings section with preview and summary. */
const renderSettingsRightSection = (): string => {
  return `
    <section class="settings-screen__right" aria-label="Theme preview">
      ${renderThemePreview()}
      ${renderSettingsSummary()}
    </section>
  `;
};

/** Renders the theme preview container. */
const renderThemePreview = (): string => {
  return `
    <div class="theme-preview" data-theme-preview>
      <img class="theme-preview__image" data-theme-preview-image alt="" draggable="false" />
    </div>
  `;
};

/** Renders the selected settings summary. */
const renderSettingsSummary = (): string => {
  return `
    <div class="settings-summary" aria-label="Selected settings">
      <span class="settings-summary__item" data-summary-theme>Game theme</span>
      <span class="settings-summary__divider" data-summary-divider-theme aria-hidden="true"></span>
      <span class="settings-summary__item" data-summary-player>Player</span>
      <span class="settings-summary__divider" data-summary-divider-player aria-hidden="true"></span>
      <span class="settings-summary__item" data-summary-board>Board size</span>
      ${renderStartButton()}
    </div>
  `;
};

/** Renders the disabled start button. */
const renderStartButton = (): string => {
  return `
    <button class="settings-summary__start" data-settings-start type="button" disabled>
      <span class="visually-hidden">Start</span>
    </button>
  `;
};

/** Stores settings-screen images in CSS custom properties. */
const setSettingsCssImages = (): void => {
  setCssImage(field, "--settings-start-button-image", SETTINGS_ASSETS.startButton);
  setCssImage(field, "--settings-start-button-hover-image", SETTINGS_ASSETS.startButtonHover);
  setCssImage(field, "--settings-start-button-disabled-image", SETTINGS_ASSETS.startButtonDisabled);
  setCssImage(field, "--settings-title-line-image", SETTINGS_ASSETS.titleLine);
  setCssImage(field, "--settings-theme-hover-line-image", SETTINGS_ASSETS.themeHoverLine);
  setCssImage(field, "--settings-summary-line-empty-image", SETTINGS_ASSETS.summaryLineEmpty);
  setCssImage(field, "--settings-summary-line-selected-image", SETTINGS_ASSETS.summaryLineSelected);
};

/** Attaches all settings screen event handlers. */
const bindSettingsEvents = (): void => {
  bindThemeEvents();
  bindPlayerEvents();
  bindBoardEvents();
  bindStartEvent();
};

/** Attaches theme input and hover handlers. */
const bindThemeEvents = (): void => {
  const themeInputs = field.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const themeLabels = field.querySelectorAll<HTMLLabelElement>(".settings-group--themes .settings-radio");

  themeLabels.forEach(bindThemeHover);
  themeInputs.forEach(bindThemeInput);
};

/** Attaches player input handlers. */
const bindPlayerEvents = (): void => {
  field.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(bindPlayerInput);
};

/** Attaches board-size input handlers. */
const bindBoardEvents = (): void => {
  field.querySelectorAll<HTMLInputElement>('input[name="boardSize"]').forEach(bindBoardInput);
};

/** Attaches the start button handler. */
const bindStartEvent = (): void => {
  field.querySelector<HTMLButtonElement>("[data-settings-start]")?.addEventListener("click", () => {
    const settings = getCompleteSettings();

    if (settings) {
      renderMemoryGame(field, settings);
    }
  });
};

/** Returns complete settings only when all required values are selected. */
const getCompleteSettings = (): CompleteSettings | null => {
  if (!state.theme || !state.player || !state.boardSize) {
    return null;
  }

  return {
    theme: state.theme,
    player: state.player,
    boardSize: state.boardSize,
    startedAt: Date.now(),
  };
};

/** Adds preview hover and focus events to one theme label. */
const bindThemeHover = (label: HTMLLabelElement): void => {
  const input = label.querySelector<HTMLInputElement>('input[name="theme"]');

  if (!input || !isThemeKey(input.value)) {
    return;
  }

  bindThemeHoverEvents(label, input.value);
};

/** Attaches all hover/focus events for one theme label. */
const bindThemeHoverEvents = (label: HTMLLabelElement, theme: ThemeKey): void => {
  label.addEventListener("pointerenter", () => setHoveredTheme(theme));
  label.addEventListener("focusin", () => setHoveredTheme(theme));
  label.addEventListener("pointerleave", clearHoveredTheme);
  label.addEventListener("focusout", clearHoveredTheme);
};

/** Sets the currently hovered theme and refreshes the UI. */
const setHoveredTheme = (theme: ThemeKey): void => {
  hoveredTheme = theme;
  updateSettingsUi();
};

/** Clears the hovered theme and refreshes the UI. */
const clearHoveredTheme = (): void => {
  hoveredTheme = null;
  updateSettingsUi();
};

/** Attaches the change handler to one theme input. */
const bindThemeInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    if (isThemeKey(input.value)) {
      state.theme = input.value;
      hoveredTheme = null;
      updateSettingsUi();
    }
  });
};

/** Attaches the change handler to one player input. */
const bindPlayerInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    if (isPlayerKey(input.value)) {
      state.player = input.value;
      updateSettingsUi();
    }
  });
};

/** Attaches the change handler to one board-size input. */
const bindBoardInput = (input: HTMLInputElement): void => {
  input.addEventListener("change", () => {
    state.boardSize = parseBoardSize(input.value);
    updateSettingsUi();
  });
};

/** Synchronizes preview, summary, dividers, and start button state. */
const updateSettingsUi = (): void => {
  updatePreview();
  updateSummary();
  updateDividers();
  updateStartButton();
};

/** Updates the theme preview image. */
const updatePreview = (): void => {
  const preview = field.querySelector<HTMLElement>("[data-theme-preview]");
  const previewImage = field.querySelector<HTMLImageElement>("[data-theme-preview-image]");

  if (!preview || !previewImage) {
    return;
  }

  setPreviewImage(preview, previewImage);
};

/** Sets the preview image for hovered, selected, or default theme. */
const setPreviewImage = (
  preview: HTMLElement,
  previewImage: HTMLImageElement,
): void => {
  const previewTheme = hoveredTheme ?? state.theme ?? DEFAULT_PREVIEW_THEME;
  const previewThemeData = THEME_CONFIGS[previewTheme];

  preview.dataset.placeholder = "";
  previewImage.hidden = false;
  previewImage.src = previewThemeData.previewImage;
  previewImage.alt = `${previewThemeData.label} preview`;
  previewImage.onerror = () => showPreviewError(preview, previewImage, previewThemeData.label);
};

/** Shows a fallback message when the preview image cannot be loaded. */
const showPreviewError = (
  preview: HTMLElement,
  previewImage: HTMLImageElement,
  label: string,
): void => {
  previewImage.hidden = true;
  preview.dataset.placeholder = `${label} Bild nicht gefunden`;
};

/** Updates all summary texts. */
const updateSummary = (): void => {
  updateText("[data-summary-theme]", getSummaryThemeText());
  updateText("[data-summary-player]", getSummaryPlayerText());
  updateText("[data-summary-board]", getSummaryBoardText());
};

/** Returns the summary text for the selected theme. */
const getSummaryThemeText = (): string => {
  return state.theme ? THEME_CONFIGS[state.theme].label : "Game theme";
};

/** Returns the summary text for the selected player. */
const getSummaryPlayerText = (): string => {
  return state.player ? capitalize(state.player) : "Player";
};

/** Returns the summary text for the selected board size. */
const getSummaryBoardText = (): string => {
  return state.boardSize ? `${state.boardSize} cards` : "Board size";
};

/** Updates one text element when it exists. */
const updateText = (selector: string, value: string): void => {
  const element = field.querySelector<HTMLElement>(selector);

  if (element) {
    element.textContent = value;
  }
};

/** Updates the selected state of summary divider lines. */
const updateDividers = (): void => {
  toggleSelected("[data-summary-divider-theme]", state.theme !== null);
  toggleSelected("[data-summary-divider-player]", state.player !== null);
};

/** Toggles the selected class on one element. */
const toggleSelected = (selector: string, isSelected: boolean): void => {
  field.querySelector<HTMLElement>(selector)?.classList.toggle("is-selected", isSelected);
};

/** Enables the start button only when all settings are selected. */
const updateStartButton = (): void => {
  const startButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  if (startButton) {
    startButton.disabled = getCompleteSettings() === null;
  }
};

/** Checks whether a string is a valid theme key. */
const isThemeKey = (value: string): value is ThemeKey => {
  return THEME_KEYS.some((themeKey) => themeKey === value);
};

/** Checks whether a string is a valid player key. */
const isPlayerKey = (value: string): value is PlayerKey => {
  return PLAYER_KEYS.some((playerKey) => playerKey === value);
};

/** Parses a board-size input value safely. */
const parseBoardSize = (value: string): BoardSize | null => {
  const boardSize = Number(value);

  return isBoardSize(boardSize) ? boardSize : null;
};

/** Checks whether a number is a valid board size. */
const isBoardSize = (value: number): value is BoardSize => {
  return BOARD_SIZES.some((boardSize) => boardSize === value);
};