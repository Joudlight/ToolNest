/* =====================================================
   tools/tasbeeh.js — Digital Tasbeeh Counter
   Enhanced: Presets, Favorites, Stats & More
   (Polished UX with collapsible guide, custom target inline,
    keyboard/click support, hold hint & completion glow)
   ===================================================== */

function buildTasbeeh() {
  return {
    title: '\u{1F4FF} Tasbeeh Counter',
    html: `<div id="tsb-root" role="application" style="display:flex;flex-direction:column;align-items:center;gap:0;padding:0.5rem 0;">
      <!-- Action Bar -->
      <div style="display:flex;gap:6px;margin-bottom:6px;width:100%;justify-content:center;flex-wrap:wrap;">
        <button id="tsb-fav-filter-btn" onclick="tsbToggleFavFilter()" aria-pressed="false" style="padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.8rem;cursor:pointer;min-height:34px;transition:all 0.2s;">\u{2B50} Favorites</button>
        <button onclick="tsbOpenPresetModal()" style="padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.8rem;cursor:pointer;min-height:34px;">\u{2795} Preset</button>
        <button onclick="tsbShowStats()" style="padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.8rem;cursor:pointer;min-height:34px;">\u{1F4CA} Stats</button>
      </div>
      <!-- Dhikr Selector -->
      <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:6px;width:100%;justify-content:center;flex-wrap:wrap;" id="tsb-dhikr-row"></div>
      <!-- Custom Dhikr + Save as Preset -->
      <div style="margin:10px 0 4px;width:100%;max-width:340px;display:flex;gap:6px;">
        <input id="tsb-custom-input" class="task-input" placeholder="Custom dhikr text\u2026" style="flex:1;font-size:15px;" oninput="tsbSetCustom(this.value)" aria-label="Custom dhikr text">
        <button onclick="tsbSaveCurrentAsPreset()" title="Save as preset" style="padding:6px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);cursor:pointer;font-size:0.8rem;white-space:nowrap;min-height:38px;" aria-label="Save custom dhikr as preset">\u{1F4BE}</button>
      </div>
      <!-- Arabic Display -->
      <div id="tsb-arabic" lang="ar" dir="rtl" style="font-family:var(--font-ar);font-size:clamp(1.3rem,6vw,2rem);color:var(--amber);margin:10px 0 4px;text-align:center;line-height:1.7;min-height:2.5em;padding:0 8px;"></div>
      <!-- Counter Ring (with completion glow) -->
      <div style="position:relative;margin:8px 0;">
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <circle cx="90" cy="90" r="80" fill="none" stroke="var(--border)" stroke-width="10"/>
          <circle id="tsb-ring" cx="90" cy="90" r="80" fill="none" stroke="var(--accent)" stroke-width="10"
            stroke-dasharray="502.65" stroke-dashoffset="502.65"
            stroke-linecap="round" transform="rotate(-90 90 90)"
            style="transition:stroke-dashoffset 0.3s ease, stroke 0.3s;"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div id="tsb-count" aria-live="polite" style="font-size:clamp(2.5rem,10vw,3.5rem);font-weight:700;color:var(--text);line-height:1;font-variant-numeric:tabular-nums;">0</div>
          <div id="tsb-target-label" style="font-size:0.75rem;color:var(--muted);margin-top:2px;">of <span id="tsb-target-display">33</span></div>
        </div>
      </div>
      <!-- Tap Button (click, touch hold & keyboard) -->
      <button id="tsb-tap-btn" onclick="tsbTap()"
        style="width:clamp(130px,40vw,160px);height:clamp(130px,40vw,160px);border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-light));border:none;color:white;font-size:clamp(2rem,8vw,2.8rem);cursor:pointer;box-shadow:0 8px 32px var(--accent-glow-strong),0 0 0 6px var(--accent-glow);transition:transform 0.1s ease,box-shadow 0.1s ease;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;"
        aria-label="Tap to count (Space/Enter also works)" tabindex="0">\u{1F4FF}</button>
      <div style="font-size:0.7rem;color:var(--muted);margin-top:4px;">\u{1F446} Tap / hold · \u{2328} Space / Enter to count</div>
      <!-- Stats Row -->
      <div style="display:flex;gap:20px;margin-top:16px;text-align:center;">
        <div><div style="font-size:1.4rem;font-weight:700;color:var(--accent-light);" id="tsb-rounds">0</div><div style="font-size:0.72rem;color:var(--muted);">Rounds</div></div>
        <div><div style="font-size:1.4rem;font-weight:700;color:var(--green);" id="tsb-total-today">0</div><div style="font-size:0.72rem;color:var(--muted);">Today</div></div>
        <div><div style="font-size:1.4rem;font-weight:700;color:var(--amber);" id="tsb-streak">0</div><div style="font-size:0.72rem;color:var(--muted);">Day Streak \u{1F525}</div></div>
      </div>
      <!-- Target Selector (inline custom target) -->
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;justify-content:center;">
        <span style="font-size:0.78rem;color:var(--muted);align-self:center;">Target:</span>
        ${[33,99,100,1000].map(n=>`<button onclick="tsbSetTarget(${n})" class="tsb-target-btn" id="tsb-t-${n}" style="padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.8rem;cursor:pointer;transition:all 0.2s;min-height:34px;">${n}</button>`).join('')}
        <span id="tsb-custom-target-wrap" style="display:inline-flex;gap:4px;">
          <button id="tsb-custom-target-btn" onclick="tsbToggleCustomTargetInput()" style="padding:6px 14px;border-radius:999px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.8rem;cursor:pointer;min-height:34px;">Custom</button>
          <input id="tsb-custom-target-input" type="number" min="1" style="display:none;width:70px;padding:4px 8px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.8rem;" onchange="tsbSetTarget(this.value)" onblur="tsbHideCustomTargetInput()" aria-label="Custom target number">
        </span>
      </div>
      <!-- Controls -->
      <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center;">
        <button onclick="tsbUndo()" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.82rem;cursor:pointer;min-height:38px;" aria-label="Undo">\u{21A9} Undo</button>
        <button onclick="tsbReset()" style="padding:8px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface2);color:var(--muted);font-size:0.82rem;cursor:pointer;min-height:38px;" aria-label="Reset">\u{1F504} Reset</button>
        <button onclick="tsbResetAll()" style="padding:8px 16px;border-radius:8px;border:1px solid rgba(248,113,113,0.3);background:rgba(248,113,113,0.07);color:var(--coral);font-size:0.82rem;cursor:pointer;min-height:38px;" aria-label="Clear all data">\u{1F5D1} Clear All</button>
      </div>
      <!-- Collapsible Post-prayer Guide -->
      <div style="margin-top:18px;width:100%;">
        <button id="tsb-guide-toggle-btn" onclick="tsbToggleGuide()" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:12px;font-size:0.85rem;font-weight:600;color:var(--accent-light);cursor:pointer;transition:all 0.2s;">
          <span>\u{1F54C} Post-Prayer Tasbeeh Guide</span>
          <span id="tsb-guide-arrow" style="transition:transform 0.2s;">\u{25BC}</span>
        </button>
        <div id="tsb-guide-content" style="display:none;background:var(--surface2);border:1px solid var(--border);border-radius:0 0 12px 12px;padding:14px;border-top:none;margin-top:-1px;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
            ${[['\u{633}\u{628}\u{62D}\u{627}\u{646} \u{627}\u{644}\u{644}\u{647}','Subhanallah','33\u{D7}','var(--teal)'],['\u{627}\u{644}\u{62D}\u{645}\u{62F} \u{644}\u{644}\u{647}','Alhamdulillah','33\u{D7}','var(--green)'],['\u{627}\u{644}\u{644}\u{647} \u{623}\u{643}\u{628}\u{631}','Allahu Akbar','33\u{D7}','var(--amber)']].map(([ar,en,count,col])=>`
              <div style="background:var(--surface);border-radius:8px;padding:8px 4px;border:1px solid var(--border);">
                <div style="font-family:var(--font-ar);font-size:0.95rem;color:${col};margin-bottom:2px;" lang="ar" dir="rtl">${ar}</div>
                <div style="font-size:0.65rem;color:var(--muted);">${en}</div>
                <div style="font-size:0.8rem;font-weight:700;color:${col};margin-top:3px;">${count}</div>
              </div>`).join('')}
          </div>
          <div style="text-align:center;margin-top:10px;font-family:var(--font-ar);font-size:0.9rem;direction:rtl;color:var(--muted-light);" lang="ar" dir="rtl">\u{644}\u{627} \u{625}\u{644}\u{647} \u{625}\u{644}\u{627} \u{627}\u{644}\u{644}\u{647} \u{648}\u{62D}\u{62F}\u{647} \u{644}\u{627} \u{634}\u{631}\u{64A}\u{643} \u{644}\u{647}... <span style="font-size:0.7rem;">(1\u{D7})</span></div>
          <div style="text-align:center;font-size:0.7rem;color:var(--muted-light);">La ilaha illallah wahdahu... (1\u{D7})</div>
        </div>
      </div>
      <div id="tsb-vibe" style="font-size:0.85rem;color:var(--green);font-weight:500;min-height:24px;margin-top:6px;text-align:center;transition:opacity 0.5s;opacity:0;"></div>
    </div>

    <!-- Preset Manager Modal (unchanged) -->
    <div id="tsb-preset-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center;padding:16px;" onclick="if(event.target===this)tsbClosePresetModal()">
      <div style="background:var(--surface);border-radius:16px;padding:20px;max-width:420px;width:100%;max-height:80vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="margin:0;font-size:1.1rem;">My Presets</h3>
          <button onclick="tsbClosePresetModal()" style="background:none;border:none;color:var(--muted);font-size:1.4rem;cursor:pointer;padding:4px;" aria-label="Close">\u{2715}</button>
        </div>
        <div id="tsb-preset-list" style="margin-bottom:12px;min-height:40px;"></div>
        <hr style="border-color:var(--border);margin:12px 0;">
        <div style="font-size:0.85rem;font-weight:600;color:var(--text);margin-bottom:8px;">Add New Preset</div>
        <input id="tsb-p-name" placeholder="Name (e.g. Morning Dhikr)" style="width:100%;margin-bottom:6px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.85rem;box-sizing:border-box;" aria-label="Preset name">
        <input id="tsb-p-arabic" placeholder="Arabic text" style="width:100%;margin-bottom:6px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:var(--font-ar);direction:rtl;font-size:0.85rem;box-sizing:border-box;" aria-label="Arabic text">
        <input id="tsb-p-trans" placeholder="Transliteration (optional)" style="width:100%;margin-bottom:6px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.85rem;box-sizing:border-box;" aria-label="Transliteration">
        <input id="tsb-p-target" type="number" placeholder="Default target (e.g. 33)" value="33" style="width:100%;margin-bottom:10px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:0.85rem;box-sizing:border-box;" aria-label="Target count">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="tsb-preset-form-add-btn" onclick="tsbAddPreset()" style="flex:1;padding:10px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;min-width:80px;">Add</button>
          <button onclick="tsbImportPresets()" style="padding:10px 16px;background:var(--surface2);color:var(--muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:0.85rem;">\u{1F4E5} Import</button>
          <button onclick="tsbExportPresets()" style="padding:10px 16px;background:var(--surface2);color:var(--muted);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:0.85rem;">\u{1F4E4} Export</button>
        </div>
      </div>
    </div>

    <!-- Stats Modal (unchanged) -->
    <div id="tsb-stats-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center;padding:16px;" onclick="if(event.target===this)tsbCloseStats()">
      <div style="background:var(--surface);border-radius:16px;padding:20px;max-width:400px;width:100%;max-height:80vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:1.1rem;">\u{1F4CA} Stats & History</h3>
          <button onclick="tsbCloseStats()" style="background:none;border:none;color:var(--muted);font-size:1.4rem;cursor:pointer;padding:4px;" aria-label="Close">\u{2715}</button>
        </div>
        <div id="tsb-stats-content"></div>
      </div>
    </div>`,
    init: tsbInit,
  };
}

