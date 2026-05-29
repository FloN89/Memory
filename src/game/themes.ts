import { asset, componentAssets, preloadImages } from "./assets";
import type { BoardSize, ThemeConfig, ThemeKey } from "./types";

const SETTINGS_IMAGE_ASSETS = [
  "startButton",
  "startButtonHover",
  "startButtonDisabled",
  "titleLine",
  "themeHoverLine",
  "summaryLineEmpty",
  "summaryLineSelected",
] as const;

/** Creates numbered image URLs from a folder and shared base name. */
const numberedAssets = (folder: string, baseName: string, amount: number): string[] => {
  return Array.from({ length: amount }, (_, index) => {
    return asset(`${folder}/${baseName} ${index + 1}.png`);
  });
};

/** Returns optional theme assets while removing missing values. */
const optionalThemeAssets = (theme: ThemeConfig): string[] => {
  const confettiAssets = Array.isArray(theme.confetti)
    ? theme.confetti
    : [theme.confetti];

  return [theme.drawWinner, ...confettiAssets].filter(
    (source): source is string => Boolean(source),
  );
};

export const START_ASSETS = {
  controller: asset("assets/base-themes/stadia_controller.png"),
  playButton: asset("assets/base-themes/play_button.png"),
  playButtonHover: asset("assets/base-themes/play_button_hover.png"),
} as const;

export const SETTINGS_ASSETS = {
  startButton: asset("assets/base-themes/start_button.png"),
  startButtonHover: asset("assets/base-themes/start_button_hover.png"),
  startButtonDisabled: asset("assets/base-themes/start_button_disabled.png"),

  titleLine: asset("assets/base-themes/Line3_settings.png"),
  themeHoverLine: asset("assets/base-themes/Line 3.png"),
  summaryLineEmpty: asset("assets/base-themes/Line 6.png"),
  summaryLineSelected: asset("assets/base-themes/line3_down.png"),

  icons: {
    themes: asset("assets/base-themes/palette.png"),
    player: asset("assets/base-themes/chess_pawn.png"),
    board: asset("assets/base-themes/style.png"),
  },
} as const;

