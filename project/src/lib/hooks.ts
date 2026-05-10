import { useEffect, useRef, useState } from 'react';

export function useLongPress(
  onLongPress: (p: { x: number; y: number }) => void,
  ms = 450,
) {
  const timerRef = useRef<number | null>(null);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    const point = 'touches' in e
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
    timerRef.current = window.setTimeout(() => onLongPress(point), ms);
  };
  const cancel = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onTouchCancel: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}

export function useSwipe(onPrev?: () => void, onNext?: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let sx = 0, sy = 0;
    const start = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dy) < 50) {
        if (dx > 0) onPrev?.();
        else        onNext?.();
      }
    };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', end);
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchend', end);
    };
  }, [onPrev, onNext]);
  return ref;
}

export function usePullToRefresh(
  scrollRef: React.RefObject<HTMLElement | null>,
  onRefresh: () => Promise<unknown> | void,
) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let startY = 0, pulling = false;

    const onStart = (e: TouchEvent) => {
      if (el.scrollTop <= 0) { startY = e.touches[0].clientY; pulling = true; }
    };
    const onMove = (e: TouchEvent) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 60) {
        pulling = false;
        setActive(true);
        Promise.resolve(onRefresh()).finally(() => {
          setTimeout(() => setActive(false), 1200);
        });
      }
    };
    const onEnd = () => { pulling = false; };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: true });
    el.addEventListener('touchend', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, [scrollRef, onRefresh]);

  return active;
}
