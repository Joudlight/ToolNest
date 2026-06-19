/* =====================================================
   nav.js — Mobile nav, back-to-top, category filter, footer year
   ===================================================== */

/* ===== FOOTER YEAR ===== */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== MOBILE NAV ===== */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
});

function closeMobileNav(e) {
  if (e.target === document.getElementById('mobileNav')) closeMobileNavBtn();
}
function closeMobileNavBtn() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ===== BACK TO TOP ===== */
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backBtn.classList.toggle('visible', scrollY > 400);
});
backBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== CATEGORY FILTER ===== */
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.cat;
    document.querySelectorAll('.tool-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});
