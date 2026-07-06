import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lockScroll, unlockScroll } from '../scrollLock.js';

/**
 * Rendered Markdown body with reading enhancements:
 * - every <pre> code block gets a copy button (hover on desktop, always
 *   visible on touch) with a "copied" confirmation state;
 * - every content image (.md-img) opens in a gesture-driven lightbox:
 *     phone:   pinch to zoom (anchored to your fingers), one-finger pan when
 *              zoomed, swipe up/down to dismiss, double-tap to zoom
 *     desktop: wheel zoom anchored at the cursor, drag to pan, double-click,
 *              toolbar buttons, keyboard (Esc / + / - / 0)
 */

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

const COPY_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

const MAX_ZOOM = 4;
const clampZoom = (s) => Math.min(MAX_ZOOM, Math.max(1, s));
const ptDist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ptMid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Zoom the view to `nextS`, keeping the screen point (ax, ay) anchored —
 * pinch zooms toward your fingers, wheel zooms toward the cursor.
 * view = { s, x, y } with transform: translate(x, y) scale(s), origin center.
 */
function zoomAt(view, nextS, ax, ay) {
  const s = clampZoom(nextS);
  if (s === 1) return { s: 1, x: 0, y: 0 };
  const vx = window.innerWidth / 2;
  const vy = window.innerHeight / 2;
  const k = s / view.s;
  return {
    s,
    x: ax - vx - k * (ax - vx - view.x),
    y: ay - vy - k * (ay - vy - view.y),
  };
}

function LightboxButton({ label, onClick, children, as: As = 'button', ...rest }) {
  return (
    <As type={As === 'button' ? 'button' : undefined} aria-label={label} title={label} onClick={onClick}
      className="h-10 min-w-10 px-2 flex items-center justify-center rounded-[10px] bg-white/85 border border-[#4E5969]/20 shadow-inner backdrop-blur-xl text-[#4E5969] text-sm font-medium hover:bg-white transition-colors duration-200 cursor-pointer"
      {...rest}>
      {children}
    </As>
  );
}

const SWIPE_DISMISS = 90; // px of vertical swipe (at 1x) that closes the lightbox

