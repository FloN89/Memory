import { renderCard, renderScoreItem, renderToken, updateGameUi } from "./memory-render";
import { renderGameOver, showQuitDialog } from "./memory-screens";
import { preloadThemeAssets, THEME_CONFIGS } from "./themes";
import type {
  CompleteSettings,
  MemoryCard,
  MemoryGameState,
  PlayerKey,
  ThemeConfig,
} from "./types";
import { setCssImage, shuffleArray } from "./utils";

const CARDS_PER_PAIR = 2 as const;
const MATCH_SCORE = 2 as const;
const MATCH_DELAY_MS = 350 as const;
const WINNER_SCREEN_DELAY_MS = 650 as const;
const MISMATCH_DELAY_MS = 850 as const;

const NEXT_PLAYER = {
  blue: "orange",
  orange: "blue",
} as const satisfies Record<PlayerKey, PlayerKey>;

let field: HTMLElement;

/** Renders a new memory game with the chosen settings and binds its event handlers. */
export const renderMemoryGame = (
  root: HTMLElement,
  settings: CompleteSettings,
): void => {
  field = root;

  const theme = THEME_CONFIGS[settings.theme];
  const game = createMemoryGame(settings, theme);

  setupGameRoot(settings, theme);
  setGameCssImages(theme);
  preloadThemeAssets(theme, settings.boardSize);
  field.innerHTML = renderGameMarkup(theme, game);
  bindGameEvents(game);
  updateGameUi(field, game);
};

/** Applies the root class and accessibility label for the active game. */
const setupGameRoot = (settings: CompleteSettings, theme: ThemeConfig): void => {
  field.className = `memory-game memory-game--${settings.boardSize} ${theme.className}`;
  field.setAttribute("aria-label", `${theme.label} memory game`);
};

/** Renders the complete memory game markup. */
const renderGameMarkup = (theme: ThemeConfig, game: MemoryGameState): string => {
  return `
    ${renderTopbar(theme, game)}
    ${renderBoard(game.cards)}
    <div data-dialog-root></div>
  `;
};

/** Renders the top bar with score, current player, and exit button. */
const renderTopbar = (theme: ThemeConfig, game: MemoryGameState): string => {
  return `
    <header class="memory-game__topbar">
      ${renderScoreboard(theme, game)}
      ${renderCurrentPlayer(theme, game)}
      ${renderExitButton()}
    </header>
  `;
};

/** Renders the score board for both players. */
const renderScoreboard = (theme: ThemeConfig, game: MemoryGameState): string => {
  return `
    <div class="memory-scoreboard" aria-label="Score">
      ${renderScoreItem(theme, "orange", game.score.orange)}
      ${renderScoreItem(theme, "blue", game.score.blue)}
    </div>
  `;
};

/** Renders the current-player display. */
const renderCurrentPlayer = (theme: ThemeConfig, game: MemoryGameState): string => {
  return `
    <div class="memory-current">
      <span>Current player:</span>
      <span data-current-player>${renderToken(theme, game.currentPlayer)}</span>
    </div>
  `;
};

/** Renders the game exit button. */
const renderExitButton = (): string => {
  return `
    <button class="memory-exit" data-exit type="button">
      <span class="visually-hidden">Exit game</span>
    </button>
  `;
};

/** Renders the clickable memory card board. */
const renderBoard = (cards: MemoryCard[]): string => {
  return `
    <main class="memory-board" aria-label="Memory cards">
      ${cards.map(renderCard).join("")}
    </main>
  `;
};

/** Stores theme-specific game button and card images in CSS custom properties. */
const setGameCssImages = (theme: ThemeConfig): void => {
  setCssImage(field, "--memory-card-back-image", theme.cardBack);
  setCssImage(field, "--memory-card-back-hover-image", theme.cardBackHover);
  setCssImage(field, "--memory-exit-image", theme.buttons.exit);
  setCssImage(field, "--memory-exit-hover-image", theme.buttons.exitHover);
  setCssImage(field, "--memory-dialog-back-image", theme.buttons.back);
  setCssImage(field, "--memory-dialog-back-hover-image", theme.buttons.backHover);
  setCssImage(field, "--memory-dialog-exit-image", theme.buttons.exit);
  setCssImage(field, "--memory-dialog-exit-hover-image", theme.buttons.exitHover);
};

/** Creates the full in-memory game state from settings and theme assets. */
const createMemoryGame = (
  settings: CompleteSettings,
  theme: ThemeConfig,
): MemoryGameState => {
  return {
    settings,
    theme,
    cards: shuffleArray(createMemoryCards(settings, theme)),
    currentPlayer: settings.player,
    score: createInitialScore(),
    flippedIds: [],
    lockBoard: false,
    isFinished: false,
  };
};

/** Creates all memory cards for the selected board size and theme. */
const createMemoryCards = (
  settings: CompleteSettings,
  theme: ThemeConfig,
): MemoryCard[] => {
  const pairCount = settings.boardSize / CARDS_PER_PAIR;
  const fronts = theme.cardFronts.slice(0, pairCount);

  if (fronts.length < pairCount) {
    throw new Error(`${theme.label} braucht mindestens ${pairCount} Kartenbilder.`);
  }

  return fronts.flatMap(createCardPair);
};

