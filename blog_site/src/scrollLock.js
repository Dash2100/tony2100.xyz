/**
 * Reference-counted body scroll lock. Multiple overlays (TOC sheet, image
 * lightbox, …) can lock independently in any order; the body only unlocks
 * when the last one releases.
 */
let count = 0;

export function lockScroll() {
  if (++count === 1) document.body.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (count > 0 && --count === 0) document.body.style.overflow = '';
}
