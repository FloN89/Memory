(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=e=>`/${e.replace(/^\/+/,``).replace(/^public\//,``)}`,t=(t,n,r=18)=>Array.from({length:r},(r,i)=>e(`${t}/${n}${i===0?``:`-${i}`}.png`)),n=e=>{let t=new Image;t.src=e},r=e=>{e.filter(e=>!!e).forEach(n)},i=(e,t,n)=>`
    <span class="memory-score memory-score--${t}">
      ${a(e,t)}
      <strong data-score="${t}">${n}</strong>
    </span>
  `,a=(e,t)=>`
    <img
      class="memory-token memory-token--${t}"
      src="${t===`blue`?e.blueToken:e.orangeToken}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `,o=e=>`
    <button
      class="memory-card"
      data-card-id="${e.id}"
      type="button"
      aria-label="Karte aufdecken"
    >
      <span class="memory-card__inner">
        <span class="memory-card__face memory-card__face--back"></span>

        <span class="memory-card__face memory-card__face--front">
          <img src="${e.image}" alt="" draggable="false" />
        </span>
      </span>
    </button>
  `,s=(e,t)=>{let n=e.querySelector(`[data-score="blue"]`),r=e.querySelector(`[data-score="orange"]`),i=e.querySelector(`[data-current-player]`);n&&(n.textContent=String(t.score.blue)),r&&(r.textContent=String(t.score.orange)),i&&(i.innerHTML=a(t.theme,t.currentPlayer)),e.querySelectorAll(`[data-card-id]`).forEach(e=>{let n=t.cards.find(t=>t.id===e.dataset.cardId);n&&(e.classList.toggle(`is-flipped`,n.isFlipped||n.isMatched),e.classList.toggle(`is-matched`,n.isMatched),e.disabled=t.lockBoard||n.isFlipped||n.isMatched)})},c=1200,l=e=>e.score.blue>e.score.orange?`blue`:e.score.orange>e.score.blue?`orange`:`draw`,u=(e,t)=>t===`blue`?e.theme.blueWinner:t===`orange`?e.theme.orangeWinner:e.theme.drawWinner??null,d=e=>e===`draw`?`The game ended in`:`The winner is`,f=e=>e===`draw`?`DRAW`:`${e.toUpperCase()} PLAYER`,p=e=>e.theme.confetti?Array.isArray(e.theme.confetti)?e.theme.confetti:[e.theme.confetti]:[],m=e=>e.length===0?``:`
    <div class="memory-winner__confetti-layer" aria-hidden="true">
      ${e.map((e,t)=>`
        <img
          class="memory-winner__confetti memory-winner__confetti--${t+1}"
          src="${e}"
          alt=""
          draggable="false"
        />
      `).join(``)}
    </div>
  `,h=(e,t)=>{let n=e.querySelector(`[data-dialog-root]`);n&&(n.innerHTML=`
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
  `,n.querySelector(`[data-dialog-back]`)?.focus(),n.querySelector(`[data-dialog-back]`)?.addEventListener(`click`,()=>{n.innerHTML=``}),n.querySelector(`[data-dialog-exit]`)?.addEventListener(`click`,()=>{g(e,t,!1)}))},g=(e,t,n)=>{if(n){_(e,t);return}e.className=`memory-game-over ${t.theme.className}`,e.setAttribute(`aria-label`,`Game over`),e.innerHTML=`
    <div class="memory-game-over__content">
      <h1>Game over</h1>
      <p>Final score</p>
      <div class="memory-game-over__score" aria-label="Final score">
        ${i(t.theme,`orange`,t.score.orange)}
        ${i(t.theme,`blue`,t.score.blue)}
      </div>
    </div>
  `,window.setTimeout(()=>{V(e)},c)},_=(e,t)=>{let n=l(t),r=u(t,n),i=n===`draw`?[]:p(t);e.className=`memory-winner memory-winner--${n} ${t.theme.className}`,e.setAttribute(`aria-label`,`Winner screen`),e.innerHTML=`
    ${m(i)}

    <div class="memory-winner__content">
      <p>${d(n)}</p>
      <h1>${f(n)}</h1>

      ${r?`
        <img
          class="memory-winner__icon"
          src="${r}"
          alt=""
          aria-hidden="true"
          draggable="false"
        />
      `:`
        <span class="memory-winner__draw-icon" aria-hidden="true">=</span>
      `}

      <button
        class="memory-winner__back"
        data-winner-back
        type="button"
        aria-label="Back to settings screen"
      >
        Back to settings
      </button>
    </div>
  `,e.querySelector(`[data-winner-back]`)?.addEventListener(`click`,()=>{V(e)})},v=(t,n,r)=>Array.from({length:r},(r,i)=>e(`${t}/${n} ${i+1}.png`)),y=e=>{let t=Array.isArray(e.confetti)?e.confetti:[e.confetti];return[e.drawWinner,...t].filter(e=>!!e)},b={controller:e(`assets/base-themes/stadia_controller.png`),playButton:e(`assets/base-themes/play_button.png`),playButtonHover:e(`assets/base-themes/play_button_hover.png`)},x={startButton:e(`assets/base-themes/start_button.png`),startButtonHover:e(`assets/base-themes/start_button_hover.png`),startButtonDisabled:e(`assets/base-themes/start_button_disabled.png`),titleLine:e(`assets/base-themes/Line3_settings.png`),themeHoverLine:e(`assets/base-themes/Line 3.png`),summaryLineEmpty:e(`assets/base-themes/Line 6.png`),summaryLineSelected:e(`assets/base-themes/line3_down.png`),icons:{themes:e(`assets/base-themes/palette.png`),player:e(`assets/base-themes/chess_pawn.png`),board:e(`assets/base-themes/style.png`)}},S={"code-vibes":{key:`code-vibes`,label:`Code vibes theme`,previewImage:e(`assets/dev-themes/Property 1=IT logos.png`),className:`theme-code-vibes`,cardBack:e(`assets/dev-themes/Property 1=Component 21.png`),cardBackHover:e(`assets/dev-themes/Property 1=Component 21.png`),blueToken:e(`assets/dev-themes/label.png`),orangeToken:e(`assets/dev-themes/label_orange.png`),exitIcon:e(`assets/dev-themes/Property 1=Default.png`),exitIconHover:e(`assets/dev-themes/Property 1=hover.png`),blueWinner:e(`assets/dev-themes/label.png`),orangeWinner:e(`assets/dev-themes/label_orange.png`),drawWinner:e(`assets/dev-themes/Scale_Icon.png`),confetti:v(`assets/dev-themes`,`confetti`,8),buttons:{back:e(`assets/dev-themes/Property 1=Default_back.png`),backHover:e(`assets/dev-themes/Property 1=Hover_back.png`),exit:e(`assets/dev-themes/Property 1=Default.png`),exitHover:e(`assets/dev-themes/Property 1=hover.png`)},cardFronts:t(`assets/dev-themes`,`Property 1=Component 22`)},gaming:{key:`gaming`,label:`Gaming theme`,previewImage:e(`assets/game-themes/Property 1=gameing.png`),className:`theme-gaming`,cardBack:e(`assets/game-themes/Rectangle 37.png`),cardBackHover:e(`assets/game-themes/Rectangle 37.png`),blueToken:e(`assets/game-themes/chess_pawn_blue.png`),orangeToken:e(`assets/game-themes/chess_pawn.png`),exitIcon:e(`assets/game-themes/Property 1=Default.png`),exitIconHover:e(`assets/game-themes/Property 1=hover.png`),blueWinner:e(`assets/game-themes/pockal 1.png`),orangeWinner:e(`assets/game-themes/pockal 1.png`),drawWinner:e(`assets/game-themes/Scale_Icon.png`),buttons:{back:e(`assets/game-themes/Property 1=default (1).png`),backHover:e(`assets/game-themes/Property 1=hover (1).png`),exit:e(`assets/game-themes/Property 1=Default.png`),exitHover:e(`assets/game-themes/Property 1=hover.png`)},cardFronts:t(`assets/game-themes`,`Property 1=Component 2`)},foods:{key:`foods`,label:`Foods theme`,previewImage:e(`assets/food-themes/Property 1=foods.png`),className:`theme-foods`,cardBack:e(`assets/food-themes/frond.png`),cardBackHover:e(`assets/food-themes/frond.png`),blueToken:e(`assets/food-themes/chess_pawn_blue.png`),orangeToken:e(`assets/food-themes/chess_pawn.png`),exitIcon:e(`assets/food-themes/Property 1=Default (2).png`),exitIconHover:e(`assets/food-themes/Property 1=hover (2).png`),blueWinner:e(`assets/food-themes/chess_pawn.png`),orangeWinner:e(`assets/food-themes/Frame 739_orange.png`),drawWinner:e(`assets/food-themes/Frame 739.png`),buttons:{back:e(`assets/food-themes/Property 1=Default (3).png`),backHover:e(`assets/food-themes/Property 1=hover (3).png`),exit:e(`assets/food-themes/Property 1=Default (2).png`),exitHover:e(`assets/food-themes/Property 1=hover (2).png`)},cardFronts:t(`assets/food-themes`,`Property 1=Component 3`)}},C=()=>{r([x.startButton,x.startButtonHover,x.startButtonDisabled,x.titleLine,x.themeHoverLine,x.summaryLineEmpty,x.summaryLineSelected,x.icons.themes,x.icons.player,x.icons.board,...Object.values(S).map(e=>e.previewImage)])},w=(e,t)=>{r([e.cardBack,e.cardBackHover,e.blueToken,e.orangeToken,e.exitIcon,e.exitIconHover,e.blueWinner,e.orangeWinner,...y(e),e.buttons.back,e.buttons.backHover,e.buttons.exit,e.buttons.exitHover,...e.cardFronts.slice(0,t/2)])},T=e=>{let t=document.querySelector(e);if(!t)throw Error(`Element "${e}" wurde nicht gefunden.`);return t},E=e=>e.charAt(0).toUpperCase()+e.slice(1),D=e=>{let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t},O=(e,t,n)=>{e.style.setProperty(t,`url("${n}")`)},k,A=(e,t)=>{k=e;let n=S[t.theme],r=M(t,n);k.className=`memory-game memory-game--${t.boardSize} ${n.className}`,k.setAttribute(`aria-label`,`${n.label} memory game`),j(n),w(n,t.boardSize),k.innerHTML=`
    <header class="memory-game__topbar">
      <div class="memory-scoreboard" aria-label="Score">
        ${i(n,`orange`,r.score.orange)}
        ${i(n,`blue`,r.score.blue)}
      </div>

      <div class="memory-current">
        <span>Current player:</span>
        <span data-current-player>${a(n,r.currentPlayer)}</span>
      </div>

      <button class="memory-exit" data-exit type="button">
        <span class="visually-hidden">Exit game</span>
      </button>
    </header>

    <main class="memory-board" aria-label="Memory cards">
      ${r.cards.map(o).join(``)}
    </main>

    <div data-dialog-root></div>
  `,N(r),s(k,r)},j=e=>{O(k,`--memory-card-back-image`,e.cardBack),O(k,`--memory-card-back-hover-image`,e.cardBackHover),O(k,`--memory-exit-image`,e.buttons.exit),O(k,`--memory-exit-hover-image`,e.buttons.exitHover),O(k,`--memory-dialog-back-image`,e.buttons.back),O(k,`--memory-dialog-back-hover-image`,e.buttons.backHover),O(k,`--memory-dialog-exit-image`,e.buttons.exit),O(k,`--memory-dialog-exit-hover-image`,e.buttons.exitHover)},M=(e,t)=>{let n=e.boardSize/2,r=t.cardFronts.slice(0,n);if(r.length<n)throw Error(`${t.label} braucht mindestens ${n} Kartenbilder.`);return{settings:e,theme:t,cards:D(r.flatMap((e,t)=>[{id:`${t}-a`,pairId:t,image:e,isFlipped:!1,isMatched:!1},{id:`${t}-b`,pairId:t,image:e,isFlipped:!1,isMatched:!1}])),currentPlayer:e.player,score:{blue:0,orange:0},flippedIds:[],lockBoard:!1,isFinished:!1}},N=e=>{k.querySelectorAll(`[data-card-id]`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.cardId;n&&P(e,n)})}),k.querySelector(`[data-exit]`)?.addEventListener(`click`,()=>{h(k,e)})},P=(e,t)=>{if(e.lockBoard||e.isFinished)return;let n=e.cards.find(e=>e.id===t);!n||n.isFlipped||n.isMatched||(n.isFlipped=!0,e.flippedIds.push(n.id),s(k,e),!(e.flippedIds.length<2)&&(e.lockBoard=!0,F(e)))},F=e=>{let[t,n]=e.flippedIds,r=e.cards.find(e=>e.id===t),i=e.cards.find(e=>e.id===n);if(!r||!i){I(e);return}if(r.pairId===i.pairId){L(e,r,i);return}ee(e,r,i)},I=e=>{e.flippedIds=[],e.lockBoard=!1,s(k,e)},L=(e,t,n)=>{window.setTimeout(()=>{t.isMatched=!0,n.isMatched=!0,e.score[e.currentPlayer]+=2,I(e),e.cards.every(e=>e.isMatched)&&(e.isFinished=!0,window.setTimeout(()=>{g(k,e,!0)},650))},350)},ee=(e,t,n)=>{window.setTimeout(()=>{t.isFlipped=!1,n.isFlipped=!1,e.flippedIds=[],e.currentPlayer=e.currentPlayer===`blue`?`orange`:`blue`,e.lockBoard=!1,s(k,e)},850)},R={theme:null,player:null,boardSize:null},z=null,B,V=e=>{B=e,B.className=`settings-screen`,B.setAttribute(`aria-label`,`Settings`),H(),C(),B.innerHTML=`
    <div class="settings-screen__inner">
      <section class="settings-screen__left" aria-label="Game settings">
        <h1 class="settings-screen__title">Settings</h1>

        <div class="settings-screen__groups">
          <fieldset class="settings-group settings-group--themes">
            <legend>
              <img
                class="settings-group__icon"
                src="${x.icons.themes}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Game themes</span>
            </legend>

            ${U(`theme`,`code-vibes`,`Code vibes theme`,R.theme===`code-vibes`)}
            ${U(`theme`,`gaming`,`Gaming theme`,R.theme===`gaming`)}
            ${U(`theme`,`foods`,`Foods theme`,R.theme===`foods`)}
          </fieldset>

          <fieldset class="settings-group settings-group--player">
            <legend>
              <img
                class="settings-group__icon"
                src="${x.icons.player}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Choose player</span>
            </legend>

            ${U(`player`,`blue`,`Blue`,R.player===`blue`)}
            ${U(`player`,`orange`,`Orange`,R.player===`orange`)}
          </fieldset>

          <fieldset class="settings-group settings-group--board">
            <legend>
              <img
                class="settings-group__icon"
                src="${x.icons.board}"
                alt=""
                aria-hidden="true"
                draggable="false"
              />
              <span>Board size</span>
            </legend>

            ${U(`boardSize`,`16`,`16 cards`,R.boardSize===16)}
            ${U(`boardSize`,`24`,`24 cards`,R.boardSize===24)}
            ${U(`boardSize`,`36`,`36 cards`,R.boardSize===36)}
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
  `,W(),Y()},H=()=>{O(B,`--settings-start-button-image`,x.startButton),O(B,`--settings-start-button-hover-image`,x.startButtonHover),O(B,`--settings-start-button-disabled-image`,x.startButtonDisabled),O(B,`--settings-title-line-image`,x.titleLine),O(B,`--settings-theme-hover-line-image`,x.themeHoverLine),O(B,`--settings-summary-line-empty-image`,x.summaryLineEmpty),O(B,`--settings-summary-line-selected-image`,x.summaryLineSelected)},U=(e,t,n,r=!1)=>`
    <label class="settings-radio" data-radio-name="${e}">
      <input type="radio" name="${e}" value="${t}" ${r?`checked`:``} />
      <span class="settings-radio__text">${n}</span>
    </label>
  `,W=()=>{let e=B.querySelectorAll(`input[name="theme"]`),t=B.querySelectorAll(`.settings-group--themes .settings-radio`),n=B.querySelectorAll(`input[name="player"]`),r=B.querySelectorAll(`input[name="boardSize"]`),i=B.querySelector(`[data-settings-start]`);t.forEach(e=>G(e)),e.forEach(e=>K(e)),n.forEach(e=>q(e)),r.forEach(e=>J(e)),i?.addEventListener(`click`,()=>{!R.theme||!R.player||!R.boardSize||A(B,{theme:R.theme,player:R.player,boardSize:R.boardSize,startedAt:Date.now()})})},G=e=>{let t=e.querySelector(`input[name="theme"]`);if(!t)return;let n=t.value;e.addEventListener(`pointerenter`,()=>{z=n,Y()}),e.addEventListener(`pointerleave`,()=>{z=null,Y()}),e.addEventListener(`focusin`,()=>{z=n,Y()}),e.addEventListener(`focusout`,()=>{z=null,Y()})},K=e=>{e.addEventListener(`change`,()=>{R.theme=e.value,z=null,Y()})},q=e=>{e.addEventListener(`change`,()=>{R.player=e.value,Y()})},J=e=>{e.addEventListener(`change`,()=>{R.boardSize=Number(e.value),Y()})},Y=()=>{let e=B.querySelector(`[data-theme-preview]`),t=B.querySelector(`[data-theme-preview-image]`),n=B.querySelector(`[data-summary-theme]`),r=B.querySelector(`[data-summary-player]`),i=B.querySelector(`[data-summary-board]`),a=B.querySelector(`[data-summary-divider-theme]`),o=B.querySelector(`[data-summary-divider-player]`),s=B.querySelector(`[data-settings-start]`);X(e,t),Z(n,r,i),a?.classList.toggle(`is-selected`,R.theme!==null),o?.classList.toggle(`is-selected`,R.player!==null),s&&(s.disabled=!(R.theme&&R.player&&R.boardSize))},X=(e,t)=>{let n=S[z??R.theme??`code-vibes`];!e||!t||(e.dataset.placeholder=``,t.hidden=!1,t.src=n.previewImage,t.alt=`${n.label} preview`,t.onerror=()=>{t.hidden=!0,e.dataset.placeholder=`${n.label} Bild nicht gefunden`})},Z=(e,t,n)=>{e&&(e.textContent=R.theme?S[R.theme].label:`Game theme`),t&&(t.textContent=R.player?E(R.player):`Player`),n&&(n.textContent=R.boardSize?`${R.boardSize} cards`:`Board size`)},Q=e=>{e.className=`start-screen`,e.setAttribute(`aria-label`,`Start Screen`),e.innerHTML=`
    <div class="start-screen__copy">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
    </div>

    <button
      class="start-screen__play"
      data-play-button
      type="button"
      aria-label="Spiel starten"
      aria-pressed="false"
    >
      <span class="visually-hidden">Spiel starten</span>
    </button>

    <img
      class="start-screen__controller"
      data-controller
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `,$(e)},$=e=>{let t=e.querySelector(`[data-play-button]`),n=e.querySelector(`[data-controller]`);if(!t)throw Error(`Element "[data-play-button]" wurde nicht gefunden.`);n&&(n.src=b.controller),O(document.documentElement,`--play-button-image`,b.playButton),O(document.documentElement,`--play-button-hover-image`,b.playButtonHover),r([b.controller,b.playButton,b.playButtonHover]),te(t),t.addEventListener(`click`,()=>V(e))},te=e=>{e.addEventListener(`pointerenter`,()=>{e.classList.add(`is-hovered`)}),e.addEventListener(`pointerleave`,()=>{e.classList.remove(`is-hovered`)}),e.addEventListener(`focus`,()=>{e.classList.add(`is-hovered`)}),e.addEventListener(`blur`,()=>{e.classList.remove(`is-hovered`)})};Q(T(`#field`));