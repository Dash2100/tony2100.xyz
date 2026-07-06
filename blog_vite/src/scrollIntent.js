/**
 * One-shot scroll behavior for the NEXT route change.
 *
 * 'smooth' (default): article-style navigations (post card, back button,
 * featured / tag links) do fuwari's smooth scroll-to-top.
 *
 * 'instant': sidenav section switches (home / posts / notes). The scroll reset
 * is instant and happens while the incoming content is still invisible, so the
 * ONLY thing the user sees is the fade + staggered entrance — identical every
 * time, regardless of how far the previous page was scrolled.
 *
 * peek() reads without consuming (used by the App-level smooth-scroll handler);
 * take() reads and resets to 'smooth' (used by the incoming page on mount).
 */
let next = 'smooth';

export function setScrollIntent(behavior) {
  next = behavior;
}

export function peekScrollIntent() {
  return next;
}

export function takeScrollIntent() {
  const behavior = next;
  next = 'smooth';
  return behavior;
}
