
(() => {
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.getElementById('mobile-navigation');
  let previousOverflow = '';
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader(); window.addEventListener('scroll', updateHeader, { passive: true });
  const isOpen = () => toggle?.getAttribute('aria-expanded') === 'true';
  function closeMenu(restoreFocus = true) {
    if (!isOpen()) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.querySelector('[data-menu-open]').hidden = false;
    toggle.querySelector('[data-menu-close]').hidden = true;
    panel.hidden = true;
    document.body.style.overflow = previousOverflow;
    if (restoreFocus) toggle.focus();
  }
  toggle?.addEventListener('click', () => {
    if (isOpen()) { closeMenu(); return; }
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    toggle.querySelector('[data-menu-open]').hidden = true;
    toggle.querySelector('[data-menu-close]').hidden = false;
    panel.hidden = false;
    panel.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (!isOpen()) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key !== 'Tab') return;
    const links = [...panel.querySelectorAll('a')];
    const last = links.at(-1);
    if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); toggle.focus(); }
  });
  const desktop = window.matchMedia('(min-width:1100px)');
  desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
  panel?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false)));
  document.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', event => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download')) return;
    const targetURL = new URL(link.href, document.baseURI);
    if (targetURL.origin !== location.origin || !targetURL.hash) return;
    const normalize = pathname => pathname.replace(/index\.html$/, '').replace(/\/$/, '');
    if (normalize(targetURL.pathname) !== normalize(location.pathname)) return;
    const target = document.getElementById(decodeURIComponent(targetURL.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    if (isOpen()) closeMenu(false);
    history.pushState(null, '', targetURL.hash);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }));
  const buttons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('.work-card[data-category]');
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    let count = 0;
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'All' && card.dataset.category !== button.dataset.filter; if (!card.hidden) count++; });
    const status = document.querySelector('[data-work-count]');
    if (status) status.textContent = `${count} experience highlights`;
  }));
})();
