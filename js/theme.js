/* =====================================================
   theme.js — Dark / Light mode toggle
   ===================================================== */
document.getElementById('themeToggle').addEventListener('click', () => {
  const cur  = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('toolnest_theme', next);
});
