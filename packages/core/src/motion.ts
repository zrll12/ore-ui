import { animate, type AnimationPlaybackControls } from 'motion';
const active = new WeakMap<HTMLElement, AnimationPlaybackControls>();
/** Animate an outer wrapper so displacement never overwrites the button's press transform.
 * Call the returned cleanup on unmount. Repeated calls settle from the current position.
 */
export function springTo(element: HTMLElement, x = 0, y = 0): () => void {
  active.get(element)?.stop();
  if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.style.transform = 'translate(0px, 0px)';
    return () => {};
  }
  const controls = animate(element, { transform: `translate(${x}px, ${y}px)` },
    { type: 'spring', duration: 0.5, bounce: 0.2 });
  active.set(element, controls);
  return () => {
    if (active.get(element) === controls) { controls.stop(); active.delete(element); }
  };
}
