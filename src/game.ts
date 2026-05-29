type ThemeKey = "code-vibes" | "gaming" | "foods";
type PlayerKey = "blue" | "orange";
type BoardSize = 16 | 24 | 36;
type SettingName = "theme" | "player" | "boardSize";

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

type MemoryCard = {
  id: string;
  pairId: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryGameState = {
  settings: CompleteSettings;
  theme: ThemeConfig;
  cards: MemoryCard[];
  currentPlayer: PlayerKey;
  score: Record<PlayerKey, number>;
  flippedIds: string[];
  lockBoard: boolean;
  isFinished: boolean;
};

type ThemeConfig = {
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
  confetti?: string;
  cardFronts: string[];
};

type ViteImportMeta = ImportMeta & {
  env?: {
    BASE_URL?: string;
  };
};

const state: SettingsState = {
  theme: null,
  player: null,
  boardSize: null,
};

let field: HTMLElement;
let hoveredTheme: ThemeKey | null = null;

const asset = (path: string): string => {
  const baseUrl = (import.meta as ViteImportMeta).env?.BASE_URL ?? "/";

  return `${baseUrl}${path
    .replace(/^\/+/, "")
    .replace(/^public\//, "")}`;
};

const numberedAssets = (
  folder: string,
  name: string,
  amount = 18,
): string[] => {
  return Array.from({ length: amount }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return asset(`${folder}/${name}-${number}.png`);
  });
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

const themeConfigs: Record<ThemeKey, ThemeConfig> = {
  "code-vibes": {
    key: "code-vibes",
    label: "Code vibes theme",
    previewImage: asset("assets/dev-themes/Property 1=IT logos.png"),
    className: "theme-code-vibes",

    cardBack: asset("assets/dev-themes/code-vibes/card-back.png"),
    cardBackHover: asset("assets/dev-themes/code-vibes/card-back-hover.png"),

    blueToken: asset("assets/dev-themes/code-vibes/blue-token.png"),
    orangeToken: asset("assets/dev-themes/code-vibes/orange-token.png"),

    exitIcon: asset("assets/dev-themes/code-vibes/exit-icon.png"),
    exitIconHover: asset("assets/dev-themes/code-vibes/exit-icon-hover.png"),

    blueWinner: asset("assets/dev-themes/code-vibes/blue-winner.png"),
    orangeWinner: asset("assets/dev-themes/code-vibes/orange-winner.png"),
    drawWinner: asset("assets/dev-themes/code-vibes/draw-winner.png"),

    confetti: asset("assets/dev-themes/code-vibes/confetti.png"),

    cardFronts: numberedAssets(
      "assets/dev-themes/code-vibes/cards",
      "code-logo",
    ),
  },

  gaming: {
    key: "gaming",
    label: "Gaming theme",
    previewImage: asset("assets/game-themes/Property 1=gameing.png"),
    className: "theme-gaming",

    cardBack: asset("assets/game-themes/gaming/card-back.png"),
    cardBackHover: asset("assets/game-themes/gaming/card-back-hover.png"),

    blueToken: asset("assets/game-themes/gaming/blue-token.png"),
    orangeToken: asset("assets/game-themes/gaming/orange-token.png"),

    exitIcon: asset("assets/game-themes/gaming/exit-icon.png"),
    exitIconHover: asset("assets/game-themes/gaming/exit-icon-hover.png"),

    blueWinner: asset("assets/game-themes/gaming/blue-winner.png"),
    orangeWinner: asset("assets/game-themes/gaming/orange-winner.png"),
    drawWinner: asset("assets/game-themes/gaming/draw-winner.png"),

    confetti: asset("assets/game-themes/gaming/confetti.png"),

    cardFronts: numberedAssets("assets/game-themes/gaming/cards", "gaming"),
  },

  foods: {
    key: "foods",
    label: "Foods theme",
    previewImage: asset("assets/food-themes/Property 1=foods.png"),
    className: "theme-foods",

    cardBack: asset("assets/food-themes/foods/card-back.png"),
    cardBackHover: asset("assets/food-themes/foods/card-back-hover.png"),

    blueToken: asset("assets/food-themes/foods/blue-token.png"),
    orangeToken: asset("assets/food-themes/foods/orange-token.png"),

    exitIcon: asset("assets/food-themes/foods/exit-icon.png"),
    exitIconHover: asset("assets/food-themes/foods/exit-icon-hover.png"),

    blueWinner: asset("assets/food-themes/foods/blue-winner.png"),
    orangeWinner: asset("assets/food-themes/foods/orange-winner.png"),
    drawWinner: asset("assets/food-themes/foods/draw-winner.png"),

    confetti: asset("assets/food-themes/foods/confetti.png"),

    cardFronts: numberedAssets("assets/food-themes/foods/cards", "food"),
  },
};

export function initMemoryApp(): void {
  field = getRequiredElement<HTMLElement>("#field");
  initStartScreen();
}

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Element "${selector}" wurde nicht gefunden.`);
  }

  return element;
}

function initStartScreen(): void {
  const playButton = getRequiredElement<HTMLButtonElement>("[data-play-button]");
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

  [
    startAssets.controller,
    startAssets.playButton,
    startAssets.playButtonHover,
  ].forEach(preloadImage);

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

  playButton.addEventListener("click", renderSettingsScreen);
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
                class="settings-group__icon"
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
                class="settings-group__icon"
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
                class="settings-group__icon"
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
          <img
            class="theme-preview__image"
            data-theme-preview-image
            alt=""
            draggable="false"
          />
        </div>

        <div class="settings-summary" aria-label="Selected settings">
          <span class="settings-summary__item" data-summary-theme>Game theme</span>
          <span class="settings-summary__divider" data-summary-divider-theme aria-hidden="true"></span>

          <span class="settings-summary__item" data-summary-player>Player</span>
          <span class="settings-summary__divider" data-summary-divider-player aria-hidden="true"></span>

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
  name: SettingName,
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
  const startButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

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

  startButton?.addEventListener("click", () => {
    if (!state.theme || !state.player || !state.boardSize) {
      return;
    }

    renderMemoryGame({
      theme: state.theme,
      player: state.player,
      boardSize: state.boardSize,
      startedAt: Date.now(),
    });
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

  const startButton = field.querySelector<HTMLButtonElement>("[data-settings-start]");

  const previewTheme = hoveredTheme ?? state.theme ?? "code-vibes";
  const previewThemeData = themeConfigs[previewTheme];

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
    summaryTheme.textContent = state.theme
      ? themeConfigs[state.theme].label
      : "Game theme";
  }

  if (summaryPlayer) {
    summaryPlayer.textContent = state.player ? capitalize(state.player) : "Player";
  }

  if (summaryBoard) {
    summaryBoard.textContent = state.boardSize
      ? `${state.boardSize} cards`
      : "Board size";
  }

  if (themeDivider) {
    themeDivider.classList.toggle("is-selected", state.theme !== null);
  }

  if (playerDivider) {
    playerDivider.classList.toggle("is-selected", state.player !== null);
  }

  if (startButton) {
    startButton.disabled = !(state.theme && state.player && state.boardSize);
  }
}

function renderMemoryGame(settings: CompleteSettings): void {
  const theme = themeConfigs[settings.theme];
  const game = createMemoryGame(settings, theme);

  field.className = `memory-game memory-game--${settings.boardSize} ${theme.className}`;
  field.setAttribute("aria-label", `${theme.label} memory game`);

  field.style.setProperty(
    "--memory-card-back-image",
    `url("${theme.cardBack}")`,
  );

  field.style.setProperty(
    "--memory-card-back-hover-image",
    `url("${theme.cardBackHover}")`,
  );

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
        <img
          class="memory-exit__icon"
          src="${theme.exitIcon}"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <span>Exit game</span>
      </button>
    </header>

    <main class="memory-board" aria-label="Memory cards">
      ${game.cards.map(renderCard).join("")}
    </main>

    <div data-dialog-root></div>
  `;

  bindGameEvents(game);
  updateGameUi(game);
}

