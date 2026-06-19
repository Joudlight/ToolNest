/* =====================================================
   modal.js — Tool modal open/close logic
   ===================================================== */

function openTool(id, pushUrl = true) {
  if (id === 'sudoku') { openSudokuApp(); if (pushUrl) routerPush('sudoku'); return; }

  const builders = {
    tasks:        buildTasks,
    keyboard:     buildKeyboard,
    dua:          buildDua,
    notes:        buildNotes,
    wordfill:     buildWordFill,
    tasbeeh:      buildTasbeeh,
    memorymatch:  buildMemoryMatch,
    speedmath:    buildSpeedMath,
    numbermemory: buildNumberMemory,
  };

  if (!builders[id]) return;
  const t = builders[id]();

  document.getElementById('modal-title').innerHTML = t.title;
  document.getElementById('modal-body').innerHTML  = t.html;

  // Desktop max-widths
  const box = document.getElementById('modal-box');
  if (window.innerWidth >= 640) {
    const widths = { tasks: '860px', tasbeeh: '480px', dua: '720px' };
    box.style.maxWidth = widths[id] || '700px';
  } else {
    box.style.maxWidth = '';
  }

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (t.init) setTimeout(t.init, 10);

  if (pushUrl) routerPush(id);
}

function closeModal(pushHome = true) {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  if (pushHome) routerHome();
}

function closeOnOverlay(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
