/* =====================================================
   main.js — Final init, card entrance animations
   ===================================================== */

// Staggered card entrance animation on load
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      card.style.opacity = '';
      card.style.transform = '';
    }, 80 + i * 40);
  });
});