function createMemoryGame(
  settings: CompleteSettings,
  theme: ThemeConfig,
): MemoryGameState {
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
}

function renderScoreItem(
  theme: ThemeConfig,
  player: PlayerKey,
  score: number,
): string {
  return `
    <span class="memory-score memory-score--${player}">
      ${renderToken(theme, player)}
      <strong data-score="${player}">${score}</strong>
    </span>
  `;
}

function renderToken(theme: ThemeConfig, player: PlayerKey): string {
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
}

function renderCard(card: MemoryCard): string {
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
}

function bindGameEvents(game: MemoryGameState): void {
  field.querySelectorAll<HTMLButtonElement>("[data-card-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const cardId = button.dataset.cardId;

      if (cardId) {
        handleCardClick(game, cardId);
      }
    });
  });

  const exitButton = field.querySelector<HTMLButtonElement>("[data-exit]");
  const exitIcon = exitButton?.querySelector<HTMLImageElement>(".memory-exit__icon");

  exitButton?.addEventListener("pointerenter", () => {
    if (exitIcon) {
      exitIcon.src = game.theme.exitIconHover;
    }
  });

  exitButton?.addEventListener("pointerleave", () => {
    if (exitIcon) {
      exitIcon.src = game.theme.exitIcon;
    }
  });

  exitButton?.addEventListener("click", () => {
    showQuitDialog(game);
  });
}

