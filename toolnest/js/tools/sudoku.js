/* =====================================================
   tools/sudoku.js — Improved Sudoku Game (overlay)
   ===================================================== */

function openSudokuApp() {
  const overlay = document.getElementById('sudoku-overlay');
  const wrap = document.getElementById('sudoku-frame-wrap');
  if (!overlay || !wrap) return;

  wrap.innerHTML = '<iframe' +
    ' srcdoc="' + sudokuHTML().replace(/"/g, '&quot;') + '"' +
    ' style="width:100%;height:100vh;border:none;display:block;"' +
    ' title="Sudoku Game"' +
    ' sandbox="allow-scripts allow-same-origin"' +
    '></iframe>';

  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeSudoku() {
  const overlay = document.getElementById('sudoku-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
  if (typeof routerHome === 'function') routerHome();
}

function sudokuHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sudoku — ToolNest</title>
<style>
  :root{
    --bg:#f4efe7;
    --panel:#fffdf8;
    --panel-2:#f7f2ea;
    --border:#d8ccb7;
    --text:#2a2318;
    --muted:#7d7262;
    --accent:#6c5ce7;
    --accent-2:#8c7ff0;
    --accent-soft:#ece8ff;
    --good:#059669;
    --bad:#dc2626;
    --warn:#d97706;
    --given:#efe8dc;
    --given-text:#1f160e;
    --cell-text:#2557d6;
    --note:#8d8198;
    --related:#f4f0ea;
    --selected:#e8e2ff;
    --error-bg:#fde2e2;
    --error-text:#c81e1e;
    --shadow:0 10px 30px rgba(44,36,22,.08);
    --font:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  }

  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0;
    font-family:var(--font);
    background:
      radial-gradient(circle at top, rgba(108,92,231,.10), transparent 28%),
      linear-gradient(180deg, #fbf8f3 0%, var(--bg) 100%);
    color:var(--text);
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:flex-start;
    padding:20px 14px 34px;
  }

  .app{
    width:min(760px,100%);
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:14px;
  }

  .top{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:6px;
    text-align:center;
  }

  h1{
    margin:0;
    font-size:1.55rem;
    line-height:1.1;
    letter-spacing:-.03em;
  }

  h1 span{color:var(--accent)}

  .subtitle{
    margin:0;
    color:var(--muted);
    font-size:.9rem;
  }

  .panel{
    width:100%;
    background:rgba(255,255,255,.62);
    backdrop-filter:blur(8px);
    border:1px solid rgba(216,204,183,.8);
    box-shadow:var(--shadow);
    border-radius:22px;
    padding:14px;
  }

  .controls, .settings-row{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:8px;
  }

  .settings-row {
    font-size:.85rem;
    color: var(--muted);
    align-items:center;
    gap:12px;
  }

  select,button{
    font:inherit;
  }

  select, .btn, .num-btn, .action-btn, .toggle-btn{
    border:1.5px solid var(--border);
    background:var(--panel);
    color:var(--text);
    border-radius:14px;
    cursor:pointer;
    transition:.15s ease;
    box-shadow:0 1px 0 rgba(255,255,255,.6) inset;
  }

  select{
    padding:10px 12px;
    min-width:120px;
    outline:none;
  }

  .btn{
    padding:10px 14px;
    font-weight:700;
  }

  .btn:hover, select:hover, .num-btn:hover, .action-btn:hover, .toggle-btn:hover{
    border-color:var(--accent);
    transform:translateY(-1px);
  }

  .btn-primary{
    background:linear-gradient(180deg, var(--accent-2), var(--accent));
    color:#fff;
    border-color:transparent;
  }

  .btn-primary:hover{
    color:#fff;
    opacity:.95;
  }

  .toggle-btn {
    padding:6px 10px;
    font-size:.82rem;
    font-weight:600;
  }
  .toggle-btn.active {
    background: var(--accent);
    color: #fff;
    border-color:var(--accent);
  }

  .stats{
    width:100%;
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:16px;
    color:var(--muted);
    font-size:.92rem;
  }

  .stat strong{
    color:var(--accent);
    font-weight:800;
  }

  .board-wrap{
    width:100%;
    display:flex;
    justify-content:center;
  }

  .board{
    width:min(430px, calc(100vw - 28px));
    aspect-ratio:1;
    display:grid;
    grid-template-columns:repeat(9, 1fr);
    grid-template-rows:repeat(9, 1fr);
    border:3px solid var(--text);
    border-radius:14px;
    overflow:hidden;
    background:var(--panel);
    box-shadow:var(--shadow);
    will-change: transform;
  }

  .cell{
    position:relative;
    display:flex;
    align-items:center;
    justify-content:center;
    user-select:none;
    cursor:pointer;
    border:1px solid var(--border);
    background:var(--panel);
    color:var(--cell-text);
    font-weight:700;
    font-size:clamp(.95rem, 3vw, 1.2rem);
    outline:none;
    transition:background .12s ease, transform .08s ease;
  }

  .cell:hover{background:#fcfaf6}

  .cell.given{
    background:var(--given);
    color:var(--given-text);
    cursor:default;
  }

  .cell.selected{
    background:var(--selected)!important;
  }

  .cell.related{
    background:var(--related)!important;
  }

  .cell.same-num{
    background:#e0daff!important;
  }

  .cell.error{
    background:var(--error-bg)!important;
    color:var(--error-text)!important;
  }

  .cell[data-col="2"], .cell[data-col="5"]{ border-right:3px solid #8f8474; }
  .cell[data-row="2"], .cell[data-row="5"]{ border-bottom:3px solid #8f8474; }

  .notes-grid{
    width:100%;
    height:100%;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    grid-template-rows:repeat(3,1fr);
    padding:2px;
  }

  .note-num{
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:clamp(.45rem, 1.45vw, .7rem);
    color:var(--note);
    line-height:1;
    font-weight:600;
  }

  .numpad{
    width:min(430px, calc(100vw - 28px));
    display:grid;
    grid-template-columns:repeat(5,1fr);
    gap:8px;
  }

  .num-btn{
    position:relative;
    padding:12px 4px;
    min-height:48px;
    font-weight:800;
    font-size:1.05rem;
    background:var(--panel);
    transition: transform .12s, background .12s, opacity .12s, box-shadow .12s;
  }

  .num-btn.erase{
    font-size:.92rem;
    font-weight:700;
  }

  .remain-badge{
    position:absolute;
    top:4px;
    right:6px;
    font-size:.6rem;
    font-weight:700;
    color:var(--muted);
  }

  .num-btn.completed {
    background: #d1fae5;
    border-color: #6ee7b7;
    opacity:.9;
    pointer-events:none;
    color: #065f46;
    box-shadow: 0 0 8px rgba(5,150,105,0.3);
  }
  .num-btn.completed:hover {
    transform:none;
    border-color:#6ee7b7;
  }
  .num-btn.completed .remain-badge {
    color:#059669;
  }

  .actions{
    width:min(430px, calc(100vw - 28px));
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:8px;
  }

  .action-btn{
    padding:10px 14px;
    font-size:.9rem;
    font-weight:700;
  }

  .action-btn.active{
    background:var(--accent);
    color:#fff;
    border-color:var(--accent);
  }

  .action-btn.danger{
    color:var(--bad);
    border-color:#f3b4b4;
  }

  .action-btn.danger:hover{
    background:#fff0f0;
  }

  .msg{
    width:100%;
    min-height:26px;
    text-align:center;
    font-size:.92rem;
    font-weight:700;
    color:var(--muted);
  }

  .msg.good{ color:var(--good); }
  .msg.bad{ color:var(--bad); }
  .msg.warn{ color:var(--warn); }

  .footer-note{
    width:100%;
    text-align:center;
    color:var(--muted);
    font-size:.78rem;
    margin-top:-2px;
  }

  /* Animations */
  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
  @keyframes flash-green {
    0% { background-color: #d1fae5; }
    50% { background-color: #a7f3d0; }
    100% { background-color: transparent; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-4px); }
    40%,80% { transform: translateX(4px); }
  }
  @keyframes flash-red {
    0% { background-color: #fee2e2; }
    50% { background-color: #fca5a5; }
    100% { background-color: transparent; }
  }
  @keyframes highlight-row {
    0% { background-color: #fef3c7; }
    50% { background-color: #fde68a; }
    100% { background-color: transparent; }
  }
  @keyframes glow-board {
    0% { box-shadow: 0 0 10px rgba(108,92,231,0.6); }
    50% { box-shadow: 0 0 30px rgba(108,92,231,0.9); }
    100% { box-shadow: 0 0 10px rgba(108,92,231,0.6); }
  }
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity:1; }
    100% { transform: translateY(400px) rotate(720deg); opacity:0; }
  }
  @keyframes scale-up {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }

  .cell.pop { animation: pop 0.2s ease; }
  .cell.flash-green { animation: flash-green 0.4s ease; }
  .cell.shake { animation: shake 0.3s ease; }
  .cell.flash-red { animation: flash-red 0.4s ease; }
  .row-highlight { animation: highlight-row 0.6s ease; }
  .board-glow { animation: glow-board 1s infinite alternate; }

  .victory-overlay {
    position: fixed;
    top:0; left:0; right:0; bottom:0;
    background: rgba(0,0,0,0.4);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:100;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .victory-modal {
    background: #fff;
    border-radius: 24px;
    padding: 28px 32px;
    text-align:center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    max-width:360px;
    width:90%;
  }
  .victory-modal h2 { margin:0 0 12px; color:var(--accent); }
  .victory-modal .stat-line { margin:6px 0; font-size:.95rem; }

  @media (max-width:480px){
    body{padding:14px 10px 28px}
    .panel{padding:12px}
    .board, .numpad, .actions{width:100%}
    select{min-width:110px}
    .num-btn{min-height:44px}
  }

  @media (prefers-reduced-motion: reduce) {
    .cell.pop, .cell.flash-green, .cell.shake, .cell.flash-red, .row-highlight, .board-glow, .num-btn.completed {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
</head>
<body>
  <div class="app">
    <div class="top">
      <h1>Tool<span>Nest</span> Sudoku</h1>
      <p class="subtitle">Classic number puzzle — logic, notes, hints, and one unique solution</p>
    </div>

    <div class="panel">
      <div class="controls">
        <select id="difficulty" aria-label="Difficulty">
          <option value="easy">Easy</option>
          <option value="medium" selected>Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
        <button class="btn btn-primary" id="newGameBtn">New Game</button>
        <button class="btn" id="checkBtn">✓ Check</button>
        <button class="btn" id="hintBtn">💡 Hint</button>
      </div>
      <div class="settings-row">
        <button class="toggle-btn active" id="soundToggle">🔊 Sound ON</button>
        <button class="toggle-btn active" id="animToggle">🎞️ Anim ON</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat">⏱ <strong id="timer">0:00</strong></div>
      <div class="stat">❌ <strong id="mistakes">0</strong>/3</div>
      <div class="stat">💡 <strong id="hints">3</strong></div>
      <div class="stat">🧩 <strong id="clues">0</strong>/81</div>
    </div>

    <div class="board-wrap">
      <div class="board" id="board" role="grid" aria-label="Sudoku grid"></div>
    </div>

    <div class="numpad" id="numpad" role="group" aria-label="Number pad"></div>

    <div class="actions">
      <button class="action-btn" id="undoBtn">↩ Undo</button>
      <button class="action-btn" id="notesBtn">📝 Notes</button>
      <button class="action-btn danger" id="resetBtn">🔄 Reset</button>
    </div>

    <div class="msg" id="msg" role="status" aria-live="polite"></div>
    <div class="footer-note">Tip: click a cell, then type 1–9 on your keyboard or use the number pad.</div>
  </div>
  <div id="victory-container"></div>
  <div id="confetti-container" style="position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:200;"></div>

<script>
(function () {
  'use strict';

  var DIFFICULTY = {
    easy:   { minClues: 42, maxClues: 46 },
    medium: { minClues: 34, maxClues: 39 },
    hard:   { minClues: 28, maxClues: 33 },
    expert: { minClues: 22, maxClues: 27 }
  };

  // ---------- settings ----------
  var settings = {
    sound: true,
    anim: true
  };
  try {
    var stored = JSON.parse(localStorage.getItem('tn_sudoku_settings'));
    if (stored) {
      settings.sound = stored.sound !== false;
      settings.anim = stored.anim !== false;
    }
  } catch(e){}

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) settings.anim = false;

  function saveSettings() {
    try { localStorage.setItem('tn_sudoku_settings', JSON.stringify(settings)); } catch(e){}
  }

  // ---------- audio ----------
  var audioCtx = null;
  function initAudio() {
    if (!audioCtx && settings.sound) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
    }
  }

  function playTone(freq, type, duration, vol, ramp) {
    if (!audioCtx || !settings.sound) return;
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.3, audioCtx.currentTime);
    if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function sfxCorrect()   { playTone(880, 'sine', 0.15, 0.15); }
  function sfxError()     { playTone(200, 'square', 0.2, 0.1); }
  function sfxRow()       { playTone(660, 'triangle', 0.25, 0.2); }
  function sfxCol()       { playTone(550, 'triangle', 0.25, 0.2); }
  function sfxBox()       { playTone(440, 'triangle', 0.2, 0.2); }
  function sfxNumberComplete() { playTone(1047, 'sine', 0.3, 0.25); }
  function sfxHint()      { playTone(1200, 'sine', 0.2, 0.1); }
  function sfxUndo()      { playTone(300, 'sine', 0.1, 0.1); }
  function sfxWin()       {
    playTone(523, 'sine', 0.2, 0.3);
    setTimeout(function(){ playTone(659, 'sine', 0.2, 0.3); }, 150);
    setTimeout(function(){ playTone(784, 'sine', 0.4, 0.3); }, 300);
  }

  // ---------- haptics ----------
  function haptic(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  // ---------- DOM cache ----------
  var els = {};
  var cellEls = [];   // 9x9
  var numBtnEls = []; // 1-9 + erase

  function $(id) { return document.getElementById(id); }

  // ---------- state ----------
  var state = {
    puzzle: [],
    solution: [],
    userGrid: [],
    notes: [],
    selected: null,
    notesMode: false,
    mistakes: 0,
    hintsLeft: 3,
    timerSec: 0,
    timerInt: null,
    history: [],
    gameOver: false
  };

  // completion tracking
  var prevCompleted = { rows: Array(9).fill(false), cols: Array(9).fill(false), boxes: Array(9).fill(false) };

  function init() {
    els.board = $('board');
    els.numpad = $('numpad');
    els.timer = $('timer');
    els.mistakes = $('mistakes');
    els.hints = $('hints');
    els.clues = $('clues');
    els.msg = $('msg');
    els.difficulty = $('difficulty');
    els.newGameBtn = $('newGameBtn');
    els.checkBtn = $('checkBtn');
    els.hintBtn = $('hintBtn');
    els.undoBtn = $('undoBtn');
    els.notesBtn = $('notesBtn');
    els.resetBtn = $('resetBtn');
    els.soundToggle = $('soundToggle');
    els.animToggle = $('animToggle');

    buildBoardOnce();
    buildNumpadOnce();
    wireUI();
    loadSavedGameOrStart();
  }

  function buildBoardOnce() {
    els.board.innerHTML = '';
    for (var r = 0; r < 9; r++) {
      cellEls[r] = [];
      for (var c = 0; c < 9; c++) {
        var cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '0');
        cell.addEventListener('click', (function(rr,cc){ return function(){selectCell(rr,cc);}; })(r,c));
        cell.addEventListener('keydown', (function(rr,cc){ return function(e){ handleCellKey(e,rr,cc); }; })(r,c));
        els.board.appendChild(cell);
        cellEls[r][c] = cell;
      }
    }
  }

  function buildNumpadOnce() {
    els.numpad.innerHTML = '';
    numBtnEls = [];
    for (var n = 1; n <= 9; n++) {
      var btn = document.createElement('button');
      btn.className = 'num-btn';
      btn.type = 'button';
      btn.textContent = String(n);
      var badge = document.createElement('span');
      badge.className = 'remain-badge';
      btn.appendChild(badge);
      btn.setAttribute('aria-label', 'Enter ' + n);
      btn.addEventListener('click', (function(num){ return function(){ inputNumber(num); }; })(n));
      els.numpad.appendChild(btn);
      numBtnEls.push(btn);
    }
    var erase = document.createElement('button');
    erase.className = 'num-btn erase';
    erase.type = 'button';
    erase.textContent = '⌫ Erase';
    erase.setAttribute('aria-label', 'Erase');
    erase.addEventListener('click', function(){ inputNumber(0); });
    els.numpad.appendChild(erase);
    numBtnEls.push(erase);
  }

  function wireUI() {
    els.newGameBtn.addEventListener('click', newGame);
    els.checkBtn.addEventListener('click', checkAll);
    els.hintBtn.addEventListener('click', giveHint);
    els.undoBtn.addEventListener('click', undoMove);
    els.notesBtn.addEventListener('click', toggleNotes);
    els.resetBtn.addEventListener('click', function () {
      if (confirm('Reset puzzle?')) resetPuzzle();
    });
    els.difficulty.addEventListener('change', saveState);

    // settings toggles
    els.soundToggle.addEventListener('click', function(){
      settings.sound = !settings.sound;
      els.soundToggle.textContent = settings.sound ? '🔊 Sound ON' : '🔇 Sound OFF';
      els.soundToggle.classList.toggle('active', settings.sound);
      if (settings.sound) initAudio(); else audioCtx = null;
      saveSettings();
    });
    els.animToggle.addEventListener('click', function(){
      settings.anim = !settings.anim;
      els.animToggle.textContent = settings.anim ? '🎞️ Anim ON' : '🎞️ Anim OFF';
      els.animToggle.classList.toggle('active', settings.anim);
      saveSettings();
    });

    // initial toggle states
    els.soundToggle.classList.toggle('active', settings.sound);
    els.soundToggle.textContent = settings.sound ? '🔊 Sound ON' : '🔇 Sound OFF';
    els.animToggle.classList.toggle('active', settings.anim);
    els.animToggle.textContent = settings.anim ? '🎞️ Anim ON' : '🎞️ Anim OFF';

    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('beforeunload', saveState);

    // init audio on first user interaction
    document.addEventListener('click', function(){ initAudio(); }, { once: true });
  }

  function handleCellKey(e, r, c) {
    if (state.gameOver) return;
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      selectCell(r, c);
      inputNumber(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      e.preventDefault();
      selectCell(r, c);
      inputNumber(0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); if (r > 0) selectCell(r-1, c);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); if (r < 8) selectCell(r+1, c);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault(); if (c > 0) selectCell(r, c-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); if (c < 8) selectCell(r, c+1);
    }
  }

  function handleKeydown(e) {
    var tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (!state.selected || state.gameOver) return;

    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      inputNumber(parseInt(e.key, 10));
    } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      inputNumber(0);
    } else if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1, 0); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1, 0); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveSelection(0, -1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); moveSelection(0, 1); }
    else if (e.key === 'n' || e.key === 'N') { e.preventDefault(); toggleNotes(); }
  }

  function moveSelection(dr, dc) {
    if (!state.selected) return;
    var r = state.selected[0] + dr, c = state.selected[1] + dc;
    if (r < 0 || r > 8 || c < 0 || c > 8) return;
    selectCell(r, c);
  }

  function selectCell(r, c) {
    if (state.gameOver) return;
    state.selected = [r, c];
    updateBoard();
    focusCell(r, c);
    saveState();
  }

  function focusCell(r, c) {
    var cell = cellEls[r] && cellEls[r][c];
    if (cell) cell.focus();
  }

  /* ---------- messages & timer ---------- */
  function setMessage(text, type, timeoutMs) {
    if (!els.msg) return;
    els.msg.textContent = text || '';
    els.msg.className = 'msg' + (type ? ' ' + type : '');
    if (timeoutMs) {
      setTimeout(function () {
        if (els.msg.textContent === text) {
          els.msg.textContent = '';
          els.msg.className = 'msg';
        }
      }, timeoutMs);
    }
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function startTimer() {
    stopTimer();
    if (state.gameOver) return;
    state.timerInt = setInterval(function () {
      state.timerSec++;
      els.timer.textContent = formatTime(state.timerSec);
      saveState();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerInt) { clearInterval(state.timerInt); state.timerInt = null; }
  }

  /* ---------- helpers ---------- */
  function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function createGrid(fillValue) {
    return Array.from({ length: 9 }, function () { return Array(9).fill(fillValue); });
  }
  function cloneGrid(g) { return g.map(function (row) { return row.slice(); }); }

  function createEmptyNotes() {
    return Array.from({ length: 9 }, function () {
      return Array.from({ length: 9 }, function () { return new Set(); });
    });
  }

  /* ---------- solver ---------- */
  function candidates(grid, r, c) {
    if (grid[r][c] !== 0) return [];
    var used = new Set();
    for (var i = 0; i < 9; i++) {
      if (grid[r][i] !== 0) used.add(grid[r][i]);
      if (grid[i][c] !== 0) used.add(grid[i][c]);
    }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var rr = br; rr < br + 3; rr++)
      for (var cc = bc; cc < bc + 3; cc++)
        if (grid[rr][cc] !== 0) used.add(grid[rr][cc]);
    var out = [];
    for (var n = 1; n <= 9; n++) if (!used.has(n)) out.push(n);
    return out;
  }

  function findBestEmptyCell(grid) {
    var best = null, bestOpts = null;
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        if (grid[r][c] !== 0) continue;
        var opts = candidates(grid, r, c);
        if (opts.length === 0) return { r: r, c: c, opts: [] };
        if (!best || opts.length < bestOpts.length) {
          best = { r: r, c: c };
          bestOpts = opts;
          if (opts.length === 1) return { r: r, c: c, opts: opts };
        }
      }
    }
    return best ? { r: best.r, c: best.c, opts: bestOpts } : null;
  }

  function solveGrid(grid) {
    var spot = findBestEmptyCell(grid);
    if (!spot) return true;
    if (spot.opts.length === 0) return false;
    var opts = shuffle(spot.opts);
    for (var i = 0; i < opts.length; i++) {
      grid[spot.r][spot.c] = opts[i];
      if (solveGrid(grid)) return true;
      grid[spot.r][spot.c] = 0;
    }
    return false;
  }

  function generateSolvedGrid() {
    var g = createGrid(0);
    solveGrid(g);
    return g;
  }

  function countSolutions(grid, limit) {
    var cnt = 0;
    function search() {
      if (cnt >= limit) return;
      var spot = findBestEmptyCell(grid);
      if (!spot) { cnt++; return; }
      if (spot.opts.length === 0) return;
      var opts = shuffle(spot.opts);
      for (var i = 0; i < opts.length; i++) {
        grid[spot.r][spot.c] = opts[i];
        search();
        if (cnt >= limit) { grid[spot.r][spot.c] = 0; return; }
        grid[spot.r][spot.c] = 0;
      }
    }
    search();
    return cnt;
  }

  function generatePuzzle(difficulty) {
    var solution = generateSolvedGrid();
    var puzzle = cloneGrid(solution);
    var cfg = DIFFICULTY[difficulty] || DIFFICULTY.medium;
    var target = randomInt(cfg.minClues, cfg.maxClues);

    var cells = [];
    for (var r = 0; r < 9; r++)
      for (var c = 0; c < 9; c++)
        cells.push([r, c]);
    cells = shuffle(cells);

    var clues = 81, changed = true, passes = 0;
    while (clues > target && changed && passes < 6) {
      changed = false; passes++;
      for (var i = 0; i < cells.length && clues > target; i++) {
        var rr = cells[i][0], cc = cells[i][1];
        if (puzzle[rr][cc] === 0) continue;
        var backup = puzzle[rr][cc];
        puzzle[rr][cc] = 0;
        if (countSolutions(cloneGrid(puzzle), 2) === 1) {
          clues--; changed = true;
        } else {
          puzzle[rr][cc] = backup;
        }
      }
      if (clues > target) cells = shuffle(cells);
    }
    return { puzzle: puzzle, solution: solution, clues: clues };
  }

  /* ---------- number completion & completion detection ---------- */
  function getCorrectCounts() {
    var counts = Array(10).fill(0); // 1-9
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var val = state.userGrid[r][c];
        if (val !== 0 && val === state.solution[r][c]) counts[val]++;
      }
    }
    return counts;
  }

  function getSectionCompleteness() {
    var rows = Array(9).fill(true), cols = Array(9).fill(true), boxes = Array(9).fill(true);
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        if (state.userGrid[r][c] !== state.solution[r][c]) {
          rows[r] = false;
          cols[c] = false;
          var boxIdx = Math.floor(r/3)*3 + Math.floor(c/3);
          boxes[boxIdx] = false;
        }
      }
    }
    return { rows: rows, cols: cols, boxes: boxes };
  }

  function applyCompletionAnimations(newComplete) {
    if (!settings.anim) return;
    // row
    for (var r = 0; r < 9; r++) {
      if (newComplete.rows[r] && !prevCompleted.rows[r]) {
        for (var c = 0; c < 9; c++) {
          cellEls[r][c].classList.add('row-highlight');
          setTimeout(function(row, col){ cellEls[row][col].classList.remove('row-highlight'); }, 600, r, c);
        }
        sfxRow();
      }
    }
    // col
    for (var c = 0; c < 9; c++) {
      if (newComplete.cols[c] && !prevCompleted.cols[c]) {
        for (var r = 0; r < 9; r++) {
          cellEls[r][c].classList.add('row-highlight'); // reuse same animation
          setTimeout(function(row, col){ cellEls[row][col].classList.remove('row-highlight'); }, 600, r, c);
        }
        sfxCol();
      }
    }
    // boxes
    for (var b = 0; b < 9; b++) {
      if (newComplete.boxes[b] && !prevCompleted.boxes[b]) {
        var br = Math.floor(b/3)*3, bc = (b%3)*3;
        for (var rr = br; rr < br+3; rr++)
          for (var cc = bc; cc < bc+3; cc++) {
            cellEls[rr][cc].classList.add('row-highlight');
            setTimeout(function(rr,cc){ cellEls[rr][cc].classList.remove('row-highlight'); }, 600, rr, cc);
          }
        sfxBox();
      }
    }
    prevCompleted = newComplete;
  }

  function updateNumberButtons(counts) {
    for (var n = 1; n <= 9; n++) {
      var btn = numBtnEls[n-1];
      var badge = btn.querySelector('.remain-badge');
      var remaining = Math.max(0, 9 - counts[n]);
      badge.textContent = remaining > 0 ? String(remaining) : '✓';
      if (counts[n] >= 9) {
        btn.disabled = true;
        btn.classList.add('completed');
        btn.setAttribute('aria-disabled', 'true');
      } else {
        btn.disabled = false;
        btn.classList.remove('completed');
        btn.removeAttribute('aria-disabled');
      }
    }
  }

  function animateCellCorrect(r, c) {
    if (!settings.anim) return;
    cellEls[r][c].classList.add('pop', 'flash-green');
    setTimeout(function(){ cellEls[r][c].classList.remove('pop', 'flash-green'); }, 400);
  }

  function animateCellError(r, c) {
    if (!settings.anim) return;
    cellEls[r][c].classList.add('shake', 'flash-red');
    setTimeout(function(){ cellEls[r][c].classList.remove('shake', 'flash-red'); }, 400);
  }

  /* ---------- persistence ---------- */
  function saveState() {
    try {
      var data = {
        puzzle: state.puzzle,
        solution: state.solution,
        userGrid: state.userGrid,
        notes: state.notes.map(function (row) { return row.map(function (s) { return Array.from(s); }); }),
        selected: state.selected,
        notesMode: state.notesMode,
        mistakes: state.mistakes,
        hintsLeft: state.hintsLeft,
        timerSec: state.timerSec,
        gameOver: state.gameOver,
        difficulty: els.difficulty ? els.difficulty.value : 'medium'
      };
      localStorage.setItem('tn_sudoku_state', JSON.stringify(data));
    } catch (e) {}
  }

  function loadSavedGameOrStart() {
    try {
      var raw = localStorage.getItem('tn_sudoku_state');
      var saved = raw ? JSON.parse(raw) : null;
      if (saved && saved.puzzle && saved.solution && saved.userGrid) {
        state.puzzle = saved.puzzle;
        state.solution = saved.solution;
        state.userGrid = saved.userGrid;
        state.notes = Array.isArray(saved.notes)
          ? saved.notes.map(function (row) { return row.map(function (a) { return new Set(Array.isArray(a) ? a : []); }); })
          : createEmptyNotes();
        state.selected = Array.isArray(saved.selected) ? saved.selected : null;
        state.notesMode = !!saved.notesMode;
        state.mistakes = saved.mistakes || 0;
        state.hintsLeft = typeof saved.hintsLeft === 'number' ? saved.hintsLeft : 3;
        state.timerSec = saved.timerSec || 0;
        state.gameOver = !!saved.gameOver;
        els.difficulty.value = saved.difficulty || 'medium';
        refreshAll(true);
        if (!state.gameOver) startTimer();
        else stopTimer();
        if (state.selected) focusCell(state.selected[0], state.selected[1]);
        return;
      }
    } catch (e) {}
    newGame();
  }

  /* ---------- game actions ---------- */
  function newGame() {
    stopTimer();
    state.mistakes = 0;
    state.hintsLeft = 3;
    state.timerSec = 0;
    state.gameOver = false;
    state.notesMode = false;
    state.selected = null;
    state.history = [];
    prevCompleted = { rows: Array(9).fill(false), cols: Array(9).fill(false), boxes: Array(9).fill(false) };

    var diff = els.difficulty.value || 'medium';
    var gen = generatePuzzle(diff);
    state.puzzle = gen.puzzle;
    state.solution = gen.solution;
    state.userGrid = cloneGrid(state.puzzle);
    state.notes = createEmptyNotes();

    refreshAll(false);
    startTimer();
    saveState();
    setMessage('New puzzle ready.', 'good', 1200);
  }

  function resetPuzzle() {
    stopTimer();
    state.userGrid = cloneGrid(state.puzzle);
    state.notes = createEmptyNotes();
    state.mistakes = 0;
    state.hintsLeft = 3;
    state.timerSec = 0;
    state.gameOver = false;
    state.notesMode = false;
    state.selected = null;
    state.history = [];
    prevCompleted = { rows: Array(9).fill(false), cols: Array(9).fill(false), boxes: Array(9).fill(false) };
    refreshAll(false);
    startTimer();
    saveState();
    setMessage('Puzzle reset.', 'good', 1200);
  }

  function toggleNotes() {
    state.notesMode = !state.notesMode;
    els.notesBtn.classList.toggle('active', state.notesMode);
    setMessage(state.notesMode ? 'Notes mode ON.' : 'Notes mode OFF.', 'good', 900);
    saveState();
  }

  function inputNumber(n) {
    if (!state.selected || state.gameOver) return;
    var r = state.selected[0], c = state.selected[1];
    if (state.puzzle[r][c] !== 0) return;

    var prevValue = state.userGrid[r][c];
    var prevNotes = Array.from(state.notes[r][c]);
    var prevMistakes = state.mistakes;
    var prevHints = state.hintsLeft;
    var prevGameOver = state.gameOver;

    pushHistory({
      r: r, c: c,
      prevValue: prevValue,
      prevNotes: prevNotes,
      prevMistakes: prevMistakes,
      prevHints: prevHints,
      prevGameOver: prevGameOver
    });

    var oldCounts = getCorrectCounts();
    var oldComplete = getSectionCompleteness();

    if (state.notesMode && n !== 0) {
      // toggle note
      var noteSet = state.notes[r][c];
      noteSet.has(n) ? noteSet.delete(n) : noteSet.add(n);
    } else if (state.notesMode && n === 0) {
      state.notes[r][c].clear();
    } else {
      state.userGrid[r][c] = n;
      state.notes[r][c].clear();

      if (n !== 0 && n !== state.solution[r][c]) {
        state.mistakes++;
        if (state.mistakes >= 3) {
          state.gameOver = true;
          stopTimer();
          setMessage('Game over! Too many mistakes.', 'bad');
        } else {
          setMessage('Incorrect entry. (' + state.mistakes + '/3)', 'bad', 1400);
        }
        animateCellError(r, c);
        sfxError();
        haptic(100);
      } else if (n !== 0 && n === state.solution[r][c]) {
        clearRelatedNotes(r, c, n);
        animateCellCorrect(r, c);
        sfxCorrect();
        haptic(20);
      }
    }

    var newCounts = getCorrectCounts();
    var newComplete = getSectionCompleteness();

    // number completion detection & sound
    for (var num = 1; num <= 9; num++) {
      if (oldCounts[num] < 9 && newCounts[num] >= 9) {
        sfxNumberComplete();
        if (settings.anim && numBtnEls[num-1]) {
          numBtnEls[num-1].classList.add('scale-up');
          setTimeout(function(btn){ btn.classList.remove('scale-up'); }, 300, numBtnEls[num-1]);
        }
      }
    }

    applyCompletionAnimations(newComplete);
    refreshAll(false);
    focusCell(state.selected[0], state.selected[1]);
    saveState();
    if (!state.gameOver) checkWin();
  }

  function clearRelatedNotes(r, c, n) {
    for (var i = 0; i < 9; i++) {
      state.notes[r][i].delete(n);
      state.notes[i][c].delete(n);
    }
    var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (var rr = br; rr < br + 3; rr++)
      for (var cc = bc; cc < bc + 3; cc++)
        state.notes[rr][cc].delete(n);
  }

  function checkWin() {
    for (var r = 0; r < 9; r++)
      for (var c = 0; c < 9; c++)
        if (state.userGrid[r][c] !== state.solution[r][c]) return;
    state.gameOver = true;
    stopTimer();
    sfxWin();
    haptic([100,50,100]);
    showVictoryOverlay();
    if (settings.anim) {
      els.board.classList.add('board-glow');
      launchConfetti();
    }
    setMessage('Solved in ' + formatTime(state.timerSec) + '!', 'good');
    saveState();
  }

  function showVictoryOverlay() {
    var container = $('victory-container');
    if (!container) return;
    var diff = els.difficulty.options[els.difficulty.selectedIndex].text;
    container.innerHTML = '<div class="victory-overlay" id="victoryOverlay">' +
      '<div class="victory-modal">' +
      '<h2>🎉 Puzzle Solved!</h2>' +
      '<div class="stat-line"><strong>Difficulty:</strong> ' + diff + '</div>' +
      '<div class="stat-line"><strong>Time:</strong> ' + formatTime(state.timerSec) + '</div>' +
      '<div class="stat-line"><strong>Mistakes:</strong> ' + state.mistakes + '</div>' +
      '<div class="stat-line"><strong>Hints used:</strong> ' + (3 - state.hintsLeft) + '</div>' +
      '<button class="btn btn-primary" style="margin-top:16px;" id="closeVictory">Continue</button>' +
      '</div></div>';
    document.getElementById('closeVictory').addEventListener('click', function(){
      container.innerHTML = '';
    });
  }

  function launchConfetti() {
    var confettiContainer = $('confetti-container');
    if (!confettiContainer) return;
    var colors = ['#6c5ce7','#f9ca24','#f0932b','#eb4d4b','#6ab04c','#22a6b3'];
    for (var i = 0; i < 50; i++) {
      var piece = document.createElement('div');
      piece.style.position = 'absolute';
      piece.style.width = '8px';
      piece.style.height = '8px';
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      piece.style.left = Math.random()*100 + '%';
      piece.style.top = '-20px';
      piece.style.animation = 'confetti-fall ' + (2+Math.random()*3) + 's linear forwards';
      piece.style.borderRadius = '50%';
      confettiContainer.appendChild(piece);
      setTimeout(function(p){ p.remove(); }, 4000, piece);
    }
  }

  function checkAll() {
    var wrong = 0;
    for (var r = 0; r < 9; r++)
      for (var c = 0; c < 9; c++)
        if (state.userGrid[r][c] !== 0 && state.userGrid[r][c] !== state.solution[r][c]) wrong++;
    if (wrong === 0) setMessage('No mistakes found so far.', 'good', 1800);
    else setMessage(wrong + ' mistake' + (wrong > 1 ? 's' : '') + ' found.', 'bad', 2200);
  }

  function giveHint() {
    if (state.gameOver || state.hintsLeft <= 0) {
      if (!state.gameOver && state.hintsLeft <= 0) setMessage('No hints left.', 'warn', 1200);
      return;
    }
    var empties = [];
    for (var r = 0; r < 9; r++)
      for (var c = 0; c < 9; c++)
        if (state.puzzle[r][c] === 0 && state.userGrid[r][c] === 0) empties.push([r, c]);
    if (empties.length === 0) return;

    var pick = empties[Math.floor(Math.random() * empties.length)];
    var r0 = pick[0], c0 = pick[1];

    pushHistory({
      r: r0, c: c0,
      prevValue: state.userGrid[r0][c0],
      prevNotes: Array.from(state.notes[r0][c0]),
      prevMistakes: state.mistakes,
      prevHints: state.hintsLeft,
      prevGameOver: state.gameOver
    });

    var oldCounts = getCorrectCounts();
    var oldComplete = getSectionCompleteness();

    state.userGrid[r0][c0] = state.solution[r0][c0];
    state.notes[r0][c0].clear();
    clearRelatedNotes(r0, c0, state.solution[r0][c0]);
    state.hintsLeft--;
    state.selected = [r0, c0];

    var newCounts = getCorrectCounts();
    var newComplete = getSectionCompleteness();

    for (var num = 1; num <= 9; num++) {
      if (oldCounts[num] < 9 && newCounts[num] >= 9) sfxNumberComplete();
    }
    applyCompletionAnimations(newComplete);
    setMessage('Hint used.', 'good', 900);
    sfxHint();
    animateCellCorrect(r0, c0);
    refreshAll(false);
    focusCell(r0, c0);
    saveState();
    checkWin();
  }

  function undoMove() {
    if (!state.history.length) return;
    var last = state.history.pop();
    var oldComplete = getSectionCompleteness();
    state.userGrid[last.r][last.c] = last.prevValue;
    state.notes[last.r][last.c] = new Set(last.prevNotes);
    state.mistakes = last.prevMistakes;
    state.hintsLeft = last.prevHints;
    state.gameOver = last.prevGameOver;
    state.selected = [last.r, last.c];

    if (!state.gameOver && !state.timerInt) startTimer();
    sfxUndo();
    var newComplete = getSectionCompleteness();
    applyCompletionAnimations(newComplete);
    refreshAll(false);
    focusCell(last.r, last.c);
    saveState();
    setMessage('Undone.', 'good', 800);
  }

  function pushHistory(act) {
    state.history.push({
      r: act.r, c: act.c,
      prevValue: act.prevValue,
      prevNotes: act.prevNotes.slice(),
      prevMistakes: act.prevMistakes,
      prevHints: act.prevHints,
      prevGameOver: act.prevGameOver
    });
  }

  /* ---------- rendering (incremental updates) ---------- */
  function refreshAll(initialLoad) {
    els.mistakes.textContent = String(state.mistakes);
    els.hints.textContent = String(state.hintsLeft);
    els.clues.textContent = String(countClues());
    els.timer.textContent = formatTime(state.timerSec);
    els.notesBtn.classList.toggle('active', state.notesMode);
    updateBoard();
    updateNumberButtons(getCorrectCounts());
  }

  function countClues() {
    var cnt = 0;
    for (var r = 0; r < 9; r++)
      for (var c = 0; c < 9; c++)
        if (state.userGrid[r][c] !== 0) cnt++;
    return cnt;
  }

  function updateBoard() {
    for (var r = 0; r < 9; r++) {
      for (var c = 0; c < 9; c++) {
        var cell = cellEls[r][c];
        // classes
        cell.classList.remove('given', 'selected', 'related', 'same-num', 'error');
        if (state.puzzle[r][c] !== 0) cell.classList.add('given');
        if (state.selected) {
          var sr = state.selected[0], sc = state.selected[1];
          if (r === sr && c === sc) {
            cell.classList.add('selected');
          } else {
            var sameRow = r === sr, sameCol = c === sc;
            var sameBox = Math.floor(r/3) === Math.floor(sr/3) && Math.floor(c/3) === Math.floor(sc/3);
            if (sameRow || sameCol || sameBox) cell.classList.add('related');
            if (state.userGrid[sr][sc] !== 0 && state.userGrid[r][c] === state.userGrid[sr][sc])
              cell.classList.add('same-num');
          }
        }
        if (state.userGrid[r][c] !== 0 && state.puzzle[r][c] === 0 && state.userGrid[r][c] !== state.solution[r][c]) {
          cell.classList.add('error');
        }

        // content
        if (state.userGrid[r][c] !== 0) {
          cell.textContent = String(state.userGrid[r][c]);
          cell.setAttribute('aria-label', 'Row ' + (r+1) + ' Column ' + (c+1) + ': ' + state.userGrid[r][c]);
          // ensure no notes grid
          var existingNotes = cell.querySelector('.notes-grid');
          if (existingNotes) existingNotes.remove();
        } else {
          cell.textContent = '';
          var set = state.notes[r][c];
          var notesEl = cell.querySelector('.notes-grid');
          if (set.size > 0) {
            if (!notesEl) {
              notesEl = document.createElement('div');
              notesEl.className = 'notes-grid';
              for (var n = 1; n <= 9; n++) {
                var noteEl = document.createElement('div');
                noteEl.className = 'note-num';
                noteEl.textContent = '';
                notesEl.appendChild(noteEl);
              }
              cell.appendChild(notesEl);
            }
            var noteChildren = notesEl.children;
            for (var n = 1; n <= 9; n++) {
              noteChildren[n-1].textContent = set.has(n) ? String(n) : '';
            }
          } else {
            if (notesEl) notesEl.remove();
          }
          cell.setAttribute('aria-label', 'Row ' + (r+1) + ' Column ' + (c+1) + ': empty');
        }
      }
    }
  }

  init();
})();
<\/script>
</body>
</html>`;
}