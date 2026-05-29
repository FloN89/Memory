import { THEME_CONFIGS } from "./themes";
import {
  BOARD_SIZES,
  PLAYER_KEYS,
  THEME_KEYS,
} from "./types";
import type {
  BoardSize,
  CompleteSettings,
  PlayerKey,
  SettingsState,
  ThemeKey,
} from "./types";
import { capitalize } from "./utils";

export type RadioOption<T extends string | number> = {
  value: T;
  label: string;
};

export const DEFAULT_PREVIEW_THEME: ThemeKey = "code-vibes";

export const THEME_OPTIONS: Array<RadioOption<ThemeKey>> = [
  { value: "code-vibes", label: "Code vibes theme" },
  { value: "gaming", label: "Gaming theme" },
  { value: "foods", label: "Foods theme" },
];

export const PLAYER_OPTIONS: Array<RadioOption<PlayerKey>> = [
  { value: "blue", label: "Blue" },
  { value: "orange", label: "Orange" },
];

export const BOARD_OPTIONS: Array<RadioOption<BoardSize>> = [
  { value: 16, label: "16 cards" },
  { value: 24, label: "24 cards" },
  { value: 36, label: "36 cards" },
];

/** Returns complete settings only when all required values are selected. */
export const getCompleteSettings = (state: SettingsState): CompleteSettings | null => {
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

/** Returns the summary text for the selected theme. */
export const getSummaryThemeText = (state: SettingsState): string => {
  return state.theme ? THEME_CONFIGS[state.theme].label : "Game theme";
};

/** Returns the summary text for the selected player. */
export const getSummaryPlayerText = (state: SettingsState): string => {
  return state.player ? capitalize(state.player) : "Player";
};

/** Returns the summary text for the selected board size. */
export const getSummaryBoardText = (state: SettingsState): string => {
  return state.boardSize ? `${state.boardSize} cards` : "Board size";
};

/** Checks whether a string is a valid theme key. */
export const isThemeKey = (value: string): value is ThemeKey => {
  return THEME_KEYS.some((themeKey) => themeKey === value);
};

/** Checks whether a string is a valid player key. */
export const isPlayerKey = (value: string): value is PlayerKey => {
  return PLAYER_KEYS.some((playerKey) => playerKey === value);
};

/** Parses a board-size input value safely. */
export const parseBoardSize = (value: string): BoardSize | null => {
  const boardSize = Number(value);

  return isBoardSize(boardSize) ? boardSize : null;
};

/** Checks whether a number is a valid board size. */
const isBoardSize = (value: number): value is BoardSize => {
  return BOARD_SIZES.some((boardSize) => boardSize === value);
};