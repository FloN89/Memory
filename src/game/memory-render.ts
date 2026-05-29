import type {
  MemoryCard,
  MemoryGameState,
  PlayerKey,
  ThemeConfig,
} from "./types";

/** Renders one player score entry with its token and score value. */
export const renderScoreItem = (
  theme: ThemeConfig,
  player: PlayerKey,
  score: number,
): string => {
  return `
    <span class="memory-score memory-score--${player}">
      ${renderToken(theme, player)}
      <strong data-score="${player}">${score}</strong>
    </span>
  `;
};

/** Renders the token image for the requested player. */
export const renderToken = (theme: ThemeConfig, player: PlayerKey): string => {
  const src = player === "blue" ? theme.blueToken : theme.orangeToken;

  return `
    <img
      class="memory-token memory-token--${player}"
      src="${src}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `;
};

/** Renders one clickable memory card with a back and front face. */
export const renderCard = (card: MemoryCard): string => {
  return `
    <button
      class="memory-card"
      data-card-id="${card.id}"
      type="button"
      aria-label="Karte aufdecken"
    >
      ${renderCardInner(card)}
    </button>
  `;
};

/** Renders the rotating card wrapper with both card sides. */
const renderCardInner = (card: MemoryCard): string => {
  return `
    <span class="memory-card__inner">
      <span class="memory-card__face memory-card__face--back"></span>
      ${renderCardFront(card)}
    </span>
  `;
};

/** Renders the front side image of one memory card. */
const renderCardFront = (card: MemoryCard): string => {
  return `
    <span class="memory-card__face memory-card__face--front">
      <img src="${card.image}" alt="" draggable="false" />
    </span>
  `;
};

/** Synchronizes score, current player, and card states with the current game state. */
export const updateGameUi = (
  field: HTMLElement,
  game: MemoryGameState,
): void => {
  updateScoreUi(field, game);
  updateCurrentPlayerUi(field, game);
  updateCardButtons(field, game);
};

/** Updates both score values in the game UI. */
const updateScoreUi = (field: HTMLElement, game: MemoryGameState): void => {
  updateText(field, '[data-score="blue"]', String(game.score.blue));
  updateText(field, '[data-score="orange"]', String(game.score.orange));
};

/** Updates a single text node when the target element exists. */
const updateText = (field: HTMLElement, selector: string, value: string): void => {
  const element = field.querySelector<HTMLElement>(selector);

  if (element) {
    element.textContent = value;
  }
};

/** Updates the current-player token in the game UI. */
const updateCurrentPlayerUi = (field: HTMLElement, game: MemoryGameState): void => {
  const currentPlayer = field.querySelector<HTMLElement>("[data-current-player]");

  if (currentPlayer) {
    currentPlayer.innerHTML = renderToken(game.theme, game.currentPlayer);
  }
};

/** Updates all card button states from the game state. */
const updateCardButtons = (field: HTMLElement, game: MemoryGameState): void => {
  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    updateCardButton(button, game);
  });
};

/** Updates one card button with flipped, matched, and disabled states. */
const updateCardButton = (
  button: HTMLButtonElement,
  game: MemoryGameState,
): void => {
  const card = game.cards.find((item) => item.id === button.dataset.cardId);

  if (!card) {
    return;
  }

  button.classList.toggle("is-flipped", card.isFlipped || card.isMatched);
  button.classList.toggle("is-matched", card.isMatched);
  button.disabled = game.lockBoard || card.isFlipped || card.isMatched;
};