/* =====================================================
   Built-in Dhikr List
   ===================================================== */
const TSB_BUILTIN = [
  { id:'b0', label:'\u{633}\u{628}\u{62D}\u{627}\u{646} \u{627}\u{644}\u{644}\u{647}', sub:'Subhanallah', target:33 },
  { id:'b1', label:'\u{627}\u{644}\u{62D}\u{645}\u{62F} \u{644}\u{644}\u{647}', sub:'Alhamdulillah', target:33 },
  { id:'b2', label:'\u{627}\u{644}\u{644}\u{647} \u{623}\u{643}\u{628}\u{631}', sub:'Allahu Akbar', target:33 },
  { id:'b3', label:'\u{644}\u{627} \u{625}\u{644}\u{647} \u{625}\u{644}\u{627} \u{627}\u{644}\u{644}\u{647}', sub:'La ilaha illallah', target:99 },
  { id:'b4', label:'\u{623}\u{633}\u{62A}\u{63A}\u{641}\u{631} \u{627}\u{644}\u{644}\u{647}', sub:'Astaghfirullah', target:100 },
  { id:'b5', label:'\u{627}\u{644}\u{644}\u{647}\u{645} \u{635}\u{644} \u{639}\u{644}\u{649} \u{627}\u{644}\u{646}\u{628}\u{64A}', sub:'Salawat', target:100 },
  { id:'b6', label:'Custom', sub:'', target:33 },
];

