/* =====================================================
   tools/tasks.js — TaskFlow Task Manager
   ===================================================== */

function buildTasks() {
  return { title: '✅ TaskFlow — Task Manager', html: buildTaskFlowHTML(), init: initTaskFlow };
}

function buildTaskFlowHTML() {
  return `<div class="tf-root" id="tf-root">
  <aside class="tf-sidebar">
    <div class="tf-logo"><h1>Task<span>Flow</span></h1><p>Your daily workspace</p></div>
    <div class="tf-nav-section">
      <div class="tf-nav-label">Views</div>
      <div class="tf-nav-item active" onclick="tfSwitchView('today',this)"><span class="tf-icon">☀️</span>Today<span class="tf-count" id="tf-count-today">0</span></div>
      <div class="tf-nav-item" onclick="tfSwitchView('all',this)"><span class="tf-icon">📋</span>All<span class="tf-count" id="tf-count-all">0</span></div>
      <div class="tf-nav-item" onclick="tfSwitchView('upcoming',this)"><span class="tf-icon">📅</span>Upcoming<span class="tf-count" id="tf-count-upcoming">0</span></div>
      <div class="tf-nav-item" onclick="tfSwitchView('completed',this)"><span class="tf-icon">✅</span>Done<span class="tf-count" id="tf-count-done">0</span></div>
    </div>
    <div class="tf-nav-section">
      <div class="tf-nav-label">Priority</div>
      <div class="tf-nav-item" onclick="tfFilterPriority('high',this)"><span class="tf-icon">🔴</span>High</div>
      <div class="tf-nav-item" onclick="tfFilterPriority('medium',this)"><span class="tf-icon">🟡</span>Medium</div>
      <div class="tf-nav-item" onclick="tfFilterPriority('low',this)"><span class="tf-icon">🟢</span>Low</div>
    </div>
    <div class="tf-sidebar-footer">
      <div class="tf-date-widget">
        <div class="tf-day" id="tf-sidebar-day"></div>
        <div class="tf-full-date" id="tf-sidebar-date"></div>
        <div class="tf-progress-wrap">
          <div class="tf-progress-label" id="tf-progress-label">0 of 0 done today</div>
          <div class="tf-progress-track"><div class="tf-progress-fill" id="tf-progress-fill" style="width:0%"></div></div>
        </div>
      </div>
    </div>
  </aside>
  <main class="tf-main">
    <div class="tf-header">
      <div><h2 id="tf-view-title">Today</h2><p id="tf-view-sub">Stay focused on what matters today</p></div>
      <button class="tf-btn-primary" onclick="tfOpenAdd()">+ New Task</button>
    </div>
    <div class="tf-stats">
      <div class="tf-stat-card"><div class="tf-stat-label">Total</div><div class="tf-stat-value" id="tf-stat-total">0</div></div>
      <div class="tf-stat-card"><div class="tf-stat-label">Done</div><div class="tf-stat-value" id="tf-stat-done">0</div></div>
      <div class="tf-stat-card"><div class="tf-stat-label">Active</div><div class="tf-stat-value" id="tf-stat-pending">0</div></div>
      <div class="tf-stat-card"><div class="tf-stat-label">Overdue</div><div class="tf-stat-value" id="tf-stat-overdue" style="color:#e63946">0</div></div>
    </div>
    <div class="tf-add-section" id="tf-add-section">
      <div class="tf-add-row">
        <input type="text" class="tf-task-input" id="tf-new-title" placeholder="What needs to be done?" onkeydown="if(event.key==='Enter')tfSaveNew()">
        <button class="tf-btn-primary" onclick="tfSaveNew()">Add</button>
        <button class="tf-btn-cancel" onclick="tfCloseAdd()">Cancel</button>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <select class="tf-select" id="tf-new-priority"><option value="medium">⚡ Medium</option><option value="high">🔴 High</option><option value="low">🟢 Low</option></select>
        <select class="tf-select" id="tf-new-category"><option value="work">💼 Work</option><option value="personal">🏠 Personal</option><option value="health">💪 Health</option><option value="learning">📚 Learning</option><option value="other">📌 Other</option></select>
        <input type="date" class="tf-select" id="tf-new-date">
      </div>
    </div>
    <div class="tf-filter-bar">
      <div class="tf-filter-chip active" onclick="tfSetFilter('all',this)">All</div>
      <div class="tf-filter-chip" onclick="tfSetFilter('work',this)">💼 Work</div>
      <div class="tf-filter-chip" onclick="tfSetFilter('personal',this)">🏠 Personal</div>
      <div class="tf-filter-chip" onclick="tfSetFilter('health',this)">💪 Health</div>
      <div class="tf-filter-chip" onclick="tfSetFilter('learning',this)">📚 Learning</div>
      <div class="tf-search-wrap"><span class="tf-search-icon">🔍</span><input type="text" placeholder="Search…" oninput="tfSearch(this.value)"></div>
    </div>
    <div id="tf-task-list"></div>
  </main>
</div>
<div class="tf-modal-overlay" id="tf-modal-overlay" onclick="if(event.target===this)tfCloseModal()">
  <div class="tf-modal">
    <h3>Edit Task</h3>
    <div class="tf-form-group"><label class="tf-form-label">Title</label><input type="text" class="tf-task-input" id="tf-edit-title" style="width:100%"></div>
    <div class="tf-form-group"><label class="tf-form-label">Notes</label><textarea class="tf-textarea" id="tf-edit-notes" placeholder="Add context or notes…"></textarea></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="tf-form-group" style="flex:1;min-width:120px"><label class="tf-form-label">Priority</label><select class="tf-select" id="tf-edit-priority" style="width:100%"><option value="high">🔴 High</option><option value="medium">⚡ Medium</option><option value="low">🟢 Low</option></select></div>
      <div class="tf-form-group" style="flex:1;min-width:120px"><label class="tf-form-label">Category</label><select class="tf-select" id="tf-edit-category" style="width:100%"><option value="work">💼 Work</option><option value="personal">🏠 Personal</option><option value="health">💪 Health</option><option value="learning">📚 Learning</option><option value="other">📌 Other</option></select></div>
    </div>
    <div class="tf-form-group"><label class="tf-form-label">Due Date</label><input type="date" class="tf-select" id="tf-edit-date" style="width:100%"></div>
    <div class="tf-modal-actions"><button class="tf-btn-cancel" onclick="tfCloseModal()">Cancel</button><button class="tf-btn-primary" onclick="tfSaveEdit()">Save</button></div>
  </div>
</div>
<div class="tf-toast" id="tf-toast"></div>`;
}

