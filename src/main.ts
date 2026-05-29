import "./styles/style.scss";

type ThemeKey = "code-vibes" | "gaming" | "foods";
type PlayerKey = "blue" | "orange";
type BoardSize = 16 | 24 | 36;

type SettingsState = {
  theme: ThemeKey | null;
  player: PlayerKey | null;
  boardSize: BoardSize | null;
};

type CompleteSettings = {
  theme: ThemeKey;
  player: PlayerKey;
  boardSize: BoardSize;
  startedAt: number;
};

type CodeVibesCard = {
  id: string;
  pairId: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type CodeVibesGameState = {
  settings: CompleteSettings;
  cards: CodeVibesCard[];
  currentPlayer: PlayerKey;
  score: Record<PlayerKey, number>;
  flippedIds: string[];
  lockBoard: boolean;
  isFinished: boolean;
};

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" wurde nicht gefunden.`);
  }

  return element;
}

const field = getRequiredElement<HTMLElement>("#field");
const playButton = getRequiredElement<HTMLButtonElement>("[data-play-button]");

const asset = (path: string): string => {
  return `${import.meta.env.BASE_URL}${path
    .replace(/^\/+/, "")
    .replace(/^public\//, "")}`;
};

const startAssets = {
  controller: asset("assets/base-themes/stadia_controller.png"),
  playButton: asset("assets/base-themes/play_button.png"),
  playButtonHover: asset("assets/base-themes/play_button_hover.png"),
} as const;