/* =====================================================
   State Variables
   ===================================================== */
let tsbCount = 0;
let tsbRoundsN = 0;
let tsbTarget = 33;
let tsbSelectedDhikrId = 'b0';
let tsbCustomText = '';
let tsbHistory = [];
let tsbPresets = [];
let tsbFavorites = [];
let tsbShowFavoritesOnly = false;
let tsbEditingPresetId = null;
let tsbGuideExpanded = false; // default collapsed

/* =====================================================
   Helpers
   ===================================================== */
function tsbGetAllDhikr() {
  return [...TSB_BUILTIN, ...tsbPresets];
}

function tsbGetDhikrById(id) {
  return tsbGetAllDhikr().find(d => d.id === id);
}

function tsbIsFavorite(id) {
  return tsbFavorites.includes(id);
}

function tsbIsBuiltin(id) {
  return id.startsWith('b');
}

function tsbGenId() {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

/* =====================================================
   Init
   ===================================================== */
function tsbInit() {
  tsbLoadPresets();
  tsbLoadFavorites();
  tsbLoadGuideState();
  const state = JSON.parse(localStorage.getItem('tsb_state_v2') || 'null');
  if (state) {
    tsbCount = state.count || 0;
    tsbRoundsN = state.rounds || 0;
    tsbTarget = state.target || 33;
    tsbSelectedDhikrId = state.dhikrId || 'b0';
    tsbCustomText = state.customText || '';
  } else {
    // Migrate from v1
    const old = JSON.parse(localStorage.getItem('tsb_state') || 'null');
    if (old) {
      tsbCount = old.count || 0;
      tsbRoundsN = old.rounds || 0;
      tsbTarget = old.target || 33;
      tsbSelectedDhikrId = 'b' + (old.dhikr || 0);
    }
  }
  const ci = document.getElementById('tsb-custom-input');
  if (ci) { ci.value = tsbCustomText; ci.style.display = tsbSelectedDhikrId === 'b6' ? 'block' : 'none'; }
  tsbRebuildDhikrRow();
  tsbSetTarget(tsbTarget, false);
  tsbUpdateUI();
  tsbUpdateGuideUI();
  tsbUpdateStreak();
  // Tap button: click, touch hold & keyboard
  const btn = document.getElementById('tsb-tap-btn');
  if (btn) {
    // Touch hold for rapid count (prevents duplicate click on touch devices)
    let holdTimer, intervalTimer;
    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      tsbTap();
      holdTimer = setTimeout(() => {
        intervalTimer = setInterval(tsbTap, 120);
      }, 400);
    }, { passive: false });
    btn.addEventListener('touchend', () => {
      clearTimeout(holdTimer);
      clearInterval(intervalTimer);
    });
    // Keyboard support (Enter / Space)
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tsbTap();
      }
    });
  }
}

