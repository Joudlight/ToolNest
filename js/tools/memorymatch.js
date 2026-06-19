/* =====================================================
   tools/memorymatch.js — Memory Match Card Game
   ===================================================== */

const MM_EMOJI_SETS = {
  animals:  ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐮','🐷','🐙','🦋'],
  islamic:  ['🕌','📿','🤲','🌙','⭐','📖','🕋','🌴','🌿','🌹','🕯️','💎','🌊','🏔️','☀️','🌟'],
  food:     ['🍕','🍔','🌮','🍜','🍣','🍩','🍦','🎂','🍓','🍉','🍋','🥑','🌽','🥕','🍇','🥝'],
  travel:   ['✈️','🗼','🏖️','⛰️','🗺️','🏕️','🚢','🏰','🎡','🌋','🗽','🏯','🎪','🎠','🌉','🏟️'],
};

let mmCards = [], mmFlipped = [], mmMatched = [], mmMoves = 0, mmTimer = null, mmTime = 0, mmGameActive = false, mmDifficulty = 'easy', mmTheme = 'animals', mmBestTime = {};

function buildMemoryMatch() {
  return {
    title: '🧠 Memory Match',
    html: `<div class="btg-container" id="mm-root">
      <!-- Settings -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
        <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;justify-content:center;">
          <span style="font-size:0.75rem;color:var(--muted);">Difficulty:</span>
          ${['easy','medium','hard'].map(d=>`<button onclick="mmSetDiff('${d}')" id="mm-d-${d}" class="btg-btn sec" style="padding:6px 12px;font-size:0.78rem;">${d.charAt(0).toUpperCase()+d.slice(1)}</button>`).join('')}
        </div>
        <div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;justify-content:center;">
          <span style="font-size:0.75rem;color:var(--muted);">Theme:</span>
          ${Object.keys(MM_EMOJI_SETS).map(t=>`<button onclick="mmSetTheme('${t}')" id="mm-t-${t}" class="btg-btn sec" style="padding:6px 12px;font-size:0.78rem;">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}
        </div>
      </div>
      <!-- Stats -->
      <div class="btg-stats">
        <span>Moves: <span class="btg-stat-val" id="mm-moves">0</span></span>
        <span>Time: <span class="btg-stat-val" id="mm-time">0:00</span></span>
        <span>Best: <span class="btg-stat-val" id="mm-best">—</span></span>
        <span>Pairs: <span class="btg-stat-val" id="mm-pairs">0</span>/<span id="mm-total-pairs">0</span></span>
      </div>
      <div class="mem-grid" id="mm-grid" aria-label="Memory card grid"></div>
      <button class="btg-btn" onclick="mmStart()" id="mm-start-btn">▶ Start Game</button>
      <div id="mm-result" style="font-size:0.9rem;color:var(--green);font-weight:600;text-align:center;min-height:24px;" role="alert" aria-live="polite"></div>
    </div>`,
    init: () => { mmSetDiff('easy'); mmSetTheme('animals'); },
  };
}

const MM_CONFIGS = { easy:{ pairs:6, cols:4 }, medium:{ pairs:8, cols:4 }, hard:{ pairs:12, cols:6 } };

function mmSetDiff(d) {
  mmDifficulty = d;
  document.querySelectorAll('[id^="mm-d-"]').forEach(b => { b.style.background = 'var(--surface2)'; b.style.color = 'var(--muted)'; });
  const btn = document.getElementById('mm-d-'+d); if (btn) { btn.style.background = 'var(--accent-glow)'; btn.style.color = 'var(--accent-light)'; }
  const cfg = MM_CONFIGS[d];
  const grid = document.getElementById('mm-grid');
  if (grid) grid.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
  const tp = document.getElementById('mm-total-pairs'); if (tp) tp.textContent = cfg.pairs;
  const best = mmBestTime[d+'-'+mmTheme];
  const bestEl = document.getElementById('mm-best'); if (bestEl) bestEl.textContent = best ? mmFmtTime(best) : '—';
}

function mmSetTheme(t) {
  mmTheme = t;
  document.querySelectorAll('[id^="mm-t-"]').forEach(b => { b.style.background = 'var(--surface2)'; b.style.color = 'var(--muted)'; });
  const btn = document.getElementById('mm-t-'+t); if (btn) { btn.style.background = 'var(--accent-glow)'; btn.style.color = 'var(--accent-light)'; }
}

function mmStart() {
  clearInterval(mmTimer);
  mmFlipped = []; mmMatched = []; mmMoves = 0; mmTime = 0; mmGameActive = true;
  const cfg = MM_CONFIGS[mmDifficulty];
  const emojis = MM_EMOJI_SETS[mmTheme].slice(0, cfg.pairs);
  mmCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5).map((e, i) => ({ id:i, emoji:e, flipped:false, matched:false }));
  mmRender();
  const mv = document.getElementById('mm-moves'); if (mv) mv.textContent = 0;
  const ti = document.getElementById('mm-time');  if (ti) ti.textContent = '0:00';
  const rs = document.getElementById('mm-result'); if (rs) rs.textContent = '';
  const pr = document.getElementById('mm-pairs');  if (pr) pr.textContent = 0;
  const sb = document.getElementById('mm-start-btn'); if (sb) sb.textContent = '🔄 Restart';
  mmTimer = setInterval(() => {
    mmTime++;
    const ti2 = document.getElementById('mm-time'); if (ti2) ti2.textContent = mmFmtTime(mmTime);
  }, 1000);
}

function mmRender() {
  const grid = document.getElementById('mm-grid'); if (!grid) return;
  const cfg = MM_CONFIGS[mmDifficulty];
  grid.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;
  grid.innerHTML = mmCards.map(c => `
    <div class="mem-card ${c.flipped||c.matched?'flipped':''} ${c.matched?'matched':''}"
      onclick="mmFlipCard(${c.id})" role="button" aria-label="${c.matched||c.flipped?c.emoji:'Hidden card'}" tabindex="0"
      onkeydown="if(event.key==='Enter'||event.key===' ')mmFlipCard(${c.id})">
      <div class="card-back" aria-hidden="true">?</div>
      ${c.emoji}
    </div>`).join('');
}

function mmFlipCard(id) {
  if (!mmGameActive) return;
  const card = mmCards[id];
  if (!card || card.flipped || card.matched || mmFlipped.length >= 2) return;
  card.flipped = true;
  mmFlipped.push(id);
  mmRender();
  if (mmFlipped.length === 2) {
    mmMoves++;
    const mv = document.getElementById('mm-moves'); if (mv) mv.textContent = mmMoves;
    const [a, b] = mmFlipped;
    if (mmCards[a].emoji === mmCards[b].emoji) {
      mmCards[a].matched = mmCards[b].matched = true;
      mmMatched.push(a, b);
      mmFlipped = [];
      const pr = document.getElementById('mm-pairs'); if (pr) pr.textContent = mmMatched.length / 2;
      mmRender();
      if (mmMatched.length === mmCards.length) mmWin();
    } else {
      setTimeout(() => {
        mmCards[a].flipped = mmCards[b].flipped = false;
        mmFlipped = [];
        mmRender();
      }, 900);
    }
  }
}

function mmWin() {
  clearInterval(mmTimer);
  mmGameActive = false;
  const key = mmDifficulty + '-' + mmTheme;
  if (!mmBestTime[key] || mmTime < mmBestTime[key]) {
    mmBestTime[key] = mmTime;
    const bestEl = document.getElementById('mm-best'); if (bestEl) bestEl.textContent = mmFmtTime(mmTime);
  }
  const rs = document.getElementById('mm-result');
  if (rs) rs.textContent = `🎉 You matched all pairs in ${mmFmtTime(mmTime)} with ${mmMoves} moves!`;
}

function mmFmtTime(s) { return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60; }
