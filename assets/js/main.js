// Ouverture / fermeture du menu mobile
const boutonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");

boutonMenu.addEventListener("click", () => {
  const estOuvert = menu.classList.toggle("is-open");
  // Met à jour l'info d'accessibilité + le libellé du bouton
  boutonMenu.setAttribute("aria-expanded", estOuvert);
  boutonMenu.setAttribute("aria-label", estOuvert ? "Fermer le menu" : "Ouvrir le menu");
});