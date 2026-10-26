import { expect, it, vi } from 'vitest';
import { springTo } from '../packages/core/src/motion';
it('avoids displacement when the user requests reduced motion', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  const element = document.createElement('div');
  const cleanup = springTo(element, 80, 40);
  expect(element.style.transform).toBe('translate(0px, 0px)');
  expect(() => cleanup()).not.toThrow();
  vi.unstubAllGlobals();
});
