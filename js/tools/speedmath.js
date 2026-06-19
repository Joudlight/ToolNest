/* =====================================================
   tools/speedmath.js — Speed Math Brain Trainer
   ===================================================== */

let smScore = 0, smStreak = 0, smBest = 0, smTimeLeft = 0, smTimer = null, smAnswer = 0, smDifficulty = 'easy', smActive = false;

function buildSpeedMath() {
  return {
    title: '⚡ Speed Math',
    html: `<div class="btg-container" id="sm-root">
      <!-- Difficulty -->
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;">
        <span style="font-size:0.75rem;color:var(--muted);">Difficulty:</span>
        ${['easy','medium','hard','insane'].map(d=>`<button onclick="smSetDiff('${d}')" id="sm-d-${d}" class="btg-btn sec" style="padding:6px 12px;font-size:0.78rem;">${d.charAt(0).toUpperCase()+d.slice(1)}</button>`).join('')}
      </div>
      <!-- Timer bar -->
      <div style="width:100%;max-width:300px;height:8px;background:var(--surface2);border-radius:4px;overflow:hidden;">
        <div id="sm-timer-bar" style="height:100%;background:var(--accent);border-radius:4px;width:100%;transition:width 0.1s linear;"></div>
      </div>
      <!-- Stats -->
      <div class="btg-stats">
        <span>Score: <span class="btg-stat-val" id="sm-score">0</span></span>
        <span>Time: <span class="btg-stat-val" id="sm-time">—</span>s</span>
        <span>Streak: <span class="btg-stat-val" id="sm-streak">0</span>🔥</span>
        <span>Best: <span class="btg-stat-val" id="sm-best">0</span></span>
      </div>
      <!-- Problem -->
      <div class="math-problem" id="sm-problem" aria-live="polite">Ready?</div>
      <!-- Input -->
      <input class="math-input" id="sm-input" type="number" inputmode="numeric"
        placeholder="?" disabled onkeydown="if(event.key==='Enter')smSubmit()"
        aria-label="Enter your answer" autocomplete="off" autocorrect="off">
      <!-- Feedback -->
      <div class="math-feedback" id="sm-feedback" role="alert" aria-live="polite"></div>
      <!-- Buttons -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
        <button class="btg-btn" onclick="smStart()" id="sm-start-btn">▶ Start</button>
        <button class="btg-btn sec" onclick="smSubmit()" id="sm-submit-btn" disabled>Submit ↵</button>
      </div>
      <!-- High score board -->
      <div id="sm-history" style="width:100%;max-width:340px;"></div>
    </div>`,
    init: () => { smSetDiff('easy'); smLoadBest(); },
  };
}

const SM_CONFIGS = {
  easy:   { ops:['+','-'],        maxN:20,  time:30, pointsPerQ:10 },
  medium: { ops:['+','-','×'],    maxN:50,  time:30, pointsPerQ:15 },
  hard:   { ops:['+','-','×','÷'],maxN:100, time:25, pointsPerQ:20 },
  insane: { ops:['+','-','×','÷'],maxN:200, time:20, pointsPerQ:30 },
};

function smSetDiff(d) {
  smDifficulty = d;
  document.querySelectorAll('[id^="sm-d-"]').forEach(b => { b.style.background='var(--surface2)'; b.style.color='var(--muted)'; });
  const btn = document.getElementById('sm-d-'+d); if (btn) { btn.style.background='var(--accent-glow)'; btn.style.color='var(--accent-light)'; }
}

function smLoadBest() {
  smBest = parseInt(localStorage.getItem('sm_best_'+smDifficulty) || '0');
  const be = document.getElementById('sm-best'); if (be) be.textContent = smBest;
}

function smGenProblem() {
  const cfg = SM_CONFIGS[smDifficulty];
  const op  = cfg.ops[Math.floor(Math.random() * cfg.ops.length)];
  let a, b;
  if (op === '+') { a = Math.floor(Math.random()*cfg.maxN)+1; b = Math.floor(Math.random()*cfg.maxN)+1; smAnswer = a+b; }
  else if (op === '-') { a = Math.floor(Math.random()*cfg.maxN)+1; b = Math.floor(Math.random()*a)+1; smAnswer = a-b; }
  else if (op === '×') { a = Math.floor(Math.random()*12)+1; b = Math.floor(Math.random()*12)+1; smAnswer = a*b; }
  else { b = Math.floor(Math.random()*11)+2; smAnswer = Math.floor(Math.random()*10)+1; a = b*smAnswer; }
  const pr = document.getElementById('sm-problem'); if (pr) pr.textContent = `${a} ${op} ${b} = ?`;
  const inp = document.getElementById('sm-input'); if (inp) { inp.value=''; inp.focus(); }
  const fb = document.getElementById('sm-feedback'); if (fb) { fb.textContent=''; fb.className='math-feedback'; }
}

