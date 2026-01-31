const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const ensureLightbox = () => {
  if (document.querySelector(".lightbox-overlay")) return;
  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = '<img class="lightbox-image" alt="Imagem ampliada" />';
  overlay.addEventListener("click", () => overlay.classList.remove("active"));
  document.body.appendChild(overlay);
};

const openLightbox = (src, alt) => {
  ensureLightbox();
  const overlay = document.querySelector(".lightbox-overlay");
  const img = overlay.querySelector(".lightbox-image");
  img.src = src;
  img.alt = alt || "Imagem ampliada";
  overlay.classList.add("active");
};

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target && target.classList && target.classList.contains("lightbox")) {
    openLightbox(target.src, target.alt);
  }
});

const bindFormspree = (form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (status) status.textContent = "Enviando...";

    const data = new FormData(form);
    const trap = data.get("_gotcha");
    if (trap) {
      if (status) status.textContent = "Envio bloqueado.";
      return;
    }
    const now = Date.now();
    const last = Number(localStorage.getItem("bapptech_last_submit") || 0);
    if (now - last < 60000) {
      if (status) status.textContent = "Aguarde um minuto para enviar novamente.";
      return;
    }
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        if (status) status.textContent = form.dataset.success || "E-mail enviado. Obrigado!";
        form.reset();
        localStorage.setItem("bapptech_last_submit", String(Date.now()));
      } else {
        if (status) status.textContent = "Erro ao enviar. Tente novamente.";
      }
    } catch (err) {
      if (status) status.textContent = "Erro de conexão. Tente novamente.";
    }
  });
};

document.querySelectorAll("form[action*='formspree.io']").forEach(bindFormspree);
