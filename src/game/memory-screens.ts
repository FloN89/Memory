import { renderScoreItem } from "./memory-render";
import { renderSettingsScreen } from "./settings-screen";
import type { MemoryGameState, PlayerKey } from "./types";

type WinnerKey = PlayerKey | "draw";

/** Determines which player won, or returns draw when both scores are equal. */
const getWinner = (game: MemoryGameState): WinnerKey => {
  if (game.score.blue > game.score.orange) {
    return "blue";
  }

  if (game.score.orange > game.score.blue) {
    return "orange";
  }

  return "draw";
};

/** Returns the image URL that should be shown on the winner screen. */
const getWinnerImage = (game: MemoryGameState, winner: WinnerKey): string | null => {
  if (winner === "blue") {
    return game.theme.blueWinner;
  }

  if (winner === "orange") {
    return game.theme.orangeWinner;
  }

  return game.theme.drawWinner ?? null;
};

/** Builds the headline text for the winner screen. */
const getWinnerTitle = (winner: WinnerKey): string => {
  if (winner === "draw") {
    return "Draw";
  }

  return `${winner.charAt(0).toUpperCase()}${winner.slice(1)} wins`;
};

/** Opens a confirmation dialog that lets the player continue or quit the current game. */
export const showQuitDialog = (field: HTMLElement, game: MemoryGameState): void => {
  const dialogRoot = field.querySelector<HTMLElement>("[data-dialog-root]");

  if (!dialogRoot) {
    return;
  }

  dialogRoot.innerHTML = `
    <div class="memory-modal" role="dialog" aria-modal="true" aria-labelledby="quit-dialog-title">
      <div class="memory-modal__panel">
        <h2 id="quit-dialog-title">Do you want to quit the game?</h2>

        <div class="memory-modal__actions">
          <button
            class="memory-modal__image-button memory-modal__image-button--back"
            data-dialog-back
            type="button"
            aria-label="Back to game"
          >
            <span class="visually-hidden">Back to game</span>
          </button>

          <button
            class="memory-modal__image-button memory-modal__image-button--exit"
            data-dialog-exit
            type="button"
            aria-label="Exit game"
          >
            <span class="visually-hidden">Exit game</span>
          </button>
        </div>
      </div>
    </div>
  `;

  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-back]")?.focus();

  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-back]")?.addEventListener("click", () => {
    dialogRoot.innerHTML = "";
  });

  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-exit]")?.addEventListener("click", () => {
    renderGameOver(field, game, false);
  });
};

/** Renders the final game-over screen and optionally continues to the winner screen. */
export const renderGameOver = (
  field: HTMLElement,
  game: MemoryGameState,
  showWinnerAfterDelay: boolean,
): void => {
  field.className = `memory-game-over ${game.theme.className}`;
  field.setAttribute("aria-label", "Game over");

  field.innerHTML = `
    <div class="memory-game-over__content">
      <h1>Game over</h1>
      <p>Final score</p>
      <div class="memory-game-over__score" aria-label="Final score">
        ${renderScoreItem(game.theme, "orange", game.score.orange)}
        ${renderScoreItem(game.theme, "blue", game.score.blue)}
      </div>
    </div>
  `;

  if (showWinnerAfterDelay) {
    window.setTimeout(() => {
      renderWinnerScreen(field, game);
    }, 900);
  }
};

/** Renders the winner screen after all cards have been matched. */
const renderWinnerScreen = (field: HTMLElement, game: MemoryGameState): void => {
  const winner = getWinner(game);
  const winnerImage = getWinnerImage(game, winner);

  field.className = `memory-winner memory-winner--${winner} ${game.theme.className}`;
  field.setAttribute("aria-label", "Winner screen");

  field.innerHTML = `
    ${game.theme.confetti ? `
      <img
        class="memory-winner__confetti"
        src="${game.theme.confetti}"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    ` : ""}

    <div class="memory-winner__content">
      <p>Winner</p>
      <h1>${getWinnerTitle(winner)}</h1>

      ${winnerImage ? `
        <img
          class="memory-winner__icon"
          src="${winnerImage}"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
      ` : `
        <span class="memory-winner__draw-icon" aria-hidden="true">=</span>
      `}

      <button class="memory-winner__back" data-winner-back type="button">
        Back to settings
      </button>
    </div>
  `;

  field.querySelector<HTMLButtonElement>("[data-winner-back]")?.addEventListener("click", () => {
    renderSettingsScreen(field);
  });
};