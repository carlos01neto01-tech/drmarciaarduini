
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
burger?.addEventListener("click", () => {
  const open = mobileMenu.style.display === "block";
  mobileMenu.style.display = open ? "none" : "block";
  burger.setAttribute("aria-expanded", String(!open));
});

const track = document.getElementById("track");
if (track){
  const slides = Array.from(track.querySelectorAll(".slide"));

  function setActiveByCenter(){
    const rect = track.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    let best = { idx: 0, dist: Infinity };
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(center - c);
      if (d < best.dist) best = { idx: i, dist: d };
    });
    slides.forEach((s, i) => s.classList.toggle("is-active", i === best.idx));
  }

  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      setActiveByCenter();
      ticking = false;
    });
  }, { passive: true });

  setTimeout(() => {
    const target = slides[1] || slides[0];
    target?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
    setActiveByCenter();
  }, 60);

  document.getElementById("prev")?.addEventListener("click", () => {
    const activeIndex = slides.findIndex(s => s.classList.contains("is-active"));
    const nextIndex = Math.max(0, Math.min(slides.length - 1, activeIndex - 1));
    slides[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });

  document.getElementById("next")?.addEventListener("click", () => {
    const activeIndex = slides.findIndex(s => s.classList.contains("is-active"));
    const nextIndex = Math.max(0, Math.min(slides.length - 1, activeIndex + 1));
    slides[nextIndex].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  });

  window.addEventListener("resize", setActiveByCenter);
}

const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = (document.getElementById("nome")?.value || "").trim();
  const whatsapp = (document.getElementById("whatsapp")?.value || "").trim();
  const procedimento = (document.getElementById("procedimento")?.value || "").trim();
  const horario = (document.getElementById("horario")?.value || "").trim();
  const msg = (document.getElementById("mensagem")?.value || "").trim();

  const parts = [
    nome ? `Olá, sou ${nome}.` : "Olá!",
    procedimento ? `Quero agendar: ${procedimento}.` : "Quero agendar uma avaliação.",
    whatsapp ? `Meu WhatsApp: ${whatsapp}.` : "",
    horario ? `Melhor horário: ${horario}.` : "",
    msg ? `Mensagem: ${msg}` : ""
  ].filter(Boolean);

  const text = encodeURIComponent(parts.join(" "));
  window.open(`https://wa.me/5544991212969?text=${text}`, "_blank", "noopener");
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