const settingsAssets = {
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

const themeOptions: Record<ThemeKey, { label: string; previewImage: string }> = {
  "code-vibes": {
    label: "Code vibes theme",
    previewImage: asset("assets/dev-themes/Property 1=IT logos.png"),
  },
  gaming: {
    label: "Gaming theme",
    previewImage: asset("assets/game-themes/Property 1=gameing.png"),
  },
  foods: {
    label: "Foods theme",
    previewImage: asset("assets/food-themes/Property 1=foods.png"),
  },
};

const codeVibesAssets = {
  cardBack: asset("assets/dev-themes/code-vibes/card-back.png"),
  cardBackHover: asset("assets/dev-themes/code-vibes/card-back-hover.png"),

  blueToken: asset("assets/dev-themes/code-vibes/blue-token.png"),
  orangeToken: asset("assets/dev-themes/code-vibes/orange-token.png"),

  exitIcon: asset("assets/dev-themes/code-vibes/exit-icon.png"),
  exitIconHover: asset("assets/dev-themes/code-vibes/exit-icon-hover.png"),

  blueWinner: asset("assets/dev-themes/code-vibes/blue-winner.png"),
  orangeWinner: asset("assets/dev-themes/code-vibes/orange-winner.png"),

  confetti: asset("assets/dev-themes/code-vibes/confetti.png"),
} as const;

const codeVibesCardFronts = Array.from({ length: 18 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return asset(`assets/dev-themes/code-vibes/cards/code-logo-${number}.png`);
});

const state: SettingsState = {
  theme: null,
  player: null,
  boardSize: null,
};

let hoveredTheme: ThemeKey | null = null;

initStartScreen();

function initStartScreen(): void {
  const controller = document.querySelector<HTMLImageElement>("[data-controller]");

  if (controller) {
    controller.src = startAssets.controller;
  }

  document.documentElement.style.setProperty(
    "--play-button-image",
    `url("${startAssets.playButton}")`,
  );

  document.documentElement.style.setProperty(
    "--play-button-hover-image",
    `url("${startAssets.playButtonHover}")`,
  );

  preloadImage(startAssets.controller);
  preloadImage(startAssets.playButton);
  preloadImage(startAssets.playButtonHover);

  playButton.addEventListener("pointerenter", () => {
    playButton.classList.add("is-hovered");
  });

  playButton.addEventListener("pointerleave", () => {
    playButton.classList.remove("is-hovered");
  });

  playButton.addEventListener("focus", () => {
    playButton.classList.add("is-hovered");
  });

  playButton.addEventListener("blur", () => {
    playButton.classList.remove("is-hovered");
  });

  playButton.addEventListener("click", () => {
    renderSettingsScreen();
  });
}

function renderSettingsScreen(): void {
  field.className = "settings-screen";
  field.setAttribute("aria-label", "Settings");

  field.style.setProperty(
    "--settings-start-button-image",
    `url("${settingsAssets.startButton}")`,
  );

  field.style.setProperty(
    "--settings-start-button-hover-image",
    `url("${settingsAssets.startButtonHover}")`,
  );

  field.style.setProperty(
    "--settings-start-button-disabled-image",
    `url("${settingsAssets.startButtonDisabled}")`,
  );

  field.style.setProperty(
    "--settings-title-line-image",
    `url("${settingsAssets.titleLine}")`,
  );

  field.style.setProperty(
    "--settings-theme-hover-line-image",
    `url("${settingsAssets.themeHoverLine}")`,
  );

  field.style.setProperty(
    "--settings-summary-line-empty-image",
    `url("${settingsAssets.summaryLineEmpty}")`,
  );

  field.style.setProperty(
    "--settings-summary-line-selected-image",
    `url("${settingsAssets.summaryLineSelected}")`,
  );

  preloadSettingsAssets();

  field.innerHTML = `
    <div class="settings-screen__inner">
      <section class="settings-screen__left" aria-label="Game settings">
        <h1 class="settings-screen__title">Settings</h1>

        <div class="settings-screen__groups">
          <fieldset class="settings-group settings-group--themes">
            <legend>
              <img
                class="settings-group__icon settings-group__icon--themes"
                src="${settingsAssets.icons.themes}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Game themes</span>
            </legend>

            ${renderRadio("theme", "code-vibes", "Code vibes theme", state.theme === "code-vibes")}
            ${renderRadio("theme", "gaming", "Gaming theme", state.theme === "gaming")}
            ${renderRadio("theme", "foods", "Foods theme", state.theme === "foods")}
          </fieldset>

          <fieldset class="settings-group settings-group--player">
            <legend>
              <img
                class="settings-group__icon settings-group__icon--player"
                src="${settingsAssets.icons.player}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Choose player</span>
            </legend>

            ${renderRadio("player", "blue", "Blue", state.player === "blue")}
            ${renderRadio("player", "orange", "Orange", state.player === "orange")}
          </fieldset>

          <fieldset class="settings-group settings-group--board">
            <legend>
              <img
                class="settings-group__icon settings-group__icon--board"
                src="${settingsAssets.icons.board}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Board size</span>
            </legend>

            ${renderRadio("boardSize", "16", "16 cards", state.boardSize === 16)}
            ${renderRadio("boardSize", "24", "24 cards", state.boardSize === 24)}
            ${renderRadio("boardSize", "36", "36 cards", state.boardSize === 36)}
          </fieldset>
        </div>
      </section>

      <section class="settings-screen__right" aria-label="Theme preview">
        <div class="theme-preview" data-theme-preview>
          <img class="theme-preview__image" data-theme-preview-image alt="" draggable="false" />
        </div>

        <div class="settings-summary" aria-label="Selected settings">
          <span class="settings-summary__item" data-summary-theme>Game theme</span>

          <span
            class="settings-summary__divider"
            data-summary-divider-theme
            aria-hidden="true"
          ></span>

          <span class="settings-summary__item" data-summary-player>Player</span>

          <span
            class="settings-summary__divider"
            data-summary-divider-player
            aria-hidden="true"
          ></span>

          <span class="settings-summary__item" data-summary-board>Board size</span>

          <button class="settings-summary__start" data-settings-start type="button" disabled>
            <span class="visually-hidden">Start</span>
          </button>
        </div>
      </section>
    </div>
  `;

  bindSettingsEvents();
  updateSettingsUi();
}

function renderRadio(
  name: "theme" | "player" | "boardSize",
  value: string,
  label: string,
  checked = false,
): string {
  return `
    <label class="settings-radio" data-radio-name="${name}">
      <input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""} />
      <span class="settings-radio__text">${label}</span>
    </label>
  `;
}

function bindSettingsEvents(): void {
  const themeInputs = field.querySelectorAll<HTMLInputElement>('input[name="theme"]');
  const themeLabels = field.querySelectorAll<HTMLLabelElement>(
    ".settings-group--themes .settings-radio",
  );

  const playerInputs = field.querySelectorAll<HTMLInputElement>('input[name="player"]');
  const boardInputs = field.querySelectorAll<HTMLInputElement>('input[name="boardSize"]');
  const settingsStartButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  themeLabels.forEach((label) => {
    const input = label.querySelector<HTMLInputElement>('input[name="theme"]');

    if (!input) {
      return;
    }

    const themeValue = input.value as ThemeKey;

    label.addEventListener("pointerenter", () => {
      hoveredTheme = themeValue;
      updateSettingsUi();
    });

    label.addEventListener("pointerleave", () => {
      hoveredTheme = null;
      updateSettingsUi();
    });

    label.addEventListener("focusin", () => {
      hoveredTheme = themeValue;
      updateSettingsUi();
    });

    label.addEventListener("focusout", () => {
      hoveredTheme = null;
      updateSettingsUi();
    });
  });

  themeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.theme = input.value as ThemeKey;
      hoveredTheme = null;
      updateSettingsUi();
    });
  });

  playerInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.player = input.value as PlayerKey;
      updateSettingsUi();
    });
  });

  boardInputs.forEach((input) => {
    input.addEventListener("change", () => {
      state.boardSize = Number(input.value) as BoardSize;
      updateSettingsUi();
    });
  });

  settingsStartButton?.addEventListener("click", () => {
    if (!state.theme || !state.player || !state.boardSize) {
      return;
    }

    const selectedSettings: CompleteSettings = {
      theme: state.theme,
      player: state.player,
      boardSize: state.boardSize,
      startedAt: Date.now(),
    };

    window.dispatchEvent(
      new CustomEvent("game:settings-start", {
        detail: selectedSettings,
      }),
    );

    if (selectedSettings.theme === "code-vibes") {
      renderCodeVibesGame(selectedSettings);
      return;
    }

    console.log("Für dieses Theme gibt es noch keinen Game-Screen:", selectedSettings);
  });
}