let tfTasks = [], tfView = 'today', tfFilter = 'all', tfSearch_ = '', tfPriFilter = null, tfEditId = null;

function initTaskFlow() {
  tfTasks = JSON.parse(localStorage.getItem('taskflow_tasks') || '[]');
  if (!tfTasks.length) {
    const today = tfTodayStr();
    tfTasks = [
      { id:1, title:'Review project plan', category:'work', priority:'high', date:today, done:false, notes:'', created:Date.now() },
      { id:2, title:'Morning workout — 30 mins', category:'health', priority:'medium', date:today, done:true, notes:'', created:Date.now() },
      { id:3, title:'Read Atomic Habits ch. 3', category:'learning', priority:'low', date:today, done:false, notes:'Focus on habit stacking', created:Date.now() },
      { id:4, title:'Call dentist for appointment', category:'personal', priority:'medium', date:today, done:false, notes:'', created:Date.now() },
      { id:5, title:'Prepare slides for standup', category:'work', priority:'high', date:tfDateOffset(1), done:false, notes:'', created:Date.now() },
      { id:6, title:'Grocery shopping', category:'personal', priority:'low', date:tfDateOffset(2), done:false, notes:'Eggs, milk, coffee', created:Date.now() },
    ];
    tfSave();
  }
  const d = new Date();
  document.getElementById('tf-sidebar-day').textContent  = d.getDate();
  document.getElementById('tf-sidebar-date').textContent = d.toLocaleDateString('en-US', { weekday:'long', month:'long', year:'numeric' });
  tfRender();
}

function tfSave()      { localStorage.setItem('taskflow_tasks', JSON.stringify(tfTasks)); }
function tfNextId()    { return tfTasks.length ? Math.max(...tfTasks.map(t => t.id)) + 1 : 1; }
function tfTodayStr()  { return new Date().toISOString().split('T')[0]; }
function tfDateOffset(days) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().split('T')[0]; }

function tfGetVisible() {
  const today = tfTodayStr(); let list = [...tfTasks];
  if (tfView === 'today')     list = list.filter(t => t.date === today);
  else if (tfView === 'upcoming') list = list.filter(t => !t.done && t.date > today);
  else if (tfView === 'completed') list = list.filter(t => t.done);
  if (tfPriFilter) list = list.filter(t => t.priority === tfPriFilter);
  if (tfFilter !== 'all') list = list.filter(t => t.category === tfFilter);
  if (tfSearch_)  list = list.filter(t => t.title.toLowerCase().includes(tfSearch_.toLowerCase()));
  return list;
}

