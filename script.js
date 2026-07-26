(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const revealElements = [...document.querySelectorAll('.reveal')];
  const year = document.getElementById('current-year');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  const setHeaderState = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  };

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    menu?.classList.toggle('open', !isOpen);
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

    revealElements.forEach(element => revealObserver.observe(element));

    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  if (year) year.textContent = String(new Date().getFullYear());

  const markInvalid = (field, invalid) => {
    field.classList.toggle('invalid', invalid);
    field.setAttribute('aria-invalid', String(invalid));
  };

  form?.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '';
    status.style.color = '';

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const need = String(data.get('need') || '').trim();
    const message = String(data.get('message') || '').trim();

    const requiredFields = [
      [form.elements.name, !name],
      [form.elements.need, !need],
      [form.elements.message, !message]
    ];

    requiredFields.forEach(([field, invalid]) => markInvalid(field, invalid));
    const invalid = requiredFields.some(([, value]) => value);

    if (invalid) {
      status.textContent = 'Preencha nome, tipo de projeto e contexto inicial.';
      const firstInvalid = requiredFields.find(([, value]) => value)?.[0];
      firstInvalid?.focus();
      return;
    }

    const text = [
      'Olá! Quero conversar com a Bapptech sobre um projeto.',
      '',
      `Nome: ${name}`,
      company ? `Empresa: ${company}` : '',
      `Tipo de projeto: ${need}`,
      `Contexto: ${message}`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/5511922737502?text=${encodeURIComponent(text)}`;
    status.style.color = '#227a31';
    status.textContent = 'Abrindo o WhatsApp com a mensagem preenchida...';
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  form?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      markInvalid(field, false);
      status.textContent = '';
      status.style.color = '';
    });
  });
})();