function updateSettingsUi(): void {
  const preview = field.querySelector<HTMLElement>("[data-theme-preview]");
  const previewImage = field.querySelector<HTMLImageElement>("[data-theme-preview-image]");
  const summaryTheme = field.querySelector<HTMLElement>("[data-summary-theme]");
  const summaryPlayer = field.querySelector<HTMLElement>("[data-summary-player]");
  const summaryBoard = field.querySelector<HTMLElement>("[data-summary-board]");
  const themeDivider = field.querySelector<HTMLElement>("[data-summary-divider-theme]");
  const playerDivider = field.querySelector<HTMLElement>("[data-summary-divider-player]");
  const settingsStartButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  const previewTheme: ThemeKey = hoveredTheme ?? state.theme ?? "code-vibes";
  const previewThemeData = themeOptions[previewTheme];

  if (preview && previewImage) {
    preview.dataset.placeholder = "";
    previewImage.hidden = false;
    previewImage.src = previewThemeData.previewImage;
    previewImage.alt = `${previewThemeData.label} preview`;

    previewImage.onerror = () => {
      previewImage.hidden = true;
      preview.dataset.placeholder = `${previewThemeData.label} Bild nicht gefunden`;
    };
  }

  if (summaryTheme) {
    summaryTheme.textContent = state.theme ? themeOptions[state.theme].label : "Game theme";
  }

  if (summaryPlayer) {
    summaryPlayer.textContent = state.player ? capitalize(state.player) : "Player";
  }

  if (summaryBoard) {
    summaryBoard.textContent = state.boardSize ? `${state.boardSize} cards` : "Board size";
  }

  if (themeDivider) {
    themeDivider.classList.toggle("is-selected", state.theme !== null);
  }

  if (playerDivider) {
    playerDivider.classList.toggle("is-selected", state.player !== null);
  }

  if (settingsStartButton) {
    settingsStartButton.disabled = !isSettingsComplete();
  }
}

function isSettingsComplete(): boolean {
  return Boolean(state.theme && state.player && state.boardSize);
}

function renderCodeVibesGame(settings: CompleteSettings): void {
  const game = createCodeVibesGame(settings);

  field.className = `code-vibes-game code-vibes-game--${settings.boardSize}`;
  field.setAttribute("aria-label", "Code vibes memory game");

  field.style.setProperty("--code-card-back-image", `url("${codeVibesAssets.cardBack}")`);
  field.style.setProperty("--code-card-back-hover-image", `url("${codeVibesAssets.cardBackHover}")`);

  preloadCodeVibesAssets();

  field.innerHTML = `
    <header class="code-vibes-game__topbar">
      <div class="code-vibes-scoreboard" aria-label="Score">
        ${renderCodeVibesScoreItem("blue", game.score.blue)}
        ${renderCodeVibesScoreItem("orange", game.score.orange)}
      </div>

      <div class="code-vibes-current">
        <span>Current player:</span>
        <span data-current-player>${renderCodeVibesToken(game.currentPlayer)}</span>
      </div>

      <button class="code-vibes-exit" data-code-exit type="button">
        <img
          class="code-vibes-exit__icon"
          src="${codeVibesAssets.exitIcon}"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <span>Exit game</span>
      </button>
    </header>

    <main class="code-vibes-board" aria-label="Memory cards">
      ${game.cards.map(renderCodeVibesCard).join("")}
    </main>

    <div data-code-dialog-root></div>
  `;

  bindCodeVibesGameEvents(game);
  updateCodeVibesGameUi(game);
}

