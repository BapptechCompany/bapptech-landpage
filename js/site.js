const detectRootFromScript = () => {
  const current = document.currentScript;
  const fallback = [...document.querySelectorAll("script[src]")].find((script) =>
    script.src.includes("/js/site.js")
  );
  const script = current || fallback;
  if (!script?.src) return "/";

  const url = new URL(script.src, window.location.href);
  return url.pathname.replace(/js\/site\.js$/, "");
};

const normalizeRoot = (value) => {
  if (!value) return "/";
  let rootPath = value.trim();
  if (!rootPath.startsWith("/")) rootPath = `/${rootPath}`;
  if (!rootPath.endsWith("/")) rootPath = `${rootPath}/`;
  return rootPath.replace(/\/{2,}/g, "/");
};

const root = normalizeRoot(document.body.dataset.root || detectRootFromScript());
const pageKey = document.body.dataset.page || "home";
const fallbackContent = {
  site: {
    message: "Modernizamos sistemas corporativos com previsibilidade e governança.",
    primaryCta: "Solicitar Diagnóstico Arquitetural",
    ctaBarText: "Quer modernizar com segurança e previsibilidade?"
  },
  nav: {
    items: [
      { key: "home", label: "Home", href: "" },
      { key: "servicos", label: "Serviços", href: "servicos/" },
      { key: "metodologia", label: "Metodologia", href: "metodologia/" },
      { key: "governanca", label: "Governança", href: "governanca-seguranca/" },
      { key: "cases", label: "Cases", href: "cases/" },
      { key: "sobre", label: "Sobre", href: "sobre/" },
      { key: "contato", label: "Contato", href: "contato/" }
    ]
  },
  footer: {
    email: "contato@bapptech.com.br",
    whatsapp:
      "https://wa.me/5511922737502?text=Oi%21%20Quero%20solicitar%20um%20diagnostico%20arquitetural%20com%20a%20Bapptech.",
    city: "São Paulo/SP",
    cnpj: "",
    copyright: "Todos os direitos reservados."
  }
};

const loadContent = async () => {
  const candidates = [`${root}content.json`, "content.json", "../content.json", "./content.json", "/content.json"];
  for (const path of candidates) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (_) {
      // Try next path
    }
  }
  return null;
};

const pathFor = (slug) => `${root}${slug}`;

const rewriteInternalLinks = () => {
  if (root === "/") return;

  document.querySelectorAll("a[href^='/']").forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("//")) return;
    anchor.setAttribute("href", `${root}${href.slice(1)}`);
  });
};

const renderHeader = (content) => {
  const target = document.querySelector("[data-component='header']");
  if (!target) return;

  const navItems = content.nav.items
    .map((item) => {
      const href = pathFor(item.href);
      const current = item.key === pageKey ? ' aria-current="page"' : "";
      return `<a href="${href}"${current}>${item.label}</a>`;
    })
    .join("");

  target.innerHTML = `
    <header class="site-header" id="site-header">
      <div class="container nav">
        <a class="brand" href="${pathFor("")}" aria-label="Bapptech - Página inicial">
          <img src="${pathFor("assets/bapptech-logo-horizontal-cropped.png")}" alt="Bapptech" />
        </a>
        <nav class="nav-links" aria-label="Principal">${navItems}</nav>
        <a class="btn header-cta" href="${pathFor("contato/")}" aria-label="${content.site.primaryCta}">${content.site.primaryCta}</a>
        <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div id="mobile-menu" class="mobile-menu">
        <div class="container">
          ${navItems}
          <a class="btn" href="${pathFor("contato/")}" aria-label="${content.site.primaryCta}">${content.site.primaryCta}</a>
        </div>
      </div>
    </header>
  `;
};

const renderFooter = (content) => {
  const target = document.querySelector("[data-component='footer']");
  if (!target) return;

  const links = content.nav.items
    .map((item) => `<a href="${pathFor(item.href)}">${item.label}</a>`)
    .join("");

  const cnpj = content.footer.cnpj ? `<span>CNPJ: ${content.footer.cnpj}</span>` : "";
  const city = content.footer.city ? `<span>${content.footer.city}</span>` : "";
  const year = new Date().getFullYear();

  target.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <img src="${pathFor("assets/bapptech-logo-horizontal-cropped.png")}" alt="Bapptech" />
          <p>${content.site.message}</p>
        </div>
        <div>
          <strong>Links</strong>
          ${links}
          <a href="${pathFor("privacidade/")}">Política de Privacidade</a>
        </div>
        <div>
          <strong>Contato</strong>
          <a href="mailto:${content.footer.email}" aria-label="Enviar e-mail para a Bapptech">${content.footer.email}</a>
          <a href="${content.footer.whatsapp}" target="_blank" rel="noreferrer noopener" aria-label="Falar com a Bapptech no WhatsApp">WhatsApp</a>
          ${city}
          ${cnpj}
        </div>
      </div>
      <div class="container footer-bottom">© ${year} Bapptech. ${content.footer.copyright}</div>
    </footer>
  `;
};

const renderCtaBar = (content) => {
  const target = document.querySelector("[data-component='cta-bar']");
  if (!target) return;

  target.innerHTML = `
    <div class="cta-bar" id="cta-bar" aria-live="polite">
      <p>${content.site.ctaBarText}</p>
      <a class="btn" href="${pathFor("contato/")}" aria-label="${content.site.primaryCta}">${content.site.primaryCta}</a>
    </div>
  `;
};

const bindHeader = () => {
  const header = document.getElementById("site-header");
  if (!header) return;

  const toggle = header.querySelector(".menu-toggle");
  const mobileMenu = header.querySelector("#mobile-menu");

  const onScroll = () => {
    if (window.scrollY > 16) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };

  onScroll();
  document.addEventListener("scroll", onScroll, { passive: true });

  if (!toggle || !mobileMenu) return;

  toggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      mobileMenu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
};

const bindReveal = () => {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const bindCtaBar = () => {
  const ctaBar = document.getElementById("cta-bar");
  if (!ctaBar) return;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    if (progress >= 0.4) ctaBar.classList.add("visible");
    else ctaBar.classList.remove("visible");
  };

  onScroll();
  document.addEventListener("scroll", onScroll, { passive: true });
};

const bindContactForm = () => {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const success = document.querySelector("[data-form-success]");
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const consent = form.querySelector("input[name='lgpd']");
    if (consent && !consent.checked) {
      if (status) status.textContent = "É necessário aceitar o consentimento para continuar.";
      return;
    }

    if (status) status.textContent = "Enviando...";

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        if (status) status.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
        return;
      }

      form.reset();
      form.style.display = "none";
      if (success) success.classList.add("visible");
      if (status) status.textContent = "";
    } catch (_) {
      if (status) status.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
    }
  });
};

const init = async () => {
  const content = (await loadContent()) || fallbackContent;

  renderHeader(content);
  renderFooter(content);
  renderCtaBar(content);

  bindHeader();
  bindReveal();
  bindCtaBar();
  bindContactForm();
  rewriteInternalLinks();
};

init();
