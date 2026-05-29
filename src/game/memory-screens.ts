import { renderScoreItem } from "./memory-render";
import { renderSettingsScreen } from "./settings-screen";
import type { MemoryGameState, PlayerKey } from "./types";

type WinnerKey = PlayerKey | "draw";

const GAME_OVER_TO_SETTINGS_DELAY_MS = 1200;

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

/** Builds the label shown above the winner headline. */
const getWinnerEyebrow = (winner: WinnerKey): string => {
  return winner === "draw" ? "The game ended in" : "The winner is";
};

/** Builds the headline text for the winner screen. */
const getWinnerTitle = (winner: WinnerKey): string => {
  if (winner === "draw") {
    return "DRAW";
  }

  return `${winner.toUpperCase()} PLAYER`;
};

/** Normalizes one or multiple confetti images from the active theme. */
const getConfettiImages = (game: MemoryGameState): string[] => {
  if (!game.theme.confetti) {
    return [];
  }

  return Array.isArray(game.theme.confetti)
    ? game.theme.confetti
    : [game.theme.confetti];
};

/** Renders the decorative confetti images for the winner screen. */
const renderConfetti = (sources: string[]): string => {
  if (sources.length === 0) {
    return "";
  }

  return `
    <div class="memory-winner__confetti-layer" aria-hidden="true">
      ${sources.map(renderConfettiImage).join("")}
    </div>
  `;
};

/** Renders one decorative confetti image. */
const renderConfettiImage = (source: string, index: number): string => {
  return `
    <img
      class="memory-winner__confetti memory-winner__confetti--${index + 1}"
      src="${source}"
      alt=""
      draggable="false"
    />
  `;
};

/** Opens a confirmation dialog that lets the player continue or quit the current game. */
export const showQuitDialog = (field: HTMLElement, game: MemoryGameState): void => {
  const dialogRoot = field.querySelector<HTMLElement>("[data-dialog-root]");

  if (!dialogRoot) {
    return;
  }

  dialogRoot.innerHTML = renderQuitDialog();
  bindQuitDialogEvents(dialogRoot, field, game);
};

/** Renders the complete quit dialog. */
const renderQuitDialog = (): string => {
  return `
    <div class="memory-modal" role="dialog" aria-modal="true" aria-labelledby="quit-dialog-title">
      <div class="memory-modal__panel">
        <h2 id="quit-dialog-title">Do you want to quit the game?</h2>
        ${renderQuitDialogActions()}
      </div>
    </div>
  `;
};

/** Renders the quit dialog action buttons. */
const renderQuitDialogActions = (): string => {
  return `
    <div class="memory-modal__actions">
      ${renderDialogButton("back", "Back to game", "data-dialog-back")}
      ${renderDialogButton("exit", "Exit game", "data-dialog-exit")}
    </div>
  `;
};

/** Renders one image button for the quit dialog. */
const renderDialogButton = (
  modifier: string,
  label: string,
  attribute: string,
): string => {
  return `
    <button
      class="memory-modal__image-button memory-modal__image-button--${modifier}"
      ${attribute}
      type="button"
      aria-label="${label}"
    >
      <span class="visually-hidden">${label}</span>
    </button>
  `;
};

/** Attaches all quit dialog interactions. */
const bindQuitDialogEvents = (
  dialogRoot: HTMLElement,
  field: HTMLElement,
  game: MemoryGameState,
): void => {
  focusBackButton(dialogRoot);
  bindBackToGameEvent(dialogRoot);
  bindExitGameEvent(dialogRoot, field, game);
};

/** Focuses the back button when the dialog opens. */
const focusBackButton = (dialogRoot: HTMLElement): void => {
  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-back]")?.focus();
};

/** Closes the dialog and returns to the current game. */
const bindBackToGameEvent = (dialogRoot: HTMLElement): void => {
  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-back]")?.addEventListener("click", () => {
    dialogRoot.innerHTML = "";
  });
};

/** Ends the current game from the quit dialog. */
const bindExitGameEvent = (
  dialogRoot: HTMLElement,
  field: HTMLElement,
  game: MemoryGameState,
): void => {
  dialogRoot.querySelector<HTMLButtonElement>("[data-dialog-exit]")?.addEventListener("click", () => {
    renderGameOver(field, game, false);
  });
};