function createCodeVibesGame(settings: CompleteSettings): CodeVibesGameState {
  const pairCount = settings.boardSize / 2;

  const cards = codeVibesCardFronts.slice(0, pairCount).flatMap((image, pairId) => {
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
}

function renderCodeVibesScoreItem(player: PlayerKey, score: number): string {
  return `
    <span class="code-vibes-score code-vibes-score--${player}">
      ${renderCodeVibesToken(player)}
      <span>${capitalize(player)} <strong data-score="${player}">${score}</strong></span>
    </span>
  `;
}

function renderCodeVibesToken(player: PlayerKey): string {
  const src = player === "blue" ? codeVibesAssets.blueToken : codeVibesAssets.orangeToken;

  return `
    <img
      class="code-vibes-token code-vibes-token--${player}"
      src="${src}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `;
}

function renderCodeVibesCard(card: CodeVibesCard): string {
  return `
    <button
      class="code-vibes-card"
      data-card-id="${card.id}"
      type="button"
      aria-label="Karte aufdecken"
    >
      <span class="code-vibes-card__inner">
        <span class="code-vibes-card__face code-vibes-card__face--back"></span>

        <span class="code-vibes-card__face code-vibes-card__face--front">
          <img src="${card.image}" alt="" draggable="false" />
        </span>
      </span>
    </button>
  `;
}

function bindCodeVibesGameEvents(game: CodeVibesGameState): void {
  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const cardId = button.dataset.cardId;

      if (!cardId) {
        return;
      }

      handleCodeVibesCardClick(game, cardId);
    });
  });

  const exitButton = field.querySelector<HTMLButtonElement>("[data-code-exit]");
  const exitIcon = exitButton?.querySelector<HTMLImageElement>(".code-vibes-exit__icon");

  exitButton?.addEventListener("pointerenter", () => {
    if (exitIcon) {
      exitIcon.src = codeVibesAssets.exitIconHover;
    }
  });

  exitButton?.addEventListener("pointerleave", () => {
    if (exitIcon) {
      exitIcon.src = codeVibesAssets.exitIcon;
    }
  });

  exitButton?.addEventListener("click", () => {
    showCodeVibesQuitDialog(game);
  });
}

function handleCodeVibesCardClick(game: CodeVibesGameState, cardId: string): void {
  if (game.lockBoard || game.isFinished) {
    return;
  }

  const card = game.cards.find((item) => item.id === cardId);

  if (!card || card.isFlipped || card.isMatched) {
    return;
  }

  card.isFlipped = true;
  game.flippedIds.push(card.id);

  updateCodeVibesGameUi(game);

  if (game.flippedIds.length < 2) {
    return;
  }

  game.lockBoard = true;

  const [firstId, secondId] = game.flippedIds;
  const firstCard = game.cards.find((item) => item.id === firstId);
  const secondCard = game.cards.find((item) => item.id === secondId);

  if (!firstCard || !secondCard) {
    game.flippedIds = [];
    game.lockBoard = false;
    updateCodeVibesGameUi(game);
    return;
  }

  const isMatch = firstCard.pairId === secondCard.pairId;

  if (isMatch) {
    window.setTimeout(() => {
      firstCard.isMatched = true;
      secondCard.isMatched = true;

      game.score[game.currentPlayer] += 2;
      game.flippedIds = [];
      game.lockBoard = false;

      updateCodeVibesGameUi(game);

      if (game.cards.every((item) => item.isMatched)) {
        game.isFinished = true;

        window.setTimeout(() => {
          renderCodeVibesGameOver(game, true);
        }, 650);
      }
    }, 350);

    return;
  }

  window.setTimeout(() => {
    firstCard.isFlipped = false;
    secondCard.isFlipped = false;

    game.flippedIds = [];
    game.currentPlayer = game.currentPlayer === "blue" ? "orange" : "blue";
    game.lockBoard = false;

    updateCodeVibesGameUi(game);
  }, 850);
}

