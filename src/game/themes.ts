import { asset, componentAssets, preloadImages } from "./assets";
import type { BoardSize, ThemeConfig, ThemeKey } from "./types";

const numberedAssets = (folder: string, baseName: string, amount: number): string[] => {
  return Array.from({ length: amount }, (_, index) => {
    return asset(`${folder}/${baseName} ${index + 1}.png`);
  });
};

const optionalThemeAssets = (theme: ThemeConfig): string[] => {
  const confettiAssets = Array.isArray(theme.confetti)
    ? theme.confetti
    : [theme.confetti];

  return [theme.drawWinner, ...confettiAssets].filter(
    (source): source is string => Boolean(source),
  );
};

export const startAssets = {
  controller: asset("assets/base-themes/stadia_controller.png"),
  playButton: asset("assets/base-themes/play_button.png"),
  playButtonHover: asset("assets/base-themes/play_button_hover.png"),
} as const;

export const settingsAssets = {
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

export const themeConfigs: Record<ThemeKey, ThemeConfig> = {
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

    blueWinner: asset("assets/game-themes/pockal 1.png"),
    orangeWinner: asset("assets/game-themes/pockal 1.png"),
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

    blueWinner: asset("assets/food-themes/chess_pawn.png"),
    orangeWinner: asset("assets/food-themes/Frame 739_orange.png"),
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

/** Preloads all images that can appear on the settings screen. */
export const preloadSettingsAssets = (): void => {
  preloadImages([
    settingsAssets.startButton,
    settingsAssets.startButtonHover,
    settingsAssets.startButtonDisabled,
    settingsAssets.titleLine,
    settingsAssets.themeHoverLine,
    settingsAssets.summaryLineEmpty,
    settingsAssets.summaryLineSelected,
    settingsAssets.icons.themes,
    settingsAssets.icons.player,
    settingsAssets.icons.board,
    ...Object.values(themeConfigs).map((theme) => theme.previewImage),
  ]);
};

/** Preloads all images needed for the selected theme and board size. */
export const preloadThemeAssets = (
  theme: ThemeConfig,
  boardSize: BoardSize,
): void => {
  preloadImages([
    theme.cardBack,
    theme.cardBackHover,
    theme.blueToken,
    theme.orangeToken,
    theme.exitIcon,
    theme.exitIconHover,
    theme.blueWinner,
    theme.orangeWinner,
    ...optionalThemeAssets(theme),
    theme.buttons.back,
    theme.buttons.backHover,
    theme.buttons.exit,
    theme.buttons.exitHover,
    ...theme.cardFronts.slice(0, boardSize / 2),
  ]);
};