export const THEME_CONFIGS: Record<ThemeKey, ThemeConfig> = {
  "code-vibes": {
    key: "code-vibes",
    label: "Code vibes theme",
    previewImage: asset("assets/dev-themes/Property 1=IT logos.png"),
    className: "theme-code-vibes",

    cardBack: asset("assets/dev-themes/Property 1=Component 21.png"),
    cardBackHover: asset("assets/dev-themes/Property 1=Component 21.png"),

    blueToken: asset("assets/dev-themes/label.png"),
    orangeToken: asset("assets/dev-themes/label_orange.png"),

    exitIcon: asset("assets/dev-themes/Property 1=Default.png"),
    exitIconHover: asset("assets/dev-themes/Property 1=hover.png"),

    blueWinner: asset("assets/dev-themes/label.png"),
    orangeWinner: asset("assets/dev-themes/label_orange.png"),
    drawWinner: asset("assets/dev-themes/Scale_Icon.png"),
    confetti: numberedAssets("assets/dev-themes", "confetti", 8),

    buttons: {
      back: asset("assets/dev-themes/Property 1=Default_back.png"),
      backHover: asset("assets/dev-themes/Property 1=Hover_back.png"),
      exit: asset("assets/dev-themes/Property 1=Default.png"),
      exitHover: asset("assets/dev-themes/Property 1=hover.png"),
    },

    cardFronts: componentAssets(
      "assets/dev-themes",
      "Property 1=Component 22",
    ),
  },

  gaming: {
    key: "gaming",
    label: "Gaming theme",
    previewImage: asset("assets/game-themes/Property 1=gameing.png"),
    className: "theme-gaming",

    cardBack: asset("assets/game-themes/Rectangle 37.png"),
    cardBackHover: asset("assets/game-themes/Rectangle 37.png"),

    blueToken: asset("assets/game-themes/chess_pawn_blue.png"),
    orangeToken: asset("assets/game-themes/chess_pawn.png"),

    exitIcon: asset("assets/game-themes/Property 1=Default.png"),
    exitIconHover: asset("assets/game-themes/Property 1=hover.png"),

    blueWinner: asset("assets/game-themes/chess_pawn_blue.png"),
    orangeWinner: asset("assets/game-themes/chess_pawn.png"),
    drawWinner: asset("assets/game-themes/Scale_Icon.png"),

    buttons: {
      back: asset("assets/game-themes/Property 1=default (1).png"),
      backHover: asset("assets/game-themes/Property 1=hover (1).png"),
      exit: asset("assets/game-themes/Property 1=Default.png"),
      exitHover: asset("assets/game-themes/Property 1=hover.png"),
    },

    cardFronts: componentAssets(
      "assets/game-themes",
      "Property 1=Component 2",
    ),
  },

  foods: {
    key: "foods",
    label: "Foods theme",
    previewImage: asset("assets/food-themes/Property 1=foods.png"),
    className: "theme-foods",

    cardBack: asset("assets/food-themes/frond.png"),
    cardBackHover: asset("assets/food-themes/frond.png"),

    blueToken: asset("assets/food-themes/chess_pawn_blue.png"),
    orangeToken: asset("assets/food-themes/chess_pawn.png"),

    exitIcon: asset("assets/food-themes/Property 1=Default (2).png"),
    exitIconHover: asset("assets/food-themes/Property 1=hover (2).png"),

    blueWinner: asset("assets/food-themes/chess_pawn_blue.png"),
    orangeWinner: asset("assets/food-themes/chess_pawn.png"),
    drawWinner: asset("assets/food-themes/Frame 739.png"),

    buttons: {
      back: asset("assets/food-themes/Property 1=Default (3).png"),
      backHover: asset("assets/food-themes/Property 1=hover (3).png"),
      exit: asset("assets/food-themes/Property 1=Default (2).png"),
      exitHover: asset("assets/food-themes/Property 1=hover (2).png"),
    },

    cardFronts: componentAssets(
      "assets/food-themes",
      "Property 1=Component 3",
    ),
  },
};

/** Returns all image URLs used by the settings screen. */
const getSettingsImageSources = (): string[] => {
  const baseSources = SETTINGS_IMAGE_ASSETS.map((key) => SETTINGS_ASSETS[key]);
  const iconSources = Object.values(SETTINGS_ASSETS.icons);
  const previewSources = Object.values(THEME_CONFIGS).map((theme) => theme.previewImage);

  return [...baseSources, ...iconSources, ...previewSources];
};

/** Returns all fixed image URLs used by one theme. */
const getThemeBaseSources = (theme: ThemeConfig): string[] => {
  return [
    theme.cardBack,
    theme.cardBackHover,
    theme.blueToken,
    theme.orangeToken,
    theme.exitIcon,
    theme.exitIconHover,
    theme.blueWinner,
    theme.orangeWinner,
  ];
};

/** Returns all button image URLs used by one theme. */
const getThemeButtonSources = (theme: ThemeConfig): string[] => {
  return [
    theme.buttons.back,
    theme.buttons.backHover,
    theme.buttons.exit,
    theme.buttons.exitHover,
  ];
};

/** Preloads all images that can appear on the settings screen. */
export const preloadSettingsAssets = (): void => {
  preloadImages(getSettingsImageSources());
};

/** Preloads all images needed for the selected theme and board size. */
export const preloadThemeAssets = (
  theme: ThemeConfig,
  boardSize: BoardSize,
): void => {
  preloadImages([
    ...getThemeBaseSources(theme),
    ...optionalThemeAssets(theme),
    ...getThemeButtonSources(theme),
    ...theme.cardFronts.slice(0, boardSize / 2),
  ]);
};