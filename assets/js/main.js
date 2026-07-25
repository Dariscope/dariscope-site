/* ==========================================================================
   DARISCOPE — Script principal
   --------------------------------------------------------------------------
   0. Active le mode JS (pour l'amélioration progressive)
   1. Menu mobile
   2. Header : ombre au défilement
   3. Barre de progression de lecture
   4. Apparition au défilement + compteurs animés
   ========================================================================== */

/* --- 0. Signale que JavaScript est actif -------------------------------- */
document.documentElement.classList.add("js");

const animationsReduites =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* --- 1. Menu mobile ----------------------------------------------------- */
const boutonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-menu");

if (boutonMenu && menu) {
  boutonMenu.addEventListener("click", () => {
    const estOuvert = menu.classList.toggle("is-open");
    boutonMenu.setAttribute("aria-expanded", estOuvert);
    boutonMenu.setAttribute(
      "aria-label",
      estOuvert ? "Fermer le menu" : "Ouvrir le menu"
    );
  });

  // Referme le menu quand on clique un lien (utile sur mobile)
  menu.querySelectorAll("a").forEach((lien) => {
    lien.addEventListener("click", () => {
      menu.classList.remove("is-open");
      boutonMenu.setAttribute("aria-expanded", "false");
      boutonMenu.setAttribute("aria-label", "Ouvrir le menu");
    });
  });
}


/* --- 2. Header : ombre douce quand on défile ---------------------------- */
const header = document.querySelector(".site-header");
if (header) {
  const majHeader = () => {
    header.classList.toggle("est-defile", window.scrollY > 8);
  };
  majHeader();
  window.addEventListener("scroll", majHeader, { passive: true });
}


/* --- 3. Barre de progression de lecture --------------------------------- */
if (!animationsReduites) {
  const barre = document.createElement("div");
  barre.className = "progression-lecture";
  document.body.appendChild(barre);

  const majBarre = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    barre.style.width = pct + "%";
  };
  majBarre();
  window.addEventListener("scroll", majBarre, { passive: true });
  window.addEventListener("resize", majBarre, { passive: true });
}


/* --- 4. Apparition au défilement + compteurs ---------------------------- */
const elementsReveal = document.querySelectorAll(".reveal");
const chiffres = document.querySelectorAll(".chiffre-valeur[data-target]");

/* Anime un compteur de 0 jusqu'à sa cible */
function animerCompteur(element) {
  const cible = Number(element.dataset.target);
  if (isNaN(cible)) return;

  const suffixe = element.dataset.suffixe || (cible >= 10 ? "+" : "");

  if (animationsReduites) {
    element.textContent = cible + suffixe;
    return;
  }

  const duree = 1600;
  const debut = performance.now();

  function pas(temps) {
    const progression = Math.min((temps - debut) / duree, 1);
    const easing = 1 - Math.pow(1 - progression, 3);   // ralentit en fin
    element.textContent = Math.floor(easing * cible) + suffixe;
    if (progression < 1) requestAnimationFrame(pas);
    else element.textContent = cible + suffixe;
  }
  requestAnimationFrame(pas);
}

/* Sans IntersectionObserver ou animations coupées : on affiche tout */
if (animationsReduites || !("IntersectionObserver" in window)) {
  elementsReveal.forEach((el) => el.classList.add("est-visible"));
  chiffres.forEach(animerCompteur);
} else {
  const observateur = new IntersectionObserver(
    (entrees, obs) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        entree.target.classList.add("est-visible");
        if (entree.target.dataset.target) animerCompteur(entree.target);
        obs.unobserve(entree.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elementsReveal.forEach((el) => observateur.observe(el));
  // Un chiffre peut ne pas avoir la classe reveal : on l'observe aussi
  chiffres.forEach((c) => {
    if (!c.classList.contains("reveal")) observateur.observe(c);
  });
}
