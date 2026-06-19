/* =====================================================
   tools/keyboard.js — Arabic Keyboard & Search
   ===================================================== */

const BLOCKED_TERMS = ['porn','sex','xxx','nude','naked','adult','hentai','erotic','escort','hooker','nsfw','18+','onlyfans'];
function isBlocked(q) { return BLOCKED_TERMS.some(t => q.toLowerCase().includes(t)); }

const SEARCH_SUGGESTIONS = {
  'ا': ['اسلام','اخبار اليوم','اجمل الادعية','احاديث نبوية','الروابط المفيدة'],
  'م': ['مسجد القبة الصخرة','محمد صلى الله عليه وسلم','ما هو الاسلام','مرتب المعلم'],
  default: ['اسلام','قرآن كريم','أحاديث نبوية','أذكار الصباح','الفقه الإسلامي','تعلم العربية','Arabic lessons','Islamic history','Quran tafsir','Hadith collection','Learn Arabic','Muslim prayers'],
};

function buildKeyboard() {
  return {
    title: '⌨️ Arabic Keyboard & Search',
    html: `<div style="display:flex;flex-direction:column;gap:12px;">
<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:10px;">
  <div style="font-size:0.75rem;color:var(--muted);font-weight:600;letter-spacing:.05em;">SEARCH WITH ARABIC TEXT</div>
  <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
    <input id="ar-search-input" class="task-input" style="flex:1;min-width:140px;direction:rtl;font-family:var(--font-ar);font-size:1.1rem;padding:10px 14px;" placeholder="اكتب هنا للبحث..." oninput="arSearchInput(this.value)" onkeydown="if(event.key==='Enter')arDoSearch('google')" aria-label="Arabic search input">
    <button onclick="arDoSearch('google')" style="padding:10px 14px;border-radius:8px;background:#4285f4;color:white;font-size:0.8rem;font-weight:600;border:none;cursor:pointer;white-space:nowrap;min-height:42px;">🔍 Google</button>
    <button onclick="arDoSearch('youtube')" style="padding:10px 14px;border-radius:8px;background:#ff0000;color:white;font-size:0.8rem;font-weight:600;border:none;cursor:pointer;white-space:nowrap;min-height:42px;">▶ YouTube</button>
  </div>
  <div id="ar-suggestions" style="display:flex;gap:6px;flex-wrap:wrap;" role="listbox" aria-label="Search suggestions"></div>
  <div id="ar-search-warn" style="display:none;color:#f87171;font-size:0.78rem;" role="alert">⚠️ هذا المحتوى محظور — يُرجى البحث عن محتوى مناسب.</div>
</div>
<div class="ar-toolbar">
  <button class="ar-tool-btn" onclick="arCopy()">📋 Copy</button>
  <button class="ar-tool-btn" onclick="arClear()">🗑 Clear</button>
  <button class="ar-tool-btn" onclick="arSendToSearch()">⬆️ To Search</button>
</div>
<div class="ar-display" id="ar-display" dir="rtl" contenteditable="true" spellcheck="false" oninput="arSyncToSearch()" aria-label="Arabic text area" role="textbox"></div>
<div class="ar-keyboard" role="group" aria-label="Arabic keyboard">
  <div class="ar-row">${['ض','ص','ث','ق','ف','غ','ع','ه','خ','ح','ج','د'].map(k=>`<button class="ar-key" onclick="arType('${k}')" aria-label="${k}">${k}</button>`).join('')}</div>
  <div class="ar-row">${['ش','س','ي','ب','ل','ا','ت','ن','م','ك','ط','ذ'].map(k=>`<button class="ar-key" onclick="arType('${k}')" aria-label="${k}">${k}</button>`).join('')}</div>
  <div class="ar-row">${['ئ','ء','ؤ','ر','لا','ى','ة','و','ز','ظ'].map(k=>`<button class="ar-key" onclick="arType('${k}')" aria-label="${k}">${k}</button>`).join('')}</div>
  <div class="ar-row">
    <button class="ar-key wide" onclick="arType(' ')" aria-label="Space">مسافة</button>
    <button class="ar-key wide" onclick="arBackspace()" aria-label="Backspace">⌫ حذف</button>
    <button class="ar-key wide" onclick="arType('\\n')" aria-label="New line">↵</button>
  </div>
  <div class="ar-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;">
    <span style="font-size:.72rem;color:var(--muted);padding:4px 6px;align-self:center;">تشكيل:</span>
    ${[['َ','Fatha'],['ِ','Kasra'],['ُ','Damma'],['ْ','Sukun'],['ّ','Shadda'],['ً','Tanwin F'],['ٍ','Tanwin K'],['ٌ','Tanwin D']].map(([k,l])=>`<button class="ar-key" title="${l}" onclick="arType('${k}')" aria-label="${l}">${k}</button>`).join('')}
  </div>
  <div class="ar-row" style="margin-top:6px;border-top:1px solid var(--border);padding-top:8px;">
    <span style="font-size:.72rem;color:var(--muted);padding:4px 6px;align-self:center;">علامات:</span>
    ${['،','؟','؛','!','.','"','-','(',')',':'].map(k=>`<button class="ar-key" onclick="arType('${k}')">${k}</button>`).join('')}
  </div>
</div></div>`,
    init: () => { arShowSuggestions(SEARCH_SUGGESTIONS.default.slice(0, 6)); },
  };
}

