export type ThemeKey = "code-vibes" | "gaming" | "foods";
export type PlayerKey = "blue" | "orange";
export type BoardSize = 16 | 24 | 36;
export type SettingName = "theme" | "player" | "boardSize";

export type SettingsState = {
  theme: ThemeKey | null;
  player: PlayerKey | null;
  boardSize: BoardSize | null;
};

export type CompleteSettings = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
  startedAt: number;
};

export type MemoryCard = {
  id: string;
  pairId: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export type MemoryGameState = {
  settings: CompleteSettings;
  theme: ThemeConfig;
  cards: MemoryCard[];
  currentPlayer: PlayerKey;
  score: Record<PlayerKey, number>;
  flippedIds: string[];
  lockBoard: boolean;
  isFinished: boolean;
};

export type ThemeButtonImages = {
  back: string;
  backHover: string;
  exit: string;
  exitHover: string;
};

export type ThemeConfig = {
  key: ThemeKey;
  label: string;
  previewImage: string;
  className: string;
  cardBack: string;
  cardBackHover: string;
  blueToken: string;
  orangeToken: string;
  exitIcon: string;
  exitIconHover: string;
  blueWinner: string;
  orangeWinner: string;
  drawWinner?: string;
  confetti?: string | string[];
  buttons: ThemeButtonImages;
  cardFronts: string[];
};