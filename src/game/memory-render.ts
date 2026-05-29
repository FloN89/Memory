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
      <span class="memory-card__inner">
        <span class="memory-card__face memory-card__face--back"></span>

        <span class="memory-card__face memory-card__face--front">
          <img src="${card.image}" alt="" draggable="false" />
        </span>
      </span>
    </button>
  `;
};

/** Synchronizes score, current player, and card states with the current game state. */
export const updateGameUi = (
  field: HTMLElement,
  game: MemoryGameState,
): void => {
  const blueScore = field.querySelector<HTMLElement>('[data-score="blue"]');
  const orangeScore = field.querySelector<HTMLElement>('[data-score="orange"]');
  const currentPlayer = field.querySelector<HTMLElement>("[data-current-player]");

  if (blueScore) {
    blueScore.textContent = String(game.score.blue);
  }

  if (orangeScore) {
    orangeScore.textContent = String(game.score.orange);
  }

  if (currentPlayer) {
    currentPlayer.innerHTML = renderToken(game.theme, game.currentPlayer);
  }

  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    const card = game.cards.find((item) => item.id === button.dataset.cardId);

    if (!card) {
      return;
    }

    button.classList.toggle("is-flipped", card.isFlipped || card.isMatched);
    button.classList.toggle("is-matched", card.isMatched);
    button.disabled = game.lockBoard || card.isFlipped || card.isMatched;
  });
};