import { renderCard, renderScoreItem, renderToken, updateGameUi } from "./memory-render";
import { renderGameOver, showQuitDialog } from "./memory-screens";
import { preloadThemeAssets, themeConfigs } from "./themes";
import type {
  CompleteSettings,
  MemoryCard,
  MemoryGameState,
  ThemeConfig,
} from "./types";
import { setCssImage, shuffleArray } from "./utils";

let field: HTMLElement;

/** Renders a new memory game with the chosen settings and binds its event handlers. */
export const renderMemoryGame = (
  root: HTMLElement,
  settings: CompleteSettings,
): void => {
  field = root;

  const theme = themeConfigs[settings.theme];
  const game = createMemoryGame(settings, theme);

  field.className = `memory-game memory-game--${settings.boardSize} ${theme.className}`;
  field.setAttribute("aria-label", `${theme.label} memory game`);

  setGameCssImages(theme);
  preloadThemeAssets(theme, settings.boardSize);

  field.innerHTML = `
    <header class="memory-game__topbar">
      <div class="memory-scoreboard" aria-label="Score">
        ${renderScoreItem(theme, "orange", game.score.orange)}
        ${renderScoreItem(theme, "blue", game.score.blue)}
      </div>

      <div class="memory-current">
        <span>Current player:</span>
        <span data-current-player>${renderToken(theme, game.currentPlayer)}</span>
      </div>

      <button class="memory-exit" data-exit type="button">
        <span class="visually-hidden">Exit game</span>
      </button>
    </header>

    <main class="memory-board" aria-label="Memory cards">
      ${game.cards.map(renderCard).join("")}
    </main>

    <div data-dialog-root></div>
  `;

  bindGameEvents(game);
  updateGameUi(field, game);
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
  const pairCount = settings.boardSize / 2;
  const fronts = theme.cardFronts.slice(0, pairCount);

  if (fronts.length < pairCount) {
    throw new Error(`${theme.label} braucht mindestens ${pairCount} Kartenbilder.`);
  }

  const cards = fronts.flatMap((image, pairId) => {
    return [
      {
        id: `${pairId}-a`,
        pairId,
        image,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${pairId}-b`,
        pairId,
        image,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return {
    settings,
    theme,
    cards: shuffleArray(cards),
    currentPlayer: settings.player,
    score: {
      blue: 0,
      orange: 0,
    },
    flippedIds: [],
    lockBoard: false,
    isFinished: false,
  };
};

/** Attaches card-click and exit-button events for the current game. */
const bindGameEvents = (game: MemoryGameState): void => {
  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const cardId = button.dataset.cardId;

      if (cardId) {
        handleCardClick(game, cardId);
      }
    });
  });

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

  card.isFlipped = true;
  game.flippedIds.push(card.id);
  updateGameUi(field, game);

  if (game.flippedIds.length < 2) {
    return;
  }

  game.lockBoard = true;
  checkFlippedCards(game);
};

/** Compares the two currently flipped cards and routes to match or mismatch handling. */
const checkFlippedCards = (game: MemoryGameState): void => {
  const [firstId, secondId] = game.flippedIds;
  const firstCard = game.cards.find((item) => item.id === firstId);
  const secondCard = game.cards.find((item) => item.id === secondId);

  if (!firstCard || !secondCard) {
    resetFlippedCards(game);
    return;
  }

  if (firstCard.pairId === secondCard.pairId) {
    handleMatch(game, firstCard, secondCard);
    return;
  }

  handleMismatch(game, firstCard, secondCard);
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
    firstCard.isMatched = true;
    secondCard.isMatched = true;

    game.score[game.currentPlayer] += 2;
    resetFlippedCards(game);

    if (game.cards.every((item) => item.isMatched)) {
      game.isFinished = true;

      window.setTimeout(() => {
        renderGameOver(field, game, true);
      }, 650);
    }
  }, 350);
};

/** Turns non-matching cards back over and passes the turn to the other player. */
const handleMismatch = (
  game: MemoryGameState,
  firstCard: MemoryCard,
  secondCard: MemoryCard,
): void => {
  window.setTimeout(() => {
    firstCard.isFlipped = false;
    secondCard.isFlipped = false;

    game.flippedIds = [];
    game.currentPlayer = game.currentPlayer === "blue" ? "orange" : "blue";
    game.lockBoard = false;

    updateGameUi(field, game);
  }, 850);
};