/* =====================================================
   Guide Collapse
   ===================================================== */
function tsbLoadGuideState() {
  const stored = localStorage.getItem('tsb_guide_expanded');
  tsbGuideExpanded = stored === 'true';
}

function tsbToggleGuide() {
  tsbGuideExpanded = !tsbGuideExpanded;
  localStorage.setItem('tsb_guide_expanded', tsbGuideExpanded);
  tsbUpdateGuideUI();
}

function tsbUpdateGuideUI() {
  const content = document.getElementById('tsb-guide-content');
  const arrow = document.getElementById('tsb-guide-arrow');
  if (content) content.style.display = tsbGuideExpanded ? 'block' : 'none';
  if (arrow) arrow.style.transform = tsbGuideExpanded ? 'rotate(180deg)' : 'rotate(0)';
}

/* =====================================================
   Dhikr Row Rendering
   ===================================================== */
function tsbRebuildDhikrRow() {
  const row = document.getElementById('tsb-dhikr-row');
  if (!row) return;
  const all = tsbGetAllDhikr();
  const filtered = tsbShowFavoritesOnly ? all.filter(d => tsbIsFavorite(d.id)) : all;
  row.innerHTML = filtered.map(d => {
    const active = d.id === tsbSelectedDhikrId;
    const fav = tsbIsFavorite(d.id);
    const isB6 = d.id === 'b6';
    const isBuilt = d.id.startsWith('b');
    const fontFam = !isB6 && isBuilt ? 'var(--font-ar)' : 'inherit';
    const fontSize = !isB6 && isBuilt ? '0.9rem' : '0.8rem';
    const lang = !isB6 && isBuilt ? 'ar' : '';
    const dir = !isB6 && isBuilt ? 'rtl' : '';
    return `<button onclick="tsbSelectDhikr('${d.id}')" id="tsb-d-${d.id}" 
      style="padding:4px 10px;border-radius:999px;border:1px solid ${active ? 'var(--accent)' : 'var(--border)'};background:${active ? 'var(--accent-glow)' : 'var(--surface2)'};color:${active ? 'var(--accent-light)' : 'var(--muted)'};font-family:${fontFam};font-size:${fontSize};cursor:pointer;white-space:nowrap;flex-shrink:0;min-height:34px;transition:all 0.2s;display:inline-flex;align-items:center;gap:4px;" 
      ${active ? 'aria-pressed="true"' : ''} lang="${lang}" dir="${dir}">
      ${fav ? '\u{2B50} ' : ''}${d.label}
    </button>`;
  }).join('');
  // Update fav filter button state
  const ffb = document.getElementById('tsb-fav-filter-btn');
  if (ffb) {
    ffb.style.background = tsbShowFavoritesOnly ? 'var(--accent-glow)' : 'var(--surface2)';
    ffb.style.color = tsbShowFavoritesOnly ? 'var(--accent-light)' : 'var(--muted)';
    ffb.style.borderColor = tsbShowFavoritesOnly ? 'rgba(124,106,247,0.4)' : 'var(--border)';
    ffb.setAttribute('aria-pressed', tsbShowFavoritesOnly);
  }
}