function updateCodeVibesGameUi(game: CodeVibesGameState): void {
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
    currentPlayer.innerHTML = renderCodeVibesToken(game.currentPlayer);
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
}

function showCodeVibesQuitDialog(game: CodeVibesGameState): void {
  const dialogRoot = field.querySelector<HTMLElement>("[data-code-dialog-root]");

  if (!dialogRoot) {
    return;
  }

  dialogRoot.innerHTML = `
    <div class="code-vibes-modal" role="dialog" aria-modal="true" aria-label="Exit game confirmation">
      <div class="code-vibes-modal__panel">
        <h2>Are you sure you want to quit<br />the game?</h2>

        <div class="code-vibes-modal__actions">
          <button class="code-vibes-modal__button code-vibes-modal__button--filled" data-code-back type="button">
            Back to game
          </button>

          <button class="code-vibes-modal__button code-vibes-modal__button--ghost" data-code-quit-confirm type="button">
            Exit game
          </button>
        </div>
      </div>
    </div>
  `;

  dialogRoot.querySelector<HTMLButtonElement>("[data-code-back]")?.addEventListener("click", () => {
    dialogRoot.innerHTML = "";
  });

  dialogRoot
    .querySelector<HTMLButtonElement>("[data-code-quit-confirm]")
    ?.addEventListener("click", () => {
      renderCodeVibesGameOver(game, true);
    });
}

function renderCodeVibesGameOver(game: CodeVibesGameState, showWinnerAfterDelay = false): void {
  field.className = "code-vibes-game-over";
  field.setAttribute("aria-label", "Game over");

  field.innerHTML = `
    <section class="code-vibes-game-over__content">
      <h1>Game over</h1>

      <p>Final score</p>

      <div class="code-vibes-game-over__score">
        ${renderCodeVibesScoreItem("blue", game.score.blue)}
        ${renderCodeVibesScoreItem("orange", game.score.orange)}
      </div>
    </section>
  `;

  if (showWinnerAfterDelay) {
    window.setTimeout(() => {
      renderCodeVibesWinner(game);
    }, 1800);
  }
}

function renderCodeVibesWinner(game: CodeVibesGameState): void {
  const winner = getCodeVibesWinner(game);
  const winnerClass = winner ?? "draw";
  const winnerText = winner ? `${winner.toUpperCase()} PLAYER` : "DRAW";
  const winnerImage =
    winner === "blue"
      ? codeVibesAssets.blueWinner
      : winner === "orange"
        ? codeVibesAssets.orangeWinner
        : "";

  field.className = `code-vibes-winner code-vibes-winner--${winnerClass}`;
  field.setAttribute("aria-label", "Winner");

  field.innerHTML = `
    <img
      class="code-vibes-winner__confetti"
      src="${codeVibesAssets.confetti}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />

    <section class="code-vibes-winner__content">
      <p>The winner is</p>

      <h1>${winnerText}</h1>

      ${
        winnerImage
          ? `
            <img
              class="code-vibes-winner__icon"
              src="${winnerImage}"
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          `
          : `<div class="code-vibes-winner__draw-icon">=</div>`
      }

      <button class="code-vibes-winner__back" data-code-back-start type="button">
        Back to start
      </button>
    </section>
  `;

  field.querySelector<HTMLButtonElement>("[data-code-back-start]")?.addEventListener("click", () => {
    window.location.reload();
  });
}

function getCodeVibesWinner(game: CodeVibesGameState): PlayerKey | null {
  if (game.score.blue > game.score.orange) {
    return "blue";
  }

  if (game.score.orange > game.score.blue) {
    return "orange";
  }

  return null;
}

function preloadSettingsAssets(): void {
  [
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
    ...Object.values(themeOptions).map((theme) => theme.previewImage),
  ].forEach(preloadImage);
}

function preloadCodeVibesAssets(): void {
  [
    codeVibesAssets.cardBack,
    codeVibesAssets.cardBackHover,
    codeVibesAssets.blueToken,
    codeVibesAssets.orangeToken,
    codeVibesAssets.exitIcon,
    codeVibesAssets.exitIconHover,
    codeVibesAssets.blueWinner,
    codeVibesAssets.orangeWinner,
    codeVibesAssets.confetti,
    ...codeVibesCardFronts,
  ].forEach(preloadImage);
}

function preloadImage(src: string): void {
  const image = new Image();
  image.src = src;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function shuffleArray<T>(items: T[]): T[] {
  const array = [...items];

  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }

  return array;
}