function Lightbox({ src, alt, onClose }) {
  const [view, setView] = useState({ s: 1, x: 0, y: 0 });
  const [swipeY, setSwipeY] = useState(0);
  const [gesturing, setGesturing] = useState(false);
  const overlayRef = useRef(null);
  const viewRef = useRef(view);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef({ t: 0, x: 0, y: 0 });

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  // Scroll lock + keyboard controls.
  useEffect(() => {
    lockScroll();
    const onKey = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') setView((v) => zoomAt(v, v.s * 1.25, cx, cy));
      else if (e.key === '-') setView((v) => zoomAt(v, v.s / 1.25, cx, cy));
      else if (e.key === '0') setView({ s: 1, x: 0, y: 0 });
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Wheel zoom, anchored at the cursor (manual listener: React's onWheel can
  // be passive and we need preventDefault).
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setView((v) => zoomAt(v, v.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  /* ---- pointer gestures: pinch / pan / swipe-dismiss / (double-)tap ---- */

  const onPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGesturing(true);
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      // second finger down → pinch (from wherever the view currently is)
      setSwipeY(0);
      gesture.current = {
        mode: 'pinch',
        startDist: ptDist(pts[0], pts[1]),
        startMid: ptMid(pts[0], pts[1]),
        startView: gesture.current?.lastView ?? viewRef.current,
        lastView: gesture.current?.lastView ?? viewRef.current,
        moved: true,
      };
    } else if (pts.length === 1) {
      gesture.current = {
        mode: viewRef.current.s > 1 ? 'pan' : 'swipe',
        startPt: pts[0],
        startView: viewRef.current,
        lastView: viewRef.current,
        startT: performance.now(),
        moved: false,
        lastSwipe: 0,
      };
    }
  };

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];

    if (g.mode === 'pinch' && pts.length >= 2) {
      const m = ptMid(pts[0], pts[1]);
      let v = zoomAt(
        g.startView,
        (g.startView.s * ptDist(pts[0], pts[1])) / g.startDist,
        g.startMid.x,
        g.startMid.y
      );
      // fingers moving together also pan the image
      if (v.s > 1) v = { ...v, x: v.x + (m.x - g.startMid.x), y: v.y + (m.y - g.startMid.y) };
      g.lastView = v;
      setView(v);
    } else if (g.mode === 'pan') {
      const dx = pts[0].x - g.startPt.x;
      const dy = pts[0].y - g.startPt.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      const v = { s: g.startView.s, x: g.startView.x + dx, y: g.startView.y + dy };
      g.lastView = v;
      setView(v);
    } else if (g.mode === 'swipe') {
      const dx = pts[0].x - g.startPt.x;
      const dy = pts[0].y - g.startPt.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      g.lastSwipe = dy;
      setSwipeY(dy);
    }
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    const remaining = [...pointers.current.values()];

    // pinch → one finger left: hand off to pan/swipe without a jump
    if (g && g.mode === 'pinch' && remaining.length === 1) {
      const v = g.lastView ?? g.startView;
      gesture.current = {
        mode: v.s > 1 ? 'pan' : 'swipe',
        startPt: remaining[0],
        startView: v,
        lastView: v,
        startT: performance.now(),
        moved: true,
        lastSwipe: 0,
      };
      return;
    }
    if (remaining.length > 0) return;

    setGesturing(false);
    if (g?.mode === 'swipe') {
      if (Math.abs(g.lastSwipe) > SWIPE_DISMISS) {
        onClose();
        return;
      }
      setSwipeY(0); // spring back
    }

    // tap / double-tap (unified for touch and mouse)
    if (g && !g.moved && performance.now() - g.startT < 300) {
      const p = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      const lt = lastTap.current;
      if (now - lt.t < 350 && Math.abs(p.x - lt.x) < 30 && Math.abs(p.y - lt.y) < 30) {
        lastTap.current = { t: 0, x: 0, y: 0 };
        setView((v) => (v.s > 1 ? { s: 1, x: 0, y: 0 } : zoomAt(v, 2.2, p.x, p.y)));
      } else {
        lastTap.current = { t: now, x: p.x, y: p.y };
      }
    }
    gesture.current = null;
  };

  const { s, x, y } = view;
  // swiping shrinks the image a touch and thins the backdrop, IG-style
  const shrink = 1 - Math.min(Math.abs(swipeY) / 1400, 0.1);
  const backdropOpacity = 1 - Math.min(Math.abs(swipeY) / 320, 0.7);
  const softTrans = gesturing ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.85, 0.15, 1)';
  const filename = src.split('/').pop() || 'image';

  return (
    <motion.div ref={overlayRef} role="dialog" aria-modal="true" aria-label={alt || '圖片檢視'}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed inset-0 z-[80] flex items-center justify-center">
      {/* backdrop — fades out as the image is swiped away */}
      <div onClick={onClose}
        className="absolute inset-0 bg-[#2B3A4A]/85 backdrop-blur-sm"
        style={{ opacity: backdropOpacity, transition: gesturing ? 'none' : 'opacity 0.3s ease-out' }} />

      {/* toolbar — zoom buttons are desktop-only (phones pinch instead) */}
      <div className="fixed top-4 right-4 z-[85] flex gap-2">
        <div className="hidden sm:flex gap-2">
          <LightboxButton label="縮小"
            onClick={() => setView((v) => zoomAt(v, v.s / 1.4, window.innerWidth / 2, window.innerHeight / 2))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
          </LightboxButton>
          <LightboxButton label="重設縮放" onClick={() => setView({ s: 1, x: 0, y: 0 })}>
            <span className="tabular-nums">{Math.round(s * 100)}%</span>
          </LightboxButton>
          <LightboxButton label="放大"
            onClick={() => setView((v) => zoomAt(v, v.s * 1.4, window.innerWidth / 2, window.innerHeight / 2))}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          </LightboxButton>
        </div>
        <LightboxButton as="a" label="下載圖片" href={src} download={filename}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
        </LightboxButton>
        <LightboxButton label="關閉" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </LightboxButton>
      </div>

      {/* image — the motion wrapper owns the enter/exit animation; the inner
          <img> owns the live gesture transform (they must not share one). */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.85, 0.15, 1] }}
        className="relative z-10 pointer-events-none flex items-center justify-center">
        <img src={src} alt={alt || ''} draggable={false}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          className={`pointer-events-auto max-w-[92vw] max-h-[82vh] object-contain rounded-xl shadow-2xl select-none ${s > 1 ? (gesturing ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
          style={{
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            transform: `translate(${x}px, ${y + swipeY}px) scale(${s * shrink})`,
            transition: softTrans,
          }} />
      </motion.div>

      {alt && s === 1 && (
        <p className="absolute bottom-5 inset-x-0 text-center text-white/85 text-sm noto-font px-6 pointer-events-none"
          style={{ opacity: backdropOpacity }}>
          {alt}
        </p>
      )}
    </motion.div>
  );
}

export default function MdContent({ html, className = '' }) {
  const ref = useRef(null);
  const [lightbox, setLightbox] = useState(null); // { src, alt } | null

  // Inject a copy button into every code block.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const timers = new Set();
    const buttons = [];

    root.querySelectorAll('pre').forEach((pre) => {
      let wrap = pre.parentElement?.classList.contains('code-block') ? pre.parentElement : null;
      if (wrap?.querySelector('.code-copy')) return;
      if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'code-block';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.setAttribute('aria-label', '複製程式碼');
      const render = (copied) => {
        btn.innerHTML = `${COPY_ICON}<span>${copied ? '已複製' : '複製'}</span>`;
      };
      render(false);
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = (code ? code.innerText : pre.innerText).replace(/\n+$/, '');
        if (!(await copyText(text))) return;
        btn.classList.add('copied');
        render(true);
        const t = setTimeout(() => {
          btn.classList.remove('copied');
          render(false);
          timers.delete(t);
        }, 1800);
        timers.add(t);
      });
      wrap.appendChild(btn);
      buttons.push(btn);
    });

    return () => {
      timers.forEach(clearTimeout);
      buttons.forEach((b) => b.remove());
    };
  }, [html]);

  // Open the lightbox from any content image (event delegation).
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = (e) => {
      const img = e.target.closest('img.md-img');
      if (!img || !root.contains(img)) return;
      setLightbox({ src: img.currentSrc || img.src, alt: img.alt || '' });
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <div ref={ref} className={`md-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
      {createPortal(
        <AnimatePresence>
          {lightbox && <Lightbox key="lightbox" src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