/* =====================================================
   Dhikr Selection
   ===================================================== */
function tsbSelectDhikr(id) {
  tsbSelectedDhikrId = id;
  const d = tsbGetDhikrById(id);
  if (d && id !== 'b6' && d.target) {
    tsbSetTarget(d.target);
  }
  const ci = document.getElementById('tsb-custom-input');
  if (ci) ci.style.display = id === 'b6' ? 'block' : 'none';
  tsbRebuildDhikrRow();
  tsbUpdateUI();
}

function tsbSetCustom(val) {
  tsbCustomText = val;
  if (tsbSelectedDhikrId === 'b6') tsbUpdateUI();
}

/* =====================================================
   Target (with inline custom input)
   ===================================================== */
function tsbSetTarget(n, save = true) {
  n = parseInt(n);
  if (!n || n < 1) return;
  tsbTarget = n;
  // Highlight predefined buttons
  document.querySelectorAll('.tsb-target-btn').forEach(b => {
    const isActive = parseInt(b.id.replace('tsb-t-', '')) === n;
    b.style.background = isActive ? 'var(--accent-glow)' : 'var(--surface2)';
    b.style.color = isActive ? 'var(--accent-light)' : 'var(--muted)';
    b.style.borderColor = isActive ? 'rgba(124,106,247,0.4)' : 'var(--border)';
  });
  const td = document.getElementById('tsb-target-display');
  if (td) td.textContent = n;
  tsbUpdateRing();
  if (save) tsbSave();
}

function tsbToggleCustomTargetInput() {
  const input = document.getElementById('tsb-custom-target-input');
  const btn = document.getElementById('tsb-custom-target-btn');
  if (!input || !btn) return;
  if (input.style.display === 'none' || input.style.display === '') {
    input.style.display = 'block';
    btn.style.display = 'none';
    input.value = tsbTarget;
    input.focus();
  } else {
    tsbHideCustomTargetInput();
  }
}

function tsbHideCustomTargetInput() {
  const input = document.getElementById('tsb-custom-target-input');
  const btn = document.getElementById('tsb-custom-target-btn');
  if (input && btn) {
    input.style.display = 'none';
    btn.style.display = 'inline-block';
  }
}

/* =====================================================
   Counting
   ===================================================== */
function tsbTap() {
  tsbHistory.push(tsbCount);
  tsbCount++;
  const btn = document.getElementById('tsb-tap-btn');
  if (btn) { btn.style.transform = 'scale(0.93)'; setTimeout(() => btn.style.transform = '', 100); }
  if (tsbCount >= tsbTarget) {
    tsbRoundsN++;
    tsbCount = 0;
    const msgs = ['\u{1F31F} MashaAllah!','\u{2728} SubhanAllah!','\u{1F932} Keep going!','\u{1F4AB} Barakallah!','\u{1F338} Alhamdulillah!'];
    tsbShowVibe(msgs[Math.floor(Math.random() * msgs.length)]);
    // Completion glow on ring
    const ring = document.getElementById('tsb-ring');
    if (ring) {
      ring.style.stroke = 'var(--green)';
      setTimeout(() => { ring.style.stroke = 'var(--accent)'; }, 1000);
    }
  }
  const today = new Date().toDateString();
  const rec = JSON.parse(localStorage.getItem('tsb_daily') || '{}');
  rec[today] = (rec[today] || 0) + 1;
  localStorage.setItem('tsb_daily', JSON.stringify(rec));
  tsbUpdateUI();
  tsbSave();
}

