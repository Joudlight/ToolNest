/* =====================================================
   tools/wordfill.js — Fill The Word Puzzle Game
   ===================================================== */

const WF_WORDS = [
  { word:'PYTHON',  hint:'Popular programming language named after a snake', category:'Tech' },
  { word:'MOSQUE',  hint:'A place of worship for Muslims', category:'Islamic' },
  { word:'QURAN',   hint:'The holy book of Islam', category:'Islamic' },
  { word:'COFFEE',  hint:'Morning brew loved worldwide', category:'Food' },
  { word:'SAFARI',  hint:'A journey through wildlife in Africa', category:'Travel' },
  { word:'PUZZLE',  hint:'This game itself is one!', category:'Games' },
  { word:'ARABIC',  hint:'A Semitic language spoken by 400 million people', category:'Language' },
  { word:'PLANET',  hint:'Earth is one of these in the solar system', category:'Science' },
  { word:'FALCON',  hint:'National bird of the UAE and Qatar', category:'Nature' },
  { word:'MARKET',  hint:'A place where goods are bought and sold', category:'Economy' },
  { word:'SPRING',  hint:'Season between winter and summer', category:'Nature' },
  { word:'BRIDGE',  hint:'Structure that spans a gap or river', category:'Architecture' },
  { word:'ORANGE',  hint:'A citrus fruit and a colour', category:'Food' },
  { word:'TRAVEL',  hint:'Moving from one place to another', category:'Travel' },
  { word:'WISDOM',  hint:'The quality of having good judgment', category:'Life' },
  { word:'GARDEN',  hint:'A cultivated area with plants and flowers', category:'Nature' },
  { word:'MIRROR',  hint:'A reflective surface you look into', category:'Objects' },
  { word:'PRAYER',  hint:'Communication with the divine — Salah in Islam', category:'Islamic' },
  { word:'SUNSET',  hint:'When the sun disappears below the horizon', category:'Nature' },
  { word:'DESERT',  hint:'A vast, dry landscape — Sahara is one', category:'Nature' },
];

let wfCurrent = null, wfBlanks = [], wfGuessed = [], wfScore = 0, wfStreak = 0, wfLetterPool = [], wfSelectedLetters = [];

function buildWordFill() {
  return {
    title: '🔤 Fill The Word',
    html: `<div class="wf-container">
      <div class="wf-meta">
        <span>Score: <span class="wf-score-val" id="wf-score">0</span></span>
        <span>Streak: <span class="wf-score-val" id="wf-streak">0</span>🔥</span>
      </div>
      <div class="wf-category" id="wf-category">—</div>
      <div class="wf-hint" id="wf-hint">Loading puzzle…</div>
      <div class="wf-word-row" id="wf-word-row" aria-label="Word display" role="group"></div>
      <div class="wf-input-area" id="wf-letter-pool" aria-label="Letter choices"></div>
      <div class="wf-feedback" id="wf-feedback" role="alert" aria-live="polite"></div>
      <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap;justify-content:center;">
        <button class="wf-action-btn sec" onclick="wfSkip()">⏭ Skip</button>
        <button class="wf-action-btn" onclick="wfNewGame()">🔀 New Puzzle</button>
      </div>
    </div>`,
    init: wfNewGame,
  };
}

