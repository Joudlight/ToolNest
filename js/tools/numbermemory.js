/* =====================================================
   tools/numbermemory.js — Number Memory Game
   ===================================================== */

let nmSequence = [], nmLevel = 1, nmPhase = 'idle', nmBest = 0, nmTimer = null;

function buildNumberMemory() {
  return {
    title: '🔢 Number Memory',
    html: `<div class="btg-container" id="nm-root">
      <!-- Stats -->
      <div class="btg-stats">
        <span>Level: <span class="btg-stat-val" id="nm-level">1</span></span>
        <span>Best: <span class="btg-stat-val" id="nm-best">0</span> digits</span>
      </div>
      <!-- Number display -->
      <div class="num-seq-display" id="nm-display" aria-live="assertive" aria-atomic="true">—</div>
      <!-- Status message -->
      <div style="font-size:0.88rem;color:var(--muted);text-align:center;min-height:22px;" id="nm-status" aria-live="polite">Press Start to begin</div>
      <!-- Input (hidden until recall phase) -->
      <input class="num-seq-input" id="nm-input" type="number" inputmode="numeric"
        placeholder="Enter the sequence" style="display:none;"
        onkeydown="if(event.key==='Enter')nmSubmit()"
        aria-label="Enter the number sequence you saw" autocomplete="off">
      <!-- Feedback -->
      <div class="math-feedback" id="nm-feedback" role="alert" aria-live="polite" style="text-align:center;"></div>
      <!-- Buttons -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
        <button class="btg-btn" onclick="nmStart()" id="nm-start-btn">▶ Start</button>
        <button class="btg-btn sec" onclick="nmSubmit()" id="nm-submit-btn" style="display:none;">Submit ↵</button>
      </div>
      <!-- High score history -->
      <div id="nm-history" style="width:100%;max-width:300px;"></div>
    </div>`,
    init: () => {
      nmBest = parseInt(localStorage.getItem('nm_best') || '0');
      const be = document.getElementById('nm-best'); if (be) be.textContent = nmBest;
      nmRenderHistory();
    },
  };
}

function nmStart() {
  clearTimeout(nmTimer);
  nmLevel = 1; nmPhase = 'showing';
  const lv = document.getElementById('nm-level'); if (lv) lv.textContent = 1;
  const fb = document.getElementById('nm-feedback'); if (fb) { fb.textContent = ''; fb.className = 'math-feedback'; }
  const sb = document.getElementById('nm-start-btn'); if (sb) sb.textContent = '🔄 Restart';
  nmRound();
}

function nmRound() {
  nmPhase = 'showing';
  // Generate sequence of nmLevel digits
  nmSequence = Array.from({ length: nmLevel }, () => Math.floor(Math.random() * 10));
  const disp   = document.getElementById('nm-display');
  const status = document.getElementById('nm-status');
  const input  = document.getElementById('nm-input');
  const sub    = document.getElementById('nm-submit-btn');
  if (input) { input.style.display = 'none'; input.value = ''; }
  if (sub)   sub.style.display = 'none';
  if (fb)    { const fb = document.getElementById('nm-feedback'); fb.textContent = ''; }

  // Countdown then show number
  let countdown = 3;
  if (status) status.textContent = `Get ready… ${countdown}`;
  const countTimer = setInterval(() => {
    countdown--;
    if (countdown > 0) { if (status) status.textContent = `Get ready… ${countdown}`; }
    else {
      clearInterval(countTimer);
      // Show the sequence
      if (disp)   disp.textContent = nmSequence.join('');
      if (status) status.textContent = `Memorise! (${nmLevel} digit${nmLevel>1?'s':''})`;
      // Display duration grows with level: base 1.5s + 0.4s per digit
      const showDuration = 1500 + nmLevel * 400;
      nmTimer = setTimeout(() => {
        if (disp)   disp.textContent = '?';
        if (status) status.textContent = 'Now type what you saw!';
        if (input)  { input.style.display = ''; setTimeout(() => input.focus(), 50); }
        if (sub)    sub.style.display = '';
        nmPhase = 'recall';
      }, showDuration);
    }
  }, 1000);
}

// need to declare fb at top scope so countTimer inner closure can access
const fb = null; // shadowed locally below

function nmSubmit() {
  if (nmPhase !== 'recall') return;
  const input = document.getElementById('nm-input'); if (!input) return;
  const val   = input.value.trim();
  const correct = nmSequence.join('');
  const feedback = document.getElementById('nm-feedback');
  const sub   = document.getElementById('nm-submit-btn');

  if (val === correct) {
    nmLevel++;
    if (nmLevel - 1 > nmBest) {
      nmBest = nmLevel - 1;
      localStorage.setItem('nm_best', nmBest);
      const be = document.getElementById('nm-best'); if (be) be.textContent = nmBest;
      nmSaveHistory(nmBest);
      nmRenderHistory();
    }
    if (feedback) { feedback.textContent = `✓ Correct! Level ${nmLevel} — ${nmLevel} digits`; feedback.className = 'math-feedback correct'; }
    const lv = document.getElementById('nm-level'); if (lv) lv.textContent = nmLevel;
    if (sub) sub.style.display = 'none';
    setTimeout(nmRound, 1200);
  } else {
    nmPhase = 'idle';
    if (feedback) { feedback.textContent = `✗ Wrong! The sequence was: ${correct}`; feedback.className = 'math-feedback wrong'; }
    const disp = document.getElementById('nm-display'); if (disp) disp.textContent = correct;
    if (sub) sub.style.display = 'none';
    if (input) input.style.display = 'none';
    const status = document.getElementById('nm-status');
    if (status) status.textContent = `Game over! You reached level ${nmLevel} (${nmLevel} digits).`;
    // Save score
    if (nmLevel > nmBest) {
      nmBest = nmLevel;
      localStorage.setItem('nm_best', nmBest);
      const be = document.getElementById('nm-best'); if (be) be.textContent = nmBest;
    }
    nmSaveHistory(nmLevel);
    nmRenderHistory();
  }
}

function nmSaveHistory(level) {
  const arr = JSON.parse(localStorage.getItem('nm_history') || '[]');
  arr.unshift({ level, date: new Date().toLocaleDateString() });
  arr.splice(5);
  localStorage.setItem('nm_history', JSON.stringify(arr));
}

function nmRenderHistory() {
  const hist = document.getElementById('nm-history'); if (!hist) return;
  const arr = JSON.parse(localStorage.getItem('nm_history') || '[]');
  if (!arr.length) return;
  hist.innerHTML = `<div style="margin-top:14px;"><div style="font-size:0.75rem;color:var(--muted);margin-bottom:6px;text-align:center;">📊 Recent Games</div>
    ${arr.map((r, i) => `<div style="display:flex;justify-content:space-between;font-size:0.8rem;padding:4px 8px;background:${i===0?'var(--accent-glow)':'var(--surface2)'};border-radius:6px;margin-bottom:3px;">
      <span>${i===0?'🏆 Latest':r.date}</span>
      <span style="font-weight:700;color:${i===0?'var(--accent-light)':'var(--text)'};">${r.level} digits</span>
    </div>`).join('')}
  </div>`;
}