function tsbUndo() {
  if (tsbHistory.length) { tsbCount = tsbHistory.pop(); tsbUpdateUI(); tsbSave(); }
}

function tsbReset() {
  tsbHistory = [];
  tsbCount = 0;
  tsbRoundsN = 0;
  tsbUpdateUI();
  tsbSave();
}

function tsbResetAll() {
  if (!confirm('Clear all Tasbeeh data? This will not delete your presets or favorites.')) return;
  localStorage.removeItem('tsb_state_v2');
  localStorage.removeItem('tsb_state');
  localStorage.removeItem('tsb_daily');
  tsbCount = 0; tsbRoundsN = 0; tsbHistory = [];
  tsbUpdateUI();
}

/* =====================================================
   UI Updates
   ===================================================== */
function tsbUpdateUI() {
  const el = document.getElementById('tsb-count');
  if (el) el.textContent = tsbCount;
  const ar = document.getElementById('tsb-arabic');
  if (ar) {
    const d = tsbGetDhikrById(tsbSelectedDhikrId);
    ar.textContent = tsbSelectedDhikrId === 'b6' ? (tsbCustomText || '\u2026') : (d ? d.label : '');
  }
  const rnd = document.getElementById('tsb-rounds');
  if (rnd) rnd.textContent = tsbRoundsN;
  const today = new Date().toDateString();
  const rec = JSON.parse(localStorage.getItem('tsb_daily') || '{}');
  const tot = document.getElementById('tsb-total-today');
  if (tot) tot.textContent = rec[today] || 0;
  tsbUpdateRing();
  tsbUpdateStreak();
}

function tsbUpdateRing() {
  const ring = document.getElementById('tsb-ring');
  if (!ring) return;
  const pct = Math.min(tsbCount / tsbTarget, 1);
  const circumference = 2 * Math.PI * 80;
  ring.style.strokeDashoffset = circumference * (1 - pct);
}

function tsbUpdateStreak() {
  const rec = JSON.parse(localStorage.getItem('tsb_daily') || '{}');
  let streak = 0, d = new Date();
  while (rec[d.toDateString()]) { streak++; d.setDate(d.getDate() - 1); }
  const el = document.getElementById('tsb-streak');
  if (el) el.textContent = streak;
}

function tsbShowVibe(msg) {
  const el = document.getElementById('tsb-vibe');
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(() => { el.style.opacity = '0'; }, 2500);
}

/* =====================================================
   Presets API
   ===================================================== */
function tsbLoadPresets() {
  try { tsbPresets = JSON.parse(localStorage.getItem('tsb_presets') || '[]'); } catch { tsbPresets = []; }
}

function tsbSavePresets() {
  localStorage.setItem('tsb_presets', JSON.stringify(tsbPresets));
}

function tsbAddPreset() {
  const name = document.getElementById('tsb-p-name').value.trim();
  const arabic = document.getElementById('tsb-p-arabic').value.trim();
  const trans = document.getElementById('tsb-p-trans').value.trim();
  const target = parseInt(document.getElementById('tsb-p-target').value) || 33;
  if (!name && !arabic) { alert('Please enter at least a name or Arabic text.'); return; }
  const label = arabic || name;
  const sub = name || trans || arabic;
  if (tsbEditingPresetId) {
    const idx = tsbPresets.findIndex(p => p.id === tsbEditingPresetId);
    if (idx !== -1) tsbPresets[idx] = { ...tsbPresets[idx], name, label, sub, arabic, trans, target };
    tsbEditingPresetId = null;
    document.getElementById('tsb-preset-form-add-btn').textContent = 'Add';
  } else {
    tsbPresets.push({ id: tsbGenId(), name: name || sub, label, sub, arabic, trans, target, createdAt: Date.now() });
  }
  tsbSavePresets();
  document.getElementById('tsb-p-name').value = '';
  document.getElementById('tsb-p-arabic').value = '';
  document.getElementById('tsb-p-trans').value = '';
  document.getElementById('tsb-p-target').value = '33';
  tsbRenderPresetList();
  tsbRebuildDhikrRow();
  tsbUpdateUI();
}

function tsbEditPreset(id) {
  const p = tsbPresets.find(p => p.id === id);
  if (!p) return;
  document.getElementById('tsb-p-name').value = p.name || '';
  document.getElementById('tsb-p-arabic').value = p.arabic || p.label || '';
  document.getElementById('tsb-p-trans').value = p.trans || p.sub || '';
  document.getElementById('tsb-p-target').value = p.target || 33;
  tsbEditingPresetId = id;
  document.getElementById('tsb-preset-form-add-btn').textContent = 'Update';
}

