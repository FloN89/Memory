import { asset, componentAssets, preloadImages } from "./assets";
import type { BoardSize, ThemeConfig, ThemeKey } from "./types";

const playerTokenAssets = {
  blue: asset("assets/dev-themes/label.png"),
  orange: asset("assets/dev-themes/label_orange.png"),
} as const;

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

    blueToken: playerTokenAssets.blue,
    orangeToken: playerTokenAssets.orange,

    exitIcon: asset("assets/dev-themes/Property 1=Default.png"),
    exitIconHover: asset("assets/dev-themes/Property 1=hover.png"),

    blueWinner: asset("assets/dev-themes/code-vibes/blue-winner.png"),
    orangeWinner: asset("assets/dev-themes/code-vibes/orange-winner.png"),
    drawWinner: asset("assets/dev-themes/code-vibes/draw-winner.png"),
    confetti: asset("assets/dev-themes/code-vibes/confetti.png"),

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

    blueToken: playerTokenAssets.blue,
    orangeToken: playerTokenAssets.orange,

    exitIcon: asset("assets/game-themes/Property 1=Default.png"),
    exitIconHover: asset("assets/game-themes/Property 1=hover.png"),

    blueWinner: asset("assets/game-themes/gaming/blue-winner.png"),
    orangeWinner: asset("assets/game-themes/gaming/orange-winner.png"),
    drawWinner: asset("assets/game-themes/gaming/draw-winner.png"),
    confetti: asset("assets/game-themes/gaming/confetti.png"),

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

    blueToken: playerTokenAssets.blue,
    orangeToken: playerTokenAssets.orange,

    exitIcon: asset("assets/food-themes/Property 1=Default (2).png"),
    exitIconHover: asset("assets/food-themes/Property 1=hover (2).png"),

    blueWinner: asset("assets/food-themes/foods/blue-winner.png"),
    orangeWinner: asset("assets/food-themes/foods/orange-winner.png"),
    drawWinner: asset("assets/food-themes/foods/draw-winner.png"),
    confetti: asset("assets/food-themes/foods/confetti.png"),

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
    theme.drawWinner,
    theme.confetti,
    theme.buttons.back,
    theme.buttons.backHover,
    theme.buttons.exit,
    theme.buttons.exitHover,
    ...theme.cardFronts.slice(0, boardSize / 2),
  ]);
};