function smStart() {
  clearInterval(smTimer);
  smScore = 0; smStreak = 0; smActive = true;
  smLoadBest();
  const cfg = SM_CONFIGS[smDifficulty];
  smTimeLeft = cfg.time;
  const sc = document.getElementById('sm-score');  if (sc) sc.textContent = 0;
  const st = document.getElementById('sm-streak'); if (st) st.textContent = 0;
  const inp = document.getElementById('sm-input'); if (inp) inp.disabled = false;
  const sub = document.getElementById('sm-submit-btn'); if (sub) sub.disabled = false;
  const sb  = document.getElementById('sm-start-btn'); if (sb) sb.textContent = '🔄 Restart';
  smGenProblem();
  smTimer = setInterval(() => {
    smTimeLeft -= 0.1;
    const ti = document.getElementById('sm-time'); if (ti) ti.textContent = Math.ceil(smTimeLeft);
    const bar = document.getElementById('sm-timer-bar'); if (bar) bar.style.width = (smTimeLeft/cfg.time*100)+'%';
    if (smTimeLeft <= 5) { if (bar) bar.style.background = 'var(--coral)'; }
    else { if (bar) bar.style.background = 'var(--accent)'; }
    if (smTimeLeft <= 0) smEnd();
  }, 100);
}

function smSubmit() {
  if (!smActive) return;
  const inp = document.getElementById('sm-input'); if (!inp) return;
  const val = parseInt(inp.value);
  if (isNaN(val)) return;
  const fb = document.getElementById('sm-feedback');
  const cfg = SM_CONFIGS[smDifficulty];
  if (val === smAnswer) {
    smStreak++;
    const bonus = Math.floor(smStreak/3);
    smScore += cfg.pointsPerQ + bonus*5;
    if (fb) { fb.textContent = `✓ +${cfg.pointsPerQ + bonus*5}${bonus?` (${bonus*5} streak bonus!)`:''}`; fb.className = 'math-feedback correct'; }
    // Add time bonus for streaks
    if (smStreak % 5 === 0) { smTimeLeft = Math.min(smTimeLeft + 5, cfg.time); if (fb) fb.textContent += ' +5s'; }
  } else {
    smStreak = 0;
    if (fb) { fb.textContent = `✗ Answer was ${smAnswer}`; fb.className = 'math-feedback wrong'; }
  }
  const sc = document.getElementById('sm-score');  if (sc) sc.textContent = smScore;
  const st = document.getElementById('sm-streak'); if (st) st.textContent = smStreak;
  smGenProblem();
}

function smEnd() {
  clearInterval(smTimer); smActive = false;
  const inp = document.getElementById('sm-input'); if (inp) { inp.disabled = true; inp.value = ''; }
  const sub = document.getElementById('sm-submit-btn'); if (sub) sub.disabled = true;
  const pr  = document.getElementById('sm-problem'); if (pr) pr.textContent = 'Time\'s up!';
  if (smScore > smBest) { smBest = smScore; localStorage.setItem('sm_best_'+smDifficulty, smBest); }
  const be = document.getElementById('sm-best'); if (be) be.textContent = smBest;
  const hist = document.getElementById('sm-history');
  if (hist) {
    const scores = JSON.parse(localStorage.getItem('sm_history_'+smDifficulty) || '[]');
    scores.unshift({ score: smScore, date: new Date().toLocaleDateString() });
    scores.splice(5);
    localStorage.setItem('sm_history_'+smDifficulty, JSON.stringify(scores));
    hist.innerHTML = `<div style="text-align:center;margin-top:12px;"><div style="font-size:0.75rem;color:var(--muted);margin-bottom:6px;">📊 Recent Scores (${smDifficulty})</div>${scores.map((s,i)=>`<div style="display:flex;justify-content:space-between;font-size:0.8rem;padding:4px 8px;background:${i===0?'var(--accent-glow)':'var(--surface2)'};border-radius:6px;margin-bottom:3px;"><span>${i===0?'🏆 New!':s.date}</span><span style="font-weight:700;color:${i===0?'var(--accent-light)':'var(--text)'};">${s.score}</span></div>`).join('')}</div>`;
  }
  const fb = document.getElementById('sm-feedback'); if (fb) { fb.textContent = `Game over! Score: ${smScore}${smScore===smBest?' 🏆 New Best!':''}`; fb.className = 'math-feedback correct'; }
}