function tfCatTag(cat) {
  const map = { work:['tf-tag-blue','💼 Work'], personal:['tf-tag-purple','🏠 Personal'], health:['tf-tag-green','💪 Health'], learning:['tf-tag-orange','📚 Learning'], other:['tf-tag-red','📌 Other'] };
  const [cls, label] = map[cat] || map.other;
  return `<span class="tf-tag ${cls}">${label}</span>`;
}
function tfPriDot(p)  { return `<span class="tf-priority-dot tf-p-${p}"></span>`; }
function tfFmtDate(dateStr) {
  if (!dateStr) return '';
  const today = tfTodayStr();
  if (dateStr === today) return 'Today';
  if (dateStr === tfDateOffset(1)) return 'Tomorrow';
  const d = new Date(dateStr + 'T00:00:00');
  if (dateStr < today) return `<span style="color:#e63946">⚠ ${d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>`;
  return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
}
function tfEsc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function tfRender() {
  const list = document.getElementById('tf-task-list'); if (!list) return;
  const tasks = tfGetVisible(), today = tfTodayStr();
  const overdue   = tasks.filter(t => t.date && t.date < today && !t.done);
  const todayItems = tasks.filter(t => t.date === today && !t.done);
  const upcoming  = tasks.filter(t => t.date > today && !t.done);
  const done      = tasks.filter(t => t.done);
  const noDate    = tasks.filter(t => !t.date && !t.done);
  const grp = (title, items, dot) => !items.length ? '' :
    `<div class="tf-task-group"><div class="tf-group-header"><div class="tf-group-dot" style="background:${dot}"></div><div class="tf-group-title">${title}</div><div class="tf-group-count">${items.length}</div></div>${items.map(tfCard).join('')}</div>`;
  let html = tfView === 'completed' ? (done.length ? grp('Completed', done, '#74c69d') : tfEmpty()) : '';
  if (tfView !== 'completed') {
    html += grp('Overdue', overdue, '#e63946') + grp('Today', todayItems, '#2d6a4f') + grp('Upcoming', upcoming, '#4895ef') + grp('No Due Date', noDate, '#bbb');
    if (tfView === 'all') html += grp('Completed', done, '#74c69d');
    if (!html) html = tfEmpty();
  }
  html += '<div class="tf-quick-add" onclick="tfOpenAdd()">＋ Add a task</div>';
  list.innerHTML = html;
  tfUpdateStats(); tfUpdateSidebar();
}

function tfCard(t) {
  const today = tfTodayStr(), ov = t.date && t.date < today && !t.done;
  return `<div class="tf-task-card ${t.done ? 'done' : ''}" onclick="tfOpenEdit(${t.id})">
    <div class="tf-checkbox ${t.done ? 'checked' : ''}" onclick="event.stopPropagation();tfToggle(${t.id})"></div>
    <div class="tf-task-body">
      <div class="tf-task-title">${tfEsc(t.title)}</div>
      <div class="tf-task-meta">${tfPriDot(t.priority)}${tfCatTag(t.category)}${t.date ? `<span class="tf-due-date ${ov ? 'overdue' : ''}">📅 ${tfFmtDate(t.date)}</span>` : ''}${t.notes ? '<span style="font-size:10px;color:var(--muted-light)">📝</span>' : ''}</div>
    </div>
    <div class="tf-task-actions">
      <button class="tf-action-btn" onclick="event.stopPropagation();tfOpenEdit(${t.id})">✏️</button>
      <button class="tf-action-btn tf-delete" onclick="event.stopPropagation();tfDelete(${t.id})">🗑</button>
    </div>
  </div>`;
}
function tfEmpty() { return '<div class="tf-empty">✨<br>No tasks here — you\'re all clear!</div>'; }

function tfUpdateStats() {
  const today = tfTodayStr();
  document.getElementById('tf-stat-total').textContent   = tfTasks.length;
  document.getElementById('tf-stat-done').textContent    = tfTasks.filter(t => t.done).length;
  document.getElementById('tf-stat-pending').textContent = tfTasks.filter(t => !t.done).length;
  document.getElementById('tf-stat-overdue').textContent = tfTasks.filter(t => !t.done && t.date && t.date < today).length;
}

