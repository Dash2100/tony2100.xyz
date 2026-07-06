import { useEffect, useRef, useState } from 'react';

/**
 * Reading-line scroll-spy.
 *
 * Instead of an IntersectionObserver "zone" (which gets stuck when the zone is
 * empty, and can never reach headings near the bottom of the page), the active
 * section is derived directly from the scroll position:
 *
 *   active = the last heading whose top has crossed the reading line
 *            (READ_OFFSET px from the viewport top)
 *
 * Guarantees:
 * - At the very top (nothing crossed yet) the FIRST heading is active.
 * - At the very bottom the LAST heading is active.
 * - Tail headings that can never physically reach the reading line (the page
 *   runs out of scroll room first) get their activation points remapped evenly
 *   across the final scrollable stretch, so EVERY entry can become active.
 * - While the app's post-navigation glide runs (`html.is-navigating`), updates
 *   are suppressed so the highlight doesn't flicker through sections.
 *
 * Returns [activeId, activate]:
 * - activate(id): optimistically highlight `id` and lock the spy until the
 *   click-triggered smooth scroll settles (used by TOC link clicks).
 */
const READ_OFFSET = 110; // just below the headings' scroll-margin-top (100px)

export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] ?? null);
  const lockedRef = useRef(false);

  useEffect(() => {
    if (!ids.length) return;
    setActive(ids[0]);
    lockedRef.current = false;

    let points = []; // [{ id, at }] activation scrollY, ascending

    const compute = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
      const pts = [];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        pts.push({ id, at: top - READ_OFFSET });
      }
      // Remap unreachable tail headings into the last scrollable stretch.
      const firstUnreach = pts.findIndex((p) => p.at > maxScroll);
      if (firstUnreach !== -1) {
        const start = firstUnreach > 0 ? pts[firstUnreach - 1].at : 0;
        const span = maxScroll - start;
        const m = pts.length - firstUnreach;
        for (let k = 0; k < m; k++) {
          pts[firstUnreach + k].at = start + (span * (k + 1)) / (m + 1);
        }
      }
      points = pts;
      update();
    };

    const update = () => {
      if (!points.length || lockedRef.current) return;
      if (document.documentElement.classList.contains('is-navigating')) return;
      const y = window.scrollY;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      let current = points[0].id;
      if (maxScroll <= 0) {
        setActive(current);
        return;
      }
      if (y >= maxScroll - 2) {
        current = points[points.length - 1].id;
      } else {
        for (const p of points) {
          if (y >= p.at) current = p.id;
          else break;
        }
      }
      setActive(current);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    // Body resizes (lazy images, fonts, viewport changes) shift heading
    // positions — recompute activation points whenever layout changes.
    const ro = new ResizeObserver(compute);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute);
    compute();

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids.join('|')]);

  // Optimistic highlight for TOC clicks: keep the clicked entry active while
  // the smooth scroll travels (otherwise the spy would sweep through every
  // section in between). Unlocks on scrollend, with a timeout fallback.
  const activate = (id) => {
    setActive(id);
    lockedRef.current = true;
    let timer;
    const release = () => {
      lockedRef.current = false;
      window.removeEventListener('scrollend', release);
      clearTimeout(timer);
    };
    window.addEventListener('scrollend', release);
    timer = setTimeout(release, 1200);
  };

  return [active, activate];
}