function tsbDeletePreset(id) {
  if (!confirm('Delete this preset?')) return;
  tsbPresets = tsbPresets.filter(p => p.id !== id);
  tsbFavorites = tsbFavorites.filter(f => f !== id);
  if (tsbSelectedDhikrId === id) {
    tsbSelectedDhikrId = 'b0';
    tsbSelectDhikr('b0');
  }
  tsbSavePresets();
  tsbSaveFavorites();
  tsbRenderPresetList();
  tsbRebuildDhikrRow();
  tsbUpdateUI();
}

function tsbSaveCurrentAsPreset() {
  const text = tsbCustomText.trim();
  if (!text) { alert('Enter some dhikr text first.'); return; }
  const name = prompt('Name for this preset:', text.substring(0, 30));
  if (!name) return;
  if (tsbPresets.some(p => p.label === text || p.name === name)) {
    if (!confirm('A preset with this name/text already exists. Add anyway?')) return;
  }
  tsbPresets.push({ id: tsbGenId(), name, label: text, sub: name, arabic: text, trans: '', target: tsbTarget, createdAt: Date.now() });
  tsbSavePresets();
  tsbRebuildDhikrRow();
  tsbShowVibe('\u{2705} Saved as "' + name + '"');
}

/* =====================================================
   Presets Modal
   ===================================================== */
function tsbOpenPresetModal() {
  document.getElementById('tsb-preset-modal').style.display = 'flex';
  tsbEditingPresetId = null;
  document.getElementById('tsb-preset-form-add-btn').textContent = 'Add';
  document.getElementById('tsb-p-name').value = '';
  document.getElementById('tsb-p-arabic').value = '';
  document.getElementById('tsb-p-trans').value = '';
  document.getElementById('tsb-p-target').value = '33';
  tsbRenderPresetList();
}

function tsbClosePresetModal() {
  document.getElementById('tsb-preset-modal').style.display = 'none';
}

function tsbRenderPresetList() {
  const container = document.getElementById('tsb-preset-list');
  if (!container) return;
  if (!tsbPresets.length) {
    container.innerHTML = '<div style="color:var(--muted);font-size:0.85rem;text-align:center;padding:16px 0;">No custom presets yet. Create one above!</div>';
    return;
  }
  container.innerHTML = tsbPresets.map(p => {
    const fav = tsbIsFavorite(p.id);
    return `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--surface);border:1px solid var(--border);border-radius:10px;margin-bottom:6px;">
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.8rem;font-weight:600;color:var(--text);">${p.name || p.sub}</div>
        <div style="font-size:0.7rem;color:var(--muted);">${p.sub || ''} ${p.target ? '\u2022 ' + p.target + '\u{D7}' : ''}</div>
      </div>
      <button onclick="tsbToggleFav('${p.id}');tsbRenderPresetList();" style="background:none;border:none;cursor:pointer;font-size:0.9rem;padding:4px;" title="Toggle favorite">${fav ? '\u{2B50}' : '\u{2606}'}</button>
      <button onclick="tsbEditPreset('${p.id}')" style="background:none;border:none;cursor:pointer;color:var(--accent-light);font-size:0.9rem;padding:4px;" title="Edit">\u{270F}</button>
      <button onclick="tsbDeletePreset('${p.id}')" style="background:none;border:none;cursor:pointer;color:var(--coral);font-size:0.9rem;padding:4px;" title="Delete">\u{2716}</button>
    </div>`;
  }).join('');
}

/* =====================================================
   Favorites
   ===================================================== */
function tsbLoadFavorites() {
  try { tsbFavorites = JSON.parse(localStorage.getItem('tsb_favorites') || '[]'); } catch { tsbFavorites = []; }
}

function tsbSaveFavorites() {
  localStorage.setItem('tsb_favorites', JSON.stringify(tsbFavorites));
}

function tsbToggleFav(id) {
  const idx = tsbFavorites.indexOf(id);
  idx === -1 ? tsbFavorites.push(id) : tsbFavorites.splice(idx, 1);
  tsbSaveFavorites();
  tsbRebuildDhikrRow();
  tsbSave();
}

function tsbToggleFavFilter() {
  tsbShowFavoritesOnly = !tsbShowFavoritesOnly;
  tsbRebuildDhikrRow();
}

/* =====================================================
   Import / Export
   ===================================================== */
