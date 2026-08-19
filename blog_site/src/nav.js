/**
 * Shared navigation helper imported by every page.
 * Highlights the active nav item based on the current path.
 * Works for both the desktop side-nav and the mobile bottom-nav,
 * which mark their links with data-nav="home|blog|note|settings".
 */

function currentSection() {
  const path = location.pathname;
  if (/post-list(\.html)?$/.test(path)) return 'blog';
  if (/note(\.html)?$/.test(path)) return 'note';
  return 'home';
}

function applyActive() {
  const active = currentSection();
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.classList.toggle('nav-active', el.dataset.nav === active);
  });
}

// The navbar is injected by vite-plugin-html-inject before module scripts run,
// so the elements already exist — but guard for safety.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyActive);
} else {
  applyActive();
}

export { currentSection };