function wfNewGame() {
  const idx = Math.floor(Math.random() * WF_WORDS.length);
  wfCurrent = WF_WORDS[idx];
  const word = wfCurrent.word;
  // Pick 40–60% of letters as blanks
  const allIdxs = word.split('').map((_, i) => i);
  const numBlanks = Math.max(1, Math.ceil(word.length * (0.4 + Math.random() * 0.2)));
  wfBlanks = allIdxs.sort(() => Math.random() - 0.5).slice(0, numBlanks).sort((a,b)=>a-b);
  wfGuessed = [];
  wfSelectedLetters = [];
  // Build letter pool: missing letters + decoys
  const missing = wfBlanks.map(i => word[i]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const decoys = [];
  while (decoys.length < Math.min(4, 26 - missing.length)) {
    const c = alphabet[Math.floor(Math.random() * 26)];
    if (!missing.includes(c) && !decoys.includes(c)) decoys.push(c);
  }
  wfLetterPool = [...missing, ...decoys].sort(() => Math.random() - 0.5);
  wfRenderPuzzle();
  const fb = document.getElementById('wf-feedback'); if (fb) { fb.textContent = ''; fb.className = 'wf-feedback'; }
}

function wfRenderPuzzle() {
  if (!wfCurrent) return;
  const word = wfCurrent.word;
  const cat  = document.getElementById('wf-category');
  const hint = document.getElementById('wf-hint');
  if (cat) cat.textContent = wfCurrent.category;
  if (hint) hint.textContent = '💡 ' + wfCurrent.hint;

  const row = document.getElementById('wf-word-row'); if (!row) return;
  row.innerHTML = word.split('').map((letter, i) => {
    const isBlank = wfBlanks.includes(i);
    const guessedLetter = wfGuessed.find(g => g.pos === i);
    if (!isBlank)       return `<div class="wf-letter-box filled" aria-label="${letter}">${letter}</div>`;
    if (guessedLetter)  return `<div class="wf-letter-box correct" aria-label="${guessedLetter.letter} correct">${guessedLetter.letter}</div>`;
    return `<div class="wf-letter-box blank" aria-label="blank"></div>`;
  }).join('');

  const pool = document.getElementById('wf-letter-pool'); if (!pool) return;
  const usedLetters = wfGuessed.map(g => g.letter);
  // Remove used from pool display
  const remaining = [...wfLetterPool];
  usedLetters.forEach(l => { const idx = remaining.indexOf(l); if (idx !== -1) remaining.splice(idx, 1); });
  pool.innerHTML = remaining.map(l => `<button class="wf-letter-btn" onclick="wfGuessLetter('${l}')" aria-label="Letter ${l}">${l}</button>`).join('');
}

function wfGuessLetter(letter) {
  if (!wfCurrent) return;
  const word = wfCurrent.word;
  // Find next unfilled blank that matches this letter
  const nextBlankIdx = wfBlanks.find(i => word[i] === letter && !wfGuessed.find(g => g.pos === i));
  if (nextBlankIdx !== undefined) {
    wfGuessed.push({ pos: nextBlankIdx, letter });
    // Check if all blanks filled
    if (wfGuessed.length === wfBlanks.length) {
      wfScore += 10 + wfStreak * 2;
      wfStreak++;
      const sc = document.getElementById('wf-score');   if (sc) sc.textContent = wfScore;
      const st = document.getElementById('wf-streak');  if (st) st.textContent = wfStreak;
      const fb = document.getElementById('wf-feedback'); if (fb) { fb.textContent = '🎉 Correct! Well done!'; fb.className = 'wf-feedback'; }
      wfRenderPuzzle();
      setTimeout(wfNewGame, 1500);
    } else {
      wfRenderPuzzle();
    }
  } else {
    // Wrong letter
    wfStreak = 0;
    const st = document.getElementById('wf-streak'); if (st) st.textContent = 0;
    const fb = document.getElementById('wf-feedback'); if (fb) { fb.textContent = '❌ That letter doesn\'t fit here!'; fb.className = 'wf-feedback wrong'; setTimeout(() => { if(fb) { fb.textContent=''; fb.className='wf-feedback'; } }, 1200); }
  }
}

function wfSkip() {
  wfStreak = 0;
  const st = document.getElementById('wf-streak'); if (st) st.textContent = 0;
  const fb = document.getElementById('wf-feedback'); if (fb) { fb.textContent = `The word was: ${wfCurrent ? wfCurrent.word : ''}`; fb.className = 'wf-feedback'; }
  setTimeout(wfNewGame, 1800);
}
