// Ouverture / fermeture du menu mobile
const boutonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");

boutonMenu.addEventListener("click", () => {
  const estOuvert = menu.classList.toggle("is-open");
  // Met à jour l'info d'accessibilité + le libellé du bouton
  boutonMenu.setAttribute("aria-expanded", estOuvert);
  boutonMenu.setAttribute("aria-label", estOuvert ? "Fermer le menu" : "Ouvrir le menu");
});








// ==========================================
// Animation des chiffres
// ==========================================

const chiffres = document.querySelectorAll(".chiffre-valeur");

const animateCounter = (element) => {
  const target = Number(element.dataset.target);
  const duration = 1800;
  const start = performance.now();

  function update(time) {
    const progress = Math.min((time - start) / duration, 1);

    // effet d'accélération puis ralentissement
    const ease = 1 - Math.pow(1 - progress, 3);

    const value = Math.floor(ease * target);

    element.textContent = value + (target >= 10 ? "+" : "");

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      
      entry.target.classList.add("visible");

      if (entry.target.dataset.target) {
         animateCounter(entry.target);
      }

      obs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5
});

chiffres.forEach(chiffre => observer.observe(chiffre));