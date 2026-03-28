import { useCallback, useRef, type UIEvent } from "react";

const IDLE_MS = 700;

/**
 * Scroll handler: toggles `scrollbar-smart--active` on the scrolling element so
 * CSS can show the thumb only while scrolling (and shortly after).
 */
export function useScrollbarSmartReveal() {
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback((e: UIEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.classList.add("scrollbar-smart--active");
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      el.classList.remove("scrollbar-smart--active");
      idleTimer.current = null;
    }, IDLE_MS);
  }, []);
}
