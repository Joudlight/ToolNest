/* =====================================================
   tools/notes.js — Quick Notes (sticky)
   ===================================================== */
const NOTE_COLORS = [{bg:'#fef9c3'},{bg:'#d1fae5'},{bg:'#dbeafe'},{bg:'#fce7f3'},{bg:'#ede9fe'},{bg:'#ffedd5'}];

function buildNotes() {
  return {
    title: '📝 Quick Notes',
    html: `<div><div class="notes-toolbar"><button class="notes-add-btn" onclick="addNote()">+ New Note</button><span style="font-size:0.78rem;color:var(--muted);">Tap to edit · Drag to reorder</span></div><div class="notes-grid" id="notes-grid"></div></div>`,
    init: renderNotes,
  };
}

let notesDragSrc = null;
function getNotes() { try { return JSON.parse(localStorage.getItem('tn_notes2') || '[]'); } catch { return []; } }
function saveNotes(arr) { localStorage.setItem('tn_notes2', JSON.stringify(arr)); }

function addNote() {
  const arr = getNotes();
  arr.unshift({ id:Date.now(), text:'', color:NOTE_COLORS[Math.floor(Math.random()*NOTE_COLORS.length)].bg, created:new Date().toLocaleDateString() });
  saveNotes(arr); renderNotes();
  setTimeout(() => { const ta = document.querySelector('.note-textarea'); if (ta) ta.focus(); }, 60);
}
function deleteNote(id)           { saveNotes(getNotes().filter(n => n.id !== id)); renderNotes(); }
function updateNoteText(id, val)  { const arr = getNotes(); const n = arr.find(n => n.id === id); if (n) n.text = val; saveNotes(arr); }
function changeNoteColor(id, col) { const arr = getNotes(); const n = arr.find(n => n.id === id); if (n) n.color = col; saveNotes(arr); renderNotes(); }

function renderNotes() {
  const grid = document.getElementById('notes-grid'); if (!grid) return;
  const arr = getNotes();
  if (!arr.length) { grid.innerHTML = '<div class="notes-empty">📌 Click "+ New Note" to pin your first note!</div>'; return; }
  grid.innerHTML = arr.map(n => `
    <div class="note-card" draggable="true" id="note-${n.id}" style="background:${n.color};"
      ondragstart="notesDragStart(event,${n.id})" ondragover="notesDragOver(event,${n.id})"
      ondragleave="notesDragLeave(event)" ondrop="notesDrop(event,${n.id})" ondragend="notesDragEnd(event)">
      <div class="note-header">
        <div class="note-color-btns">${NOTE_COLORS.map(c => `<div class="note-color-dot" style="background:${c.bg};${n.color===c.bg?'border-color:rgba(0,0,0,0.4)':''}" onclick="changeNoteColor(${n.id},'${c.bg}')"></div>`).join('')}</div>
        <button class="note-del-btn" onclick="deleteNote(${n.id})" aria-label="Delete note">✕</button>
      </div>
      <textarea class="note-textarea" placeholder="Write anything here…" onchange="updateNoteText(${n.id},this.value)" oninput="updateNoteText(${n.id},this.value)" aria-label="Note text">${n.text}</textarea>
      <div class="note-footer">${n.created}</div>
    </div>`).join('');
}

function notesDragStart(e, id)    { notesDragSrc = id; document.getElementById('note-'+id).classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
function notesDragOver(e, id)     { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (id !== notesDragSrc) document.getElementById('note-'+id).classList.add('drag-over'); }
function notesDragLeave(e)        { e.currentTarget.classList.remove('drag-over'); }
function notesDrop(e, targetId)   { e.preventDefault(); if (notesDragSrc === targetId) return; let arr = getNotes(); const si = arr.findIndex(n=>n.id===notesDragSrc), ti = arr.findIndex(n=>n.id===targetId); const [m] = arr.splice(si,1); arr.splice(ti,0,m); saveNotes(arr); renderNotes(); }
function notesDragEnd()            { document.querySelectorAll('.note-card').forEach(c => c.classList.remove('dragging','drag-over')); }