function handleCardClick(game: MemoryGameState, cardId: string): void {
  if (game.lockBoard || game.isFinished) {
    return;
  }

  const card = game.cards.find((item) => item.id === cardId);

  if (!card || card.isFlipped || card.isMatched) {
    return;
  }

  card.isFlipped = true;
  game.flippedIds.push(card.id);

  updateGameUi(game);

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
    updateGameUi(game);
    return;
  }

  if (firstCard.pairId === secondCard.pairId) {
    window.setTimeout(() => {
      firstCard.isMatched = true;
      secondCard.isMatched = true;

      game.score[game.currentPlayer] += 2;
      game.flippedIds = [];
      game.lockBoard = false;

      updateGameUi(game);

      if (game.cards.every((item) => item.isMatched)) {
        game.isFinished = true;

        window.setTimeout(() => {
          renderGameOver(game, true);
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

    updateGameUi(game);
  }, 850);
}

function updateGameUi(game: MemoryGameState): void {
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
}

function showQuitDialog(game: MemoryGameState): void {
  const dialogRoot = field.querySelector<HTMLElement>("[data-dialog-root]");

  if (!dialogRoot) {
    return;
  }

  dialogRoot.innerHTML = `
    <div class="memory-modal" role="dialog" aria-modal="true" aria-label="Exit game confirmation">
      <div class="memory-modal__panel">
        <h2>Are you sure you want to<br />quit the game?</h2>

        <div class="memory-modal__actions">
          <button
            class="memory-modal__button memory-modal__button--filled"
            data-back
            type="button"
          >
            No, back to game
          </button>

          <button
            class="memory-modal__button memory-modal__button--ghost"
            data-quit-confirm
            type="button"
          >
            Exit game
          </button>
        </div>
      </div>
    </div>
  `;

  dialogRoot.querySelector<HTMLButtonElement>("[data-back]")?.addEventListener("click", () => {
    dialogRoot.innerHTML = "";
  });

  dialogRoot
    .querySelector<HTMLButtonElement>("[data-quit-confirm]")
    ?.addEventListener("click", () => {
      renderGameOver(game, true);
    });
}

function renderGameOver(
  game: MemoryGameState,
  showWinnerAfterDelay = false,
): void {
  field.className = `memory-game-over ${game.theme.className}`;
  field.setAttribute("aria-label", "Game over");

  field.innerHTML = `
    <section class="memory-game-over__content">
      <h1>Game over</h1>

      <p>Final score</p>

      <div class="memory-game-over__score">
        ${renderScoreItem(game.theme, "orange", game.score.orange)}
        ${renderScoreItem(game.theme, "blue", game.score.blue)}
      </div>
    </section>
  `;

  if (showWinnerAfterDelay) {
    window.setTimeout(() => {
      renderWinner(game);
    }, 1800);
  }
}

function renderWinner(game: MemoryGameState): void {
  const winner = getWinner(game);
  const winnerClass = winner ?? "draw";
  const title = winner ? `${capitalize(winner)} Player` : "Draw";
  const winnerImage = getWinnerImage(game.theme, winner);

  field.className = `memory-winner memory-winner--${winnerClass} ${game.theme.className}`;
  field.setAttribute("aria-label", "Winner");

  field.innerHTML = `
    ${
      game.theme.confetti
        ? `
          <img
            class="memory-winner__confetti"
            src="${game.theme.confetti}"
            alt=""
            aria-hidden="true"
            draggable="false"
          />
        `
        : ""
    }

    <section class="memory-winner__content">
      <p>${winner ? "The winner is" : "It's a"}</p>

      <h1>${title}</h1>

      ${
        winnerImage
          ? `
            <img
              class="memory-winner__icon"
              src="${winnerImage}"
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          `
          : `<div class="memory-winner__draw-icon">=</div>`
      }

      <button class="memory-winner__back" data-home type="button">
        Home
      </button>
    </section>
  `;

  field.querySelector<HTMLButtonElement>("[data-home]")?.addEventListener("click", () => {
    window.location.reload();
  });
}

function getWinner(game: MemoryGameState): PlayerKey | null {
  if (game.score.blue > game.score.orange) {
    return "blue";
  }

  if (game.score.orange > game.score.blue) {
    return "orange";
  }

  return null;
}

function getWinnerImage(
  theme: ThemeConfig,
  winner: PlayerKey | null,
): string | null {
  if (winner === "blue") {
    return theme.blueWinner;
  }

  if (winner === "orange") {
    return theme.orangeWinner;
  }

  return theme.drawWinner ?? null;
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
    ...Object.values(themeConfigs).map((theme) => theme.previewImage),
  ].forEach(preloadImage);
}

function preloadThemeAssets(theme: ThemeConfig, boardSize: BoardSize): void {
  [
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
    ...theme.cardFronts.slice(0, boardSize / 2),
  ]
    .filter((src): src is string => Boolean(src))
    .forEach(preloadImage);
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