function tfUpdateSidebar() {
  const today = tfTodayStr();
  const todayT = tfTasks.filter(t => t.date === today);
  const doneT  = todayT.filter(t => t.done).length;
  const pct    = todayT.length ? Math.round(doneT / todayT.length * 100) : 0;
  const pf = document.getElementById('tf-progress-fill'); if (pf) pf.style.width = pct + '%';
  const pl = document.getElementById('tf-progress-label'); if (pl) pl.textContent = doneT + ' of ' + todayT.length + ' done today';
  document.getElementById('tf-count-today').textContent    = todayT.filter(t => !t.done).length;
  document.getElementById('tf-count-all').textContent      = tfTasks.filter(t => !t.done).length;
  document.getElementById('tf-count-done').textContent     = tfTasks.filter(t => t.done).length;
  document.getElementById('tf-count-upcoming').textContent = tfTasks.filter(t => !t.done && t.date > today).length;
}

function tfToggle(id)  { const t = tfTasks.find(t => t.id === id); if (!t) return; t.done = !t.done; tfSave(); tfRender(); tfToast(t.done ? '✅ Done!' : '↩ Reopened'); }
function tfDelete(id)  { tfTasks = tfTasks.filter(t => t.id !== id); tfSave(); tfRender(); tfToast('🗑 Deleted'); }
function tfOpenAdd()   { const s = document.getElementById('tf-add-section'); if (s) { s.classList.add('open'); document.getElementById('tf-new-date').value = tfTodayStr(); setTimeout(() => document.getElementById('tf-new-title').focus(), 50); } }
function tfCloseAdd()  { const s = document.getElementById('tf-add-section'); if (s) s.classList.remove('open'); document.getElementById('tf-new-title').value = ''; }

function tfSaveNew() {
  const titleEl = document.getElementById('tf-new-title'); if (!titleEl) return;
  const title = titleEl.value.trim(); if (!title) return;
  tfTasks.push({ id:tfNextId(), title, priority:document.getElementById('tf-new-priority').value, category:document.getElementById('tf-new-category').value, date:document.getElementById('tf-new-date').value, done:false, notes:'', created:Date.now() });
  tfSave(); tfCloseAdd(); tfRender(); tfToast('✨ Task added!');
}

function tfOpenEdit(id) {
  const t = tfTasks.find(t => t.id === id); if (!t) return;
  tfEditId = id;
  document.getElementById('tf-edit-title').value    = t.title;
  document.getElementById('tf-edit-notes').value    = t.notes;
  document.getElementById('tf-edit-priority').value = t.priority;
  document.getElementById('tf-edit-category').value = t.category;
  document.getElementById('tf-edit-date').value     = t.date || '';
  document.getElementById('tf-modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('tf-edit-title').focus(), 50);
}
function tfCloseModal() { document.getElementById('tf-modal-overlay').classList.remove('open'); tfEditId = null; }
function tfSaveEdit() {
  const t = tfTasks.find(t => t.id === tfEditId); if (!t) return;
  t.title    = document.getElementById('tf-edit-title').value.trim() || t.title;
  t.notes    = document.getElementById('tf-edit-notes').value;
  t.priority = document.getElementById('tf-edit-priority').value;
  t.category = document.getElementById('tf-edit-category').value;
  t.date     = document.getElementById('tf-edit-date').value;
  tfSave(); tfCloseModal(); tfRender(); tfToast('💾 Saved');
}

function tfSwitchView(v, el) {
  tfView = v; tfPriFilter = null;
  document.querySelectorAll('.tf-nav-item').forEach(x => x.classList.remove('active'));
  if (el) el.classList.add('active');
  const titles = { today:'Today', all:'All Tasks', upcoming:'Upcoming', completed:'Completed' };
  const subs   = { today:'Stay focused on what matters today', all:'Every task in your workspace', upcoming:'Plan your week ahead', completed:"Look how far you've come" };
  document.getElementById('tf-view-title').textContent = titles[v] || v;
  document.getElementById('tf-view-sub').textContent   = subs[v] || '';
  tfRender();
}
function tfFilterPriority(p, el) {
  tfPriFilter = tfPriFilter === p ? null : p; tfView = 'all';
  document.querySelectorAll('.tf-nav-item').forEach(x => x.classList.remove('active'));
  if (el && tfPriFilter) el.classList.add('active');
  tfRender();
}
function tfSetFilter(f, el) { tfFilter = f; document.querySelectorAll('.tf-filter-chip').forEach(c => c.classList.remove('active')); if (el) el.classList.add('active'); tfRender(); }
function tfSearch(q)   { tfSearch_ = q; tfRender(); }
function tfToast(msg)  { const el = document.getElementById('tf-toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2500); }
