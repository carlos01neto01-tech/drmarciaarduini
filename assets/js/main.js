/* Mobile-only: animation + nav highlighting */
(() => {
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => [...el.querySelectorAll(s)];

  // Burger menu
  const burger = qs('[data-burger]');
  const menu = qs('[data-menu]');
  if (burger && menu){
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close menu on link click
    qsa('a[href^="#"]', menu).forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll (safe)
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if(!id || id === '#') return;
      const target = qs(id);
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', id);
    });
  });

  // IntersectionObserver reveal
  const revealEls = qsa('.reveal, .drop, .btn');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.classList.add('is-visible');
        io.unobserve(ent.target);
      }
    });
  }, {threshold: 0.18});

  revealEls.forEach(el => io.observe(el));

  // Active nav by section
  const navLinks = qsa('[data-menu] a[href^="#"]');
  const sections = navLinks
    .map(a => qs(a.getAttribute('href')))
    .filter(Boolean);

  if(sections.length){
    const ioNav = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if(ent.isIntersecting){
          navLinks.forEach(a => a.setAttribute('aria-current','false'));
          const active = navLinks.find(a => a.getAttribute('href') === '#' + ent.target.id);
          if(active) active.setAttribute('aria-current','true');
        }
      });
    }, {threshold: 0.55});

    sections.forEach(s => ioNav.observe(s));
  }

  // Form UX (no backend by default)
  const form = qs('form[data-form]');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = qs('input[name="name"]', form)?.value?.trim() || '';
      const email = qs('input[name="email"]', form)?.value?.trim() || '';
      const phone = qs('input[name="phone"]', form)?.value?.trim() || '';

      const msg = encodeURIComponent(
        `Olá, Dra. Márcia! Meu nome é ${name || '[seu nome]'}. ` +
        `Quero agendar uma avaliação. ` +
        (phone ? `Telefone: ${phone}. ` : '') +
        (email ? `Email: ${email}.` : '')
      );

      // Troque o número abaixo, se necessário
      const whatsapp = 'https://wa.me/5544991212969?text=' + msg;

      window.open(whatsapp, '_blank', 'noopener,noreferrer');
    });
  }
})();