function tsbExportPresets() {
  if (!tsbPresets.length) { alert('No presets to export.'); return; }
  const data = JSON.stringify({ presets: tsbPresets, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasbeeh-presets.json';
  a.click();
  URL.revokeObjectURL(url);
}

function tsbImportPresets() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        const imported = Array.isArray(data.presets) ? data.presets : (Array.isArray(data) ? data : []);
        if (!imported.length) { alert('No valid presets found in file.'); return; }
        const added = imported.filter(p => p.label || p.name).map(p => ({
          id: tsbGenId(),
          name: p.name || p.sub || p.label || 'Imported',
          label: p.label || p.arabic || p.name || '',
          sub: p.sub || p.name || '',
          arabic: p.arabic || p.label || '',
          trans: p.trans || '',
          target: p.target || 33,
          createdAt: Date.now(),
        }));
        tsbPresets.push(...added);
        tsbSavePresets();
        tsbRenderPresetList();
        tsbRebuildDhikrRow();
        tsbShowVibe('\u{2705} Imported ' + added.length + ' preset(s)');
      } catch { alert('Invalid file format.'); }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* =====================================================
   Stats Modal
   ===================================================== */
function tsbShowStats() {
  const modal = document.getElementById('tsb-stats-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  tsbRenderStats();
}

function tsbCloseStats() {
  document.getElementById('tsb-stats-modal').style.display = 'none';
}

function tsbRenderStats() {
  const container = document.getElementById('tsb-stats-content');
  if (!container) return;
  const rec = JSON.parse(localStorage.getItem('tsb_daily') || '{}');
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const count = rec[key] || 0;
    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
    days.push({ label: i === 0 ? 'Today' : dayName, count, key });
  }
  const maxCount = Math.max(...days.map(d => d.count), 1);
  const totalWeek = days.reduce((s, d) => s + d.count, 0);
  const totalAll = Object.values(rec).reduce((s, v) => s + v, 0);
  const streak = parseInt(document.getElementById('tsb-streak')?.textContent || '0');

  let html = `<div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;justify-content:center;">
    <div style="background:var(--surface2);border-radius:10px;padding:10px 14px;text-align:center;flex:1;min-width:80px;">
      <div style="font-size:1.1rem;font-weight:700;color:var(--accent-light);">${totalAll}</div>
      <div style="font-size:0.7rem;color:var(--muted);">Total All Time</div>
    </div>
    <div style="background:var(--surface2);border-radius:10px;padding:10px 14px;text-align:center;flex:1;min-width:80px;">
      <div style="font-size:1.1rem;font-weight:700;color:var(--green);">${totalWeek}</div>
      <div style="font-size:0.7rem;color:var(--muted);">This Week</div>
    </div>
    <div style="background:var(--surface2);border-radius:10px;padding:10px 14px;text-align:center;flex:1;min-width:80px;">
      <div style="font-size:1.1rem;font-weight:700;color:var(--amber);">${streak}</div>
      <div style="font-size:0.7rem;color:var(--muted);">Day Streak</div>
    </div>
  </div>`;

  html += `<div style="font-size:0.8rem;font-weight:600;color:var(--muted);margin-bottom:8px;">Last 7 Days</div>
  <div style="display:flex;gap:6px;align-items:end;height:90px;padding:4px 0;">`;
  days.forEach(d => {
    const pct = Math.max((d.count / maxCount) * 100, 4);
    html += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:end;">
      <div style="font-size:0.65rem;color:var(--muted);font-weight:600;">${d.count}</div>
      <div style="width:100%;border-radius:6px 6px 0 0;background:${d.label === 'Today' ? 'var(--accent-light)' : 'var(--accent-glow)'};height:${pct}%;transition:height 0.3s;min-height:4px;"></div>
      <div style="font-size:0.6rem;color:var(--muted);">${d.label}</div>
    </div>`;
  });
  html += `</div>`;

  const dhikrCounts = tsbGetAllDhikr().filter(d => d.id !== 'b6');
  if (dhikrCounts.length > 0) {
    html += `<div style="font-size:0.8rem;font-weight:600;color:var(--muted);margin-top:16px;margin-bottom:8px;">Dhikr List</div>
    <div style="max-height:150px;overflow-y:auto;">`;
    dhikrCounts.forEach(d => {
      const fav = tsbIsFavorite(d.id) ? '\u{2B50} ' : '';
      html += `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.78rem;border-bottom:1px solid var(--border);">
        <span style="color:var(--text);">${fav}${d.label}</span>
        <span style="color:var(--muted);">${d.target}\u{D7} target</span>
      </div>`;
    });
    html += `</div>`;
  }
  container.innerHTML = html;
}

/* =====================================================
   Persistence
   ===================================================== */
function tsbSave() {
  localStorage.setItem('tsb_state_v2', JSON.stringify({
    count: tsbCount,
    rounds: tsbRoundsN,
    target: tsbTarget,
    dhikrId: tsbSelectedDhikrId,
    customText: tsbCustomText,
  }));
}