function arType(ch) { const d = document.getElementById('ar-display'); if (!d) return; if (ch === '\n') d.innerHTML += '<br>'; else d.textContent += ch; arSyncToSearch(); }
function arBackspace() { const d = document.getElementById('ar-display'); if (!d) return; d.textContent = d.textContent.slice(0, -1); arSyncToSearch(); }
function arCopy() { const d = document.getElementById('ar-display'); if (!d) return; navigator.clipboard.writeText(d.textContent).then(() => { const btn = event.target; btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = '📋 Copy', 1500); }); }
function arClear() { const d = document.getElementById('ar-display'); if (d) d.textContent = ''; const s = document.getElementById('ar-search-input'); if (s) s.value = ''; arShowSuggestions(SEARCH_SUGGESTIONS.default.slice(0, 6)); }
function arSyncToSearch() { const d = document.getElementById('ar-display'), s = document.getElementById('ar-search-input'); if (d && s) { s.value = d.textContent.trim(); arSearchInput(s.value); } }
function arSendToSearch() { const d = document.getElementById('ar-display'), s = document.getElementById('ar-search-input'); if (d && s) s.value = d.textContent.trim(); }

function arSearchInput(val) {
  const warn = document.getElementById('ar-search-warn');
  if (isBlocked(val)) { if (warn) warn.style.display = 'block'; arShowSuggestions([]); return; }
  if (warn) warn.style.display = 'none';
  if (!val.trim()) { arShowSuggestions(SEARCH_SUGGESTIONS.default.slice(0, 6)); return; }
  const firstChar = val.trim()[0];
  const pool = SEARCH_SUGGESTIONS[firstChar] || SEARCH_SUGGESTIONS.default;
  const filtered = pool.filter(s => s.toLowerCase().startsWith(val.toLowerCase()) || s.includes(val));
  const extra = SEARCH_SUGGESTIONS.default.filter(s => s.includes(val) && !filtered.includes(s));
  arShowSuggestions([...new Set([...filtered, ...extra])].slice(0, 5));
}

function arShowSuggestions(list) {
  const el = document.getElementById('ar-suggestions'); if (!el) return;
  el.innerHTML = list.map(s => `<button onclick="arPickSuggestion('${s.replace(/'/g,"\\'")}') " style="padding:6px 12px;border-radius:999px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:.8rem;cursor:pointer;transition:all .15s;font-family:var(--font-ar);min-height:34px;" onmouseover="this.style.borderColor='var(--accent)';this.style.color='var(--accent-light)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--muted)'" role="option">${s}</button>`).join('');
}

function arPickSuggestion(s) { const si = document.getElementById('ar-search-input'); if (si) si.value = s; const d = document.getElementById('ar-display'); if (d) d.textContent = s; }

function arDoSearch(engine) {
  const si = document.getElementById('ar-search-input'); if (!si) return;
  const q = si.value.trim(); if (!q) return;
  if (isBlocked(q)) { const warn = document.getElementById('ar-search-warn'); if (warn) warn.style.display = 'block'; return; }
  const encoded = encodeURIComponent(q);
  const url = engine === 'youtube' ? 'https://www.youtube.com/results?search_query=' + encoded : 'https://www.google.com/search?q=' + encoded;
  window.open(url, '_blank', 'noopener');
}