/** Renders game-over after quitting, or directly renders winner after a completed game. */
export const renderGameOver = (
  field: HTMLElement,
  game: MemoryGameState,
  showWinnerAfterDelay: boolean,
): void => {
  if (showWinnerAfterDelay) {
    renderWinnerScreen(field, game);
    return;
  }

  renderQuitGameOver(field, game);
};

/** Renders the game-over screen after manually quitting. */
const renderQuitGameOver = (field: HTMLElement, game: MemoryGameState): void => {
  setupGameOverRoot(field, game);
  field.innerHTML = renderGameOverMarkup(game);
  window.setTimeout(() => renderSettingsScreen(field), GAME_OVER_TO_SETTINGS_DELAY_MS);
};

/** Applies the game-over root class and accessibility label. */
const setupGameOverRoot = (field: HTMLElement, game: MemoryGameState): void => {
  field.className = `memory-game-over ${game.theme.className}`;
  field.setAttribute("aria-label", "Game over");
};

/** Renders the complete game-over markup. */
const renderGameOverMarkup = (game: MemoryGameState): string => {
  return `
    <div class="memory-game-over__content">
      <h1>Game over</h1>
      <p>Final score</p>
      ${renderFinalScore(game)}
    </div>
  `;
};

/** Renders the final score for both players. */
const renderFinalScore = (game: MemoryGameState): string => {
  return `
    <div class="memory-game-over__score" aria-label="Final score">
      ${renderScoreItem(game.theme, "orange", game.score.orange)}
      ${renderScoreItem(game.theme, "blue", game.score.blue)}
    </div>
  `;
};

/** Renders the winner screen after all cards have been matched. */
const renderWinnerScreen = (field: HTMLElement, game: MemoryGameState): void => {
  const winner = getWinner(game);

  setupWinnerRoot(field, game, winner);
  field.innerHTML = renderWinnerMarkup(game, winner);
  bindWinnerBackEvent(field);
};

/** Applies the winner root class and accessibility label. */
const setupWinnerRoot = (
  field: HTMLElement,
  game: MemoryGameState,
  winner: WinnerKey,
): void => {
  field.className = `memory-winner memory-winner--${winner} ${game.theme.className}`;
  field.setAttribute("aria-label", "Winner screen");
};

/** Renders the complete winner screen markup. */
const renderWinnerMarkup = (game: MemoryGameState, winner: WinnerKey): string => {
  const confettiImages = winner === "draw" ? [] : getConfettiImages(game);

  return `
    ${renderConfetti(confettiImages)}
    <div class="memory-winner__content">
      <p>${getWinnerEyebrow(winner)}</p>
      <h1>${getWinnerTitle(winner)}</h1>
      ${renderWinnerVisual(game, winner)}
      ${renderWinnerBackButton()}
    </div>
  `;
};

/** Renders either winner image or draw fallback icon. */
const renderWinnerVisual = (game: MemoryGameState, winner: WinnerKey): string => {
  const winnerImage = getWinnerImage(game, winner);

  return winnerImage ? renderWinnerImage(winnerImage) : renderDrawIcon();
};

/** Renders the winner image. */
const renderWinnerImage = (winnerImage: string): string => {
  return `
    <img
      class="memory-winner__icon"
      src="${winnerImage}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `;
};

/** Renders the draw fallback icon. */
const renderDrawIcon = (): string => {
  return `<span class="memory-winner__draw-icon" aria-hidden="true">=</span>`;
};

/** Renders the back-to-settings button on the winner screen. */
const renderWinnerBackButton = (): string => {
  return `
    <button
      class="memory-winner__back"
      data-winner-back
      type="button"
      aria-label="Back to settings screen"
    >
      Back to settings
    </button>
  `;
};

/** Attaches the back-to-settings button event. */
const bindWinnerBackEvent = (field: HTMLElement): void => {
  field.querySelector<HTMLButtonElement>("[data-winner-back]")?.addEventListener("click", () => {
    renderSettingsScreen(field);
  });
};