/** Creates the two cards that belong to one pair. */
const createCardPair = (image: string, pairId: number): MemoryCard[] => {
  return [
    createMemoryCard(image, pairId, "a"),
    createMemoryCard(image, pairId, "b"),
  ];
};

/** Creates one hidden memory card. */
const createMemoryCard = (
  image: string,
  pairId: number,
  suffix: string,
): MemoryCard => {
  return {
    id: `${pairId}-${suffix}`,
    pairId,
    image,
    isFlipped: false,
    isMatched: false,
  };
};

/** Creates the initial score object for both players. */
const createInitialScore = (): MemoryGameState["score"] => {
  return {
    blue: 0,
    orange: 0,
  };
};

/** Attaches card-click and exit-button events for the current game. */
const bindGameEvents = (game: MemoryGameState): void => {
  bindCardEvents(game);
  bindExitEvent(game);
};

/** Attaches click handlers to all card buttons. */
const bindCardEvents = (game: MemoryGameState): void => {
  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    bindCardClick(button, game);
  });
};

/** Attaches one card click handler. */
const bindCardClick = (button: HTMLButtonElement, game: MemoryGameState): void => {
  button.addEventListener("click", () => {
    const cardId = button.dataset.cardId;

    if (cardId) {
      handleCardClick(game, cardId);
    }
  });
};

/** Attaches the exit-button click handler. */
const bindExitEvent = (game: MemoryGameState): void => {
  field.querySelector<HTMLButtonElement>("[data-exit]")?.addEventListener("click", () => {
    showQuitDialog(field, game);
  });
};

/** Handles one card click and starts pair checking after two cards are open. */
const handleCardClick = (game: MemoryGameState, cardId: string): void => {
  if (game.lockBoard || game.isFinished) {
    return;
  }

  const card = game.cards.find((item) => item.id === cardId);

  if (!card || card.isFlipped || card.isMatched) {
    return;
  }

  flipCard(game, card);
};

/** Flips one card and checks the pair when two cards are open. */
const flipCard = (game: MemoryGameState, card: MemoryCard): void => {
  card.isFlipped = true;
  game.flippedIds.push(card.id);
  updateGameUi(field, game);

  if (game.flippedIds.length < CARDS_PER_PAIR) {
    return;
  }

  game.lockBoard = true;
  checkFlippedCards(game);
};

/** Compares the two currently flipped cards and routes missing cards to reset. */
const checkFlippedCards = (game: MemoryGameState): void => {
  const [firstCard, secondCard] = getFlippedCards(game);

  if (!firstCard || !secondCard) {
    resetFlippedCards(game);
    return;
  }

  handleCheckedCards(game, firstCard, secondCard);
};

/** Routes a checked pair to match or mismatch handling. */
const handleCheckedCards = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  if (firstCard.pairId === secondCard.pairId) {
    handleMatch(game, firstCard, secondCard);
    return;
  }

  handleMismatch(game, firstCard, secondCard);
};

/** Returns the currently flipped cards from the game state. */
const getFlippedCards = (game: MemoryGameState): Array<MemoryCard | undefined> => {
  return game.flippedIds.map((id) => game.cards.find((item) => item.id === id));
};

/** Clears flipped-card tracking, unlocks the board, and refreshes the UI. */
const resetFlippedCards = (game: MemoryGameState): void => {
  game.flippedIds = [];
  game.lockBoard = false;
  updateGameUi(field, game);
};

/** Marks a pair as matched, awards points, and finishes the game when all pairs are found. */
const handleMatch = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  window.setTimeout(() => {
    completeMatch(game, firstCard, secondCard);
  }, MATCH_DELAY_MS);
};

/** Completes the state updates for one matching pair. */
const completeMatch = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  markCardsAsMatched(firstCard, secondCard);
  game.score[game.currentPlayer] += MATCH_SCORE;
  resetFlippedCards(game);
  finishGameWhenComplete(game);
};

/** Marks both cards of a found pair as matched. */
const markCardsAsMatched = (firstCard: MemoryCard, secondCard: MemoryCard): void => {
  firstCard.isMatched = true;
  secondCard.isMatched = true;
};

/** Shows the winner screen when every card has been matched. */
const finishGameWhenComplete = (game: MemoryGameState): void => {
  if (!game.cards.every((item) => item.isMatched)) {
    return;
  }

  game.isFinished = true;
  window.setTimeout(() => renderGameOver(field, game, true), WINNER_SCREEN_DELAY_MS);
};

/** Turns non-matching cards back over and passes the turn to the other player. */
const handleMismatch = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  window.setTimeout(() => {
    completeMismatch(game, firstCard, secondCard);
  }, MISMATCH_DELAY_MS);
};

/** Completes the state updates for one non-matching pair. */
const completeMismatch = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  firstCard.isFlipped = false;
  secondCard.isFlipped = false;
  game.flippedIds = [];
  game.currentPlayer = NEXT_PLAYER[game.currentPlayer];
  game.lockBoard = false;
  updateGameUi(field, game);
};