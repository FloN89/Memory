import "./styles/style.scss";

type ThemeKey = "code-vibes" | "gaming" | "foods";
type PlayerKey = "blue" | "orange";
type BoardSize = 16 | 24 | 36;

type SettingsState = {
  theme: ThemeKey | null;
  player: PlayerKey | null;
  boardSize: BoardSize | null;
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
    if (!isSettingsComplete()) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("game:settings-start", {
        detail: {
          theme: state.theme,
          player: state.player,
          boardSize: state.boardSize,
          startedAt: Date.now(),
        },
      }),
    );

    console.log("Spiel starten mit:", {
      theme: state.theme,
      player: state.player,
      boardSize: state.boardSize,
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

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
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

function preloadImage(src: string): void {
  const image = new Image();
  image.src = src;
}