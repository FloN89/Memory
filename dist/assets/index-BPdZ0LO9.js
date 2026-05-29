(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=e=>e.replace(/^\/+/,``).replace(/^public\//,``),t=t=>`/${e(t)}`,n=(e,n,r=18)=>Array.from({length:r},(r,i)=>t(`${e}/${n}${i===0?``:`-${i}`}.png`)),r=e=>{let t=new Image;t.src=e},i=e=>{e.filter(e=>!!e).forEach(r)},a=(e,t,n)=>`
    <span class="memory-score memory-score--${t}">
      ${o(e,t)}
      <strong data-score="${t}">${n}</strong>
    </span>
  `,o=(e,t)=>`
    <img
      class="memory-token memory-token--${t}"
      src="${t===`blue`?e.blueToken:e.orangeToken}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `,ee=e=>`
    <button
      class="memory-card"
      data-card-id="${e.id}"
      type="button"
      aria-label="Karte aufdecken"
    >
      ${s(e)}
    </button>
  `,s=e=>`
    <span class="memory-card__inner">
      <span class="memory-card__face memory-card__face--back"></span>
      ${te(e)}
    </span>
  `,te=e=>`
    <span class="memory-card__face memory-card__face--front">
      <img src="${e.image}" alt="" draggable="false" />
    </span>
  `,c=(e,t)=>{l(e,t),d(e,t),ne(e,t)},l=(e,t)=>{u(e,`[data-score="blue"]`,String(t.score.blue)),u(e,`[data-score="orange"]`,String(t.score.orange))},u=(e,t,n)=>{let r=e.querySelector(t);r&&(r.textContent=n)},d=(e,t)=>{let n=e.querySelector(`[data-current-player]`);n&&(n.innerHTML=o(t.theme,t.currentPlayer))},ne=(e,t)=>{e.querySelectorAll(`[data-card-id]`).forEach(e=>{re(e,t)})},re=(e,t)=>{let n=t.cards.find(t=>t.id===e.dataset.cardId);n&&(e.classList.toggle(`is-flipped`,n.isFlipped||n.isMatched),e.classList.toggle(`is-matched`,n.isMatched),e.disabled=t.lockBoard||n.isFlipped||n.isMatched)},ie=1200,ae=e=>e.score.blue>e.score.orange?`blue`:e.score.orange>e.score.blue?`orange`:`draw`,oe=(e,t)=>t===`blue`?e.theme.blueWinner:t===`orange`?e.theme.orangeWinner:e.theme.drawWinner??null,se=e=>e===`draw`?`The game ended in`:`The winner is`,ce=e=>e===`draw`?`DRAW`:`${e.toUpperCase()} PLAYER`,le=e=>e.theme.confetti?Array.isArray(e.theme.confetti)?e.theme.confetti:[e.theme.confetti]:[],ue=e=>e.length===0?``:`
    <div class="memory-winner__confetti-layer" aria-hidden="true">
      ${e.map(de).join(``)}
    </div>
  `,de=(e,t)=>`
    <img
      class="memory-winner__confetti memory-winner__confetti--${t+1}"
      src="${e}"
      alt=""
      draggable="false"
    />
  `,fe=(e,t)=>{let n=e.querySelector(`[data-dialog-root]`);n&&(n.innerHTML=pe(),he(n,e,t))},pe=()=>`
    <div class="memory-modal" role="dialog" aria-modal="true" aria-labelledby="quit-dialog-title">
      <div class="memory-modal__panel">
        <h2 id="quit-dialog-title">Do you want to quit the game?</h2>
        ${me()}
      </div>
    </div>
  `,me=()=>`
    <div class="memory-modal__actions">
      ${f(`back`,`Back to game`,`data-dialog-back`)}
      ${f(`exit`,`Exit game`,`data-dialog-exit`)}
    </div>
  `,f=(e,t,n)=>`
    <button
      class="memory-modal__image-button memory-modal__image-button--${e}"
      ${n}
      type="button"
      aria-label="${t}"
    >
      <span class="visually-hidden">${t}</span>
    </button>
  `,he=(e,t,n)=>{ge(e),_e(e),ve(e,t,n)},ge=e=>{e.querySelector(`[data-dialog-back]`)?.focus()},_e=e=>{e.querySelector(`[data-dialog-back]`)?.addEventListener(`click`,()=>{e.innerHTML=``})},ve=(e,t,n)=>{e.querySelector(`[data-dialog-exit]`)?.addEventListener(`click`,()=>{p(t,n,!1)})},p=(e,t,n)=>{if(n){h(e,t);return}ye(e,t)},ye=(e,t)=>{be(e,t),e.innerHTML=xe(t),window.setTimeout(()=>H(e),ie)},be=(e,t)=>{e.className=`memory-game-over ${t.theme.className}`,e.setAttribute(`aria-label`,`Game over`)},xe=e=>`
    <div class="memory-game-over__content">
      <h1>Game over</h1>
      <p>Final score</p>
      ${m(e)}
    </div>
  `,m=e=>`
    <div class="memory-game-over__score" aria-label="Final score">
      ${a(e.theme,`orange`,e.score.orange)}
      ${a(e.theme,`blue`,e.score.blue)}
    </div>
  `,h=(e,t)=>{let n=ae(t);g(e,t,n),e.innerHTML=_(t,n),S(e)},g=(e,t,n)=>{e.className=`memory-winner memory-winner--${n} ${t.theme.className}`,e.setAttribute(`aria-label`,`Winner screen`)},_=(e,t)=>`
    ${ue(t===`draw`?[]:le(e))}
    <div class="memory-winner__content">
      <p>${se(t)}</p>
      <h1>${ce(t)}</h1>
      ${v(e,t)}
      ${x()}
    </div>
  `,v=(e,t)=>{let n=oe(e,t);return n?y(n):b()},y=e=>`
    <img
      class="memory-winner__icon"
      src="${e}"
      alt=""
      aria-hidden="true"
      draggable="false"
    />
  `,b=()=>`<span class="memory-winner__draw-icon" aria-hidden="true">=</span>`,x=()=>`
    <button
      class="memory-winner__back"
      data-winner-back
      type="button"
      aria-label="Back to settings screen"
    >
      Back to settings
    </button>
  `,S=e=>{e.querySelector(`[data-winner-back]`)?.addEventListener(`click`,()=>{H(e)})},C=[`startButton`,`startButtonHover`,`startButtonDisabled`,`titleLine`,`themeHoverLine`,`summaryLineEmpty`,`summaryLineSelected`],w=(e,n,r)=>Array.from({length:r},(r,i)=>t(`${e}/${n} ${i+1}.png`)),T=e=>{let t=Array.isArray(e.confetti)?e.confetti:[e.confetti];return[e.drawWinner,...t].filter(e=>!!e)},E={controller:t(`assets/base-themes/stadia_controller.png`),playButton:t(`assets/base-themes/play_button.png`),playButtonHover:t(`assets/base-themes/play_button_hover.png`)},D={startButton:t(`assets/base-themes/start_button.png`),startButtonHover:t(`assets/base-themes/start_button_hover.png`),startButtonDisabled:t(`assets/base-themes/start_button_disabled.png`),titleLine:t(`assets/base-themes/Line3_settings.png`),themeHoverLine:t(`assets/base-themes/Line 3.png`),summaryLineEmpty:t(`assets/base-themes/Line 6.png`),summaryLineSelected:t(`assets/base-themes/line3_down.png`),icons:{themes:t(`assets/base-themes/palette.png`),player:t(`assets/base-themes/chess_pawn.png`),board:t(`assets/base-themes/style.png`)}},O={"code-vibes":{key:`code-vibes`,label:`Code vibes theme`,previewImage:t(`assets/dev-themes/Property 1=IT logos.png`),className:`theme-code-vibes`,cardBack:t(`assets/dev-themes/Property 1=Component 21.png`),cardBackHover:t(`assets/dev-themes/Property 1=Component 21.png`),blueToken:t(`assets/dev-themes/label.png`),orangeToken:t(`assets/dev-themes/label_orange.png`),exitIcon:t(`assets/dev-themes/Property 1=Default.png`),exitIconHover:t(`assets/dev-themes/Property 1=hover.png`),blueWinner:t(`assets/dev-themes/label.png`),orangeWinner:t(`assets/dev-themes/label_orange.png`),drawWinner:t(`assets/dev-themes/Scale_Icon.png`),confetti:w(`assets/dev-themes`,`confetti`,8),buttons:{back:t(`assets/dev-themes/Property 1=Default_back.png`),backHover:t(`assets/dev-themes/Property 1=Hover_back.png`),exit:t(`assets/dev-themes/Property 1=Default.png`),exitHover:t(`assets/dev-themes/Property 1=hover.png`)},cardFronts:n(`assets/dev-themes`,`Property 1=Component 22`)},gaming:{key:`gaming`,label:`Gaming theme`,previewImage:t(`assets/game-themes/Property 1=gameing.png`),className:`theme-gaming`,cardBack:t(`assets/game-themes/Rectangle 37.png`),cardBackHover:t(`assets/game-themes/Rectangle 37.png`),blueToken:t(`assets/game-themes/chess_pawn_blue.png`),orangeToken:t(`assets/game-themes/chess_pawn.png`),exitIcon:t(`assets/game-themes/Property 1=Default.png`),exitIconHover:t(`assets/game-themes/Property 1=hover.png`),blueWinner:t(`assets/game-themes/pockal 1.png`),orangeWinner:t(`assets/game-themes/pockal 1.png`),drawWinner:t(`assets/game-themes/Scale_Icon.png`),buttons:{back:t(`assets/game-themes/Property 1=default (1).png`),backHover:t(`assets/game-themes/Property 1=hover (1).png`),exit:t(`assets/game-themes/Property 1=Default.png`),exitHover:t(`assets/game-themes/Property 1=hover.png`)},cardFronts:n(`assets/game-themes`,`Property 1=Component 2`)},foods:{key:`foods`,label:`Foods theme`,previewImage:t(`assets/food-themes/Property 1=foods.png`),className:`theme-foods`,cardBack:t(`assets/food-themes/frond.png`),cardBackHover:t(`assets/food-themes/frond.png`),blueToken:t(`assets/food-themes/chess_pawn_blue.png`),orangeToken:t(`assets/food-themes/chess_pawn.png`),exitIcon:t(`assets/food-themes/Property 1=Default (2).png`),exitIconHover:t(`assets/food-themes/Property 1=hover (2).png`),blueWinner:t(`assets/food-themes/chess_pawn.png`),orangeWinner:t(`assets/food-themes/Frame 739_orange.png`),drawWinner:t(`assets/food-themes/Frame 739.png`),buttons:{back:t(`assets/food-themes/Property 1=Default (3).png`),backHover:t(`assets/food-themes/Property 1=hover (3).png`),exit:t(`assets/food-themes/Property 1=Default (2).png`),exitHover:t(`assets/food-themes/Property 1=hover (2).png`)},cardFronts:n(`assets/food-themes`,`Property 1=Component 3`)}},k=()=>{let e=C.map(e=>D[e]),t=Object.values(D.icons),n=Object.values(O).map(e=>e.previewImage);return[...e,...t,...n]},A=e=>[e.cardBack,e.cardBackHover,e.blueToken,e.orangeToken,e.exitIcon,e.exitIconHover,e.blueWinner,e.orangeWinner],j=e=>[e.buttons.back,e.buttons.backHover,e.buttons.exit,e.buttons.exitHover],M=()=>{i(k())},Se=(e,t)=>{i([...A(e),...T(e),...j(e),...e.cardFronts.slice(0,t/2)])},Ce=e=>{let t=document.querySelector(e);if(!t)throw Error(`Element "${e}" wurde nicht gefunden.`);return t},we=e=>e.charAt(0).toUpperCase()+e.slice(1),Te=e=>{let t=[...e];for(let e=t.length-1;e>0;--e){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t},N=(e,t,n)=>{e.style.setProperty(t,`url("${n}")`)},P=2,Ee=2,De=350,Oe=650,ke=850,F,Ae=(e,t)=>{F=e;let n=O[t.theme],r=ze(t,n);je(t,n),Re(n),Se(n,t.boardSize),F.innerHTML=Me(n,r),Ue(r),c(F,r)},je=(e,t)=>{F.className=`memory-game memory-game--${e.boardSize} ${t.className}`,F.setAttribute(`aria-label`,`${t.label} memory game`)},Me=(e,t)=>`
    ${Ne(e,t)}
    ${Le(t.cards)}
    <div data-dialog-root></div>
  `,Ne=(e,t)=>`
    <header class="memory-game__topbar">
      ${Pe(e,t)}
      ${Fe(e,t)}
      ${Ie()}
    </header>
  `,Pe=(e,t)=>`
    <div class="memory-scoreboard" aria-label="Score">
      ${a(e,`orange`,t.score.orange)}
      ${a(e,`blue`,t.score.blue)}
    </div>
  `,Fe=(e,t)=>`
    <div class="memory-current">
      <span>Current player:</span>
      <span data-current-player>${o(e,t.currentPlayer)}</span>
    </div>
  `,Ie=()=>`
    <button class="memory-exit" data-exit type="button">
      <span class="visually-hidden">Exit game</span>
    </button>
  `,Le=e=>`
    <main class="memory-board" aria-label="Memory cards">
      ${e.map(ee).join(``)}
    </main>
  `,Re=e=>{N(F,`--memory-card-back-image`,e.cardBack),N(F,`--memory-card-back-hover-image`,e.cardBackHover),N(F,`--memory-exit-image`,e.buttons.exit),N(F,`--memory-exit-hover-image`,e.buttons.exitHover),N(F,`--memory-dialog-back-image`,e.buttons.back),N(F,`--memory-dialog-back-hover-image`,e.buttons.backHover),N(F,`--memory-dialog-exit-image`,e.buttons.exit),N(F,`--memory-dialog-exit-hover-image`,e.buttons.exitHover)},ze=(e,t)=>({settings:e,theme:t,cards:Te(Be(e,t)),currentPlayer:e.player,score:He(),flippedIds:[],lockBoard:!1,isFinished:!1}),Be=(e,t)=>{let n=e.boardSize/P,r=t.cardFronts.slice(0,n);if(r.length<n)throw Error(`${t.label} braucht mindestens ${n} Kartenbilder.`);return r.flatMap(Ve)},Ve=(e,t)=>[I(e,t,`a`),I(e,t,`b`)],I=(e,t,n)=>({id:`${t}-${n}`,pairId:t,image:e,isFlipped:!1,isMatched:!1}),He=()=>({blue:0,orange:0}),Ue=e=>{We(e),Ke(e)},We=e=>{F.querySelectorAll(`[data-card-id]`).forEach(t=>{Ge(t,e)})},Ge=(e,t)=>{e.addEventListener(`click`,()=>{let n=e.dataset.cardId;n&&qe(t,n)})},Ke=e=>{F.querySelector(`[data-exit]`)?.addEventListener(`click`,()=>{fe(F,e)})},qe=(e,t)=>{if(e.lockBoard||e.isFinished)return;let n=e.cards.find(e=>e.id===t);!n||n.isFlipped||n.isMatched||Je(e,n)},Je=(e,t)=>{t.isFlipped=!0,e.flippedIds.push(t.id),c(F,e),!(e.flippedIds.length<P)&&(e.lockBoard=!0,Ye(e))},Ye=e=>{let[t,n]=L(e);if(!t||!n){R(e);return}Xe(e,t,n)},Xe=(e,t,n)=>{if(t.pairId===n.pairId){Ze(e,t,n);return}tt(e,t,n)},L=e=>e.flippedIds.map(t=>e.cards.find(e=>e.id===t)),R=e=>{e.flippedIds=[],e.lockBoard=!1,c(F,e)},Ze=(e,t,n)=>{window.setTimeout(()=>{Qe(e,t,n)},De)},Qe=(e,t,n)=>{$e(t,n),e.score[e.currentPlayer]+=Ee,R(e),et(e)},$e=(e,t)=>{e.isMatched=!0,t.isMatched=!0},et=e=>{e.cards.every(e=>e.isMatched)&&(e.isFinished=!0,window.setTimeout(()=>p(F,e,!0),Oe))},tt=(e,t,n)=>{window.setTimeout(()=>{nt(e,t,n)},ke)},nt=(e,t,n)=>{t.isFlipped=!1,n.isFlipped=!1,e.flippedIds=[],e.currentPlayer=e.currentPlayer===`blue`?`orange`:`blue`,e.lockBoard=!1,c(F,e)},rt=[`code-vibes`,`gaming`,`foods`],it=[`blue`,`orange`],at=[16,24,36],ot=`code-vibes`,st=[{value:`code-vibes`,label:`Code vibes theme`},{value:`gaming`,label:`Gaming theme`},{value:`foods`,label:`Foods theme`}],ct=[{value:`blue`,label:`Blue`},{value:`orange`,label:`Orange`}],lt=[{value:16,label:`16 cards`},{value:24,label:`24 cards`},{value:36,label:`36 cards`}],z={theme:null,player:null,boardSize:null},B=null,V,H=e=>{V=e,ut(),wt(),M(),V.innerHTML=dt(),Tt(),J()},ut=()=>{V.className=`settings-screen`,V.setAttribute(`aria-label`,`Settings`)},dt=()=>`
    <div class="settings-screen__inner">
      ${ft()}
      ${bt()}
    </div>
  `,ft=()=>`
    <section class="settings-screen__left" aria-label="Game settings">
      <h1 class="settings-screen__title">Settings</h1>
      <div class="settings-screen__groups">
        ${pt()}
        ${mt()}
        ${ht()}
      </div>
    </section>
  `,pt=()=>U(`themes`,D.icons.themes,`Game themes`,_t()),mt=()=>U(`player`,D.icons.player,`Choose player`,vt()),ht=()=>U(`board`,D.icons.board,`Board size`,yt()),U=(e,t,n,r)=>`
    <fieldset class="settings-group settings-group--${e}">
      ${gt(t,n)}
      ${r}
    </fieldset>
  `,gt=(e,t)=>`
    <legend>
      <img class="settings-group__icon" src="${e}" alt="" aria-hidden="true" draggable="false" />
      <span>${t}</span>
    </legend>
  `,_t=()=>st.map(e=>W(`theme`,e,z.theme===e.value)).join(``),vt=()=>ct.map(e=>W(`player`,e,z.player===e.value)).join(``),yt=()=>lt.map(e=>W(`boardSize`,e,z.boardSize===e.value)).join(``),W=(e,t,n=!1)=>`
    <label class="settings-radio" data-radio-name="${e}">
      <input type="radio" name="${e}" value="${t.value}" ${n?`checked`:``} />
      <span class="settings-radio__text">${t.label}</span>
    </label>
  `,bt=()=>`
    <section class="settings-screen__right" aria-label="Theme preview">
      ${xt()}
      ${St()}
    </section>
  `,xt=()=>`
    <div class="theme-preview" data-theme-preview>
      <img class="theme-preview__image" data-theme-preview-image alt="" draggable="false" />
    </div>
  `,St=()=>`
    <div class="settings-summary" aria-label="Selected settings">
      <span class="settings-summary__item" data-summary-theme>Game theme</span>
      <span class="settings-summary__divider" data-summary-divider-theme aria-hidden="true"></span>
      <span class="settings-summary__item" data-summary-player>Player</span>
      <span class="settings-summary__divider" data-summary-divider-player aria-hidden="true"></span>
      <span class="settings-summary__item" data-summary-board>Board size</span>
      ${Ct()}
    </div>
  `,Ct=()=>`
    <button class="settings-summary__start" data-settings-start type="button" disabled>
      <span class="visually-hidden">Start</span>
    </button>
  `,wt=()=>{N(V,`--settings-start-button-image`,D.startButton),N(V,`--settings-start-button-hover-image`,D.startButtonHover),N(V,`--settings-start-button-disabled-image`,D.startButtonDisabled),N(V,`--settings-title-line-image`,D.titleLine),N(V,`--settings-theme-hover-line-image`,D.themeHoverLine),N(V,`--settings-summary-line-empty-image`,D.summaryLineEmpty),N(V,`--settings-summary-line-selected-image`,D.summaryLineSelected)},Tt=()=>{Et(),Dt(),Ot(),kt()},Et=()=>{let e=V.querySelectorAll(`input[name="theme"]`);V.querySelectorAll(`.settings-group--themes .settings-radio`).forEach(At),e.forEach(Mt)},Dt=()=>{V.querySelectorAll(`input[name="player"]`).forEach(Nt)},Ot=()=>{V.querySelectorAll(`input[name="boardSize"]`).forEach(Pt)},kt=()=>{V.querySelector(`[data-settings-start]`)?.addEventListener(`click`,()=>{let e=G();e&&Ae(V,e)})},G=()=>!z.theme||!z.player||!z.boardSize?null:{theme:z.theme,player:z.player,boardSize:z.boardSize,startedAt:Date.now()},At=e=>{let t=e.querySelector(`input[name="theme"]`);!t||!Z(t.value)||jt(e,t.value)},jt=(e,t)=>{e.addEventListener(`pointerenter`,()=>K(t)),e.addEventListener(`focusin`,()=>K(t)),e.addEventListener(`pointerleave`,q),e.addEventListener(`focusout`,q)},K=e=>{B=e,J()},q=()=>{B=null,J()},Mt=e=>{e.addEventListener(`change`,()=>{Z(e.value)&&(z.theme=e.value,B=null,J())})},Nt=e=>{e.addEventListener(`change`,()=>{Wt(e.value)&&(z.player=e.value,J())})},Pt=e=>{e.addEventListener(`change`,()=>{z.boardSize=Gt(e.value),J()})},J=()=>{Ft(),Rt(),Ht(),Ut()},Ft=()=>{let e=V.querySelector(`[data-theme-preview]`),t=V.querySelector(`[data-theme-preview-image]`);!e||!t||It(e,t)},It=(e,t)=>{let n=O[B??z.theme??ot];e.dataset.placeholder=``,t.hidden=!1,t.src=n.previewImage,t.alt=`${n.label} preview`,t.onerror=()=>Lt(e,t,n.label)},Lt=(e,t,n)=>{t.hidden=!0,e.dataset.placeholder=`${n} Bild nicht gefunden`},Rt=()=>{Y(`[data-summary-theme]`,zt()),Y(`[data-summary-player]`,Bt()),Y(`[data-summary-board]`,Vt())},zt=()=>z.theme?O[z.theme].label:`Game theme`,Bt=()=>z.player?we(z.player):`Player`,Vt=()=>z.boardSize?`${z.boardSize} cards`:`Board size`,Y=(e,t)=>{let n=V.querySelector(e);n&&(n.textContent=t)},Ht=()=>{X(`[data-summary-divider-theme]`,z.theme!==null),X(`[data-summary-divider-player]`,z.player!==null)},X=(e,t)=>{V.querySelector(e)?.classList.toggle(`is-selected`,t)},Ut=()=>{let e=V.querySelector(`[data-settings-start]`);e&&(e.disabled=G()===null)},Z=e=>rt.some(t=>t===e),Wt=e=>it.some(t=>t===e),Gt=e=>{let t=Number(e);return Kt(t)?t:null},Kt=e=>at.some(t=>t===e),qt=e=>{Jt(e),e.innerHTML=Yt(),$t(e)},Jt=e=>{e.className=`start-screen`,e.setAttribute(`aria-label`,`Start Screen`)},Yt=()=>`
    ${Xt()}
    ${Zt()}
    ${Qt()}
  `,Xt=()=>`
    <div class="start-screen__copy">
      <p class="start-screen__eyebrow">It’s play time.</p>
      <h1 class="start-screen__title">Ready to play?</h1>
    </div>
  `,Zt=()=>`
    <button class="start-screen__play" data-play-button type="button" aria-label="Spiel starten" aria-pressed="false">
      <span class="visually-hidden">Spiel starten</span>
    </button>
  `,Qt=()=>`<img class="start-screen__controller" data-controller alt="" aria-hidden="true" draggable="false" />`,$t=e=>{let t=en(e);tn(e),nn(),rn(),an(t),t.addEventListener(`click`,()=>H(e))},en=e=>{let t=e.querySelector(`[data-play-button]`);if(!t)throw Error(`Element "[data-play-button]" wurde nicht gefunden.`);return t},tn=e=>{let t=e.querySelector(`[data-controller]`);t&&(t.src=E.controller)},nn=()=>{N(document.documentElement,`--play-button-image`,E.playButton),N(document.documentElement,`--play-button-hover-image`,E.playButtonHover)},rn=()=>{i([E.controller,E.playButton,E.playButtonHover])},an=e=>{e.addEventListener(`pointerenter`,()=>Q(e)),e.addEventListener(`focus`,()=>Q(e)),e.addEventListener(`pointerleave`,()=>$(e)),e.addEventListener(`blur`,()=>$(e))},Q=e=>{e.classList.add(`is-hovered`)},$=e=>{e.classList.remove(`is-hovered`)};qt(Ce(`#field`));