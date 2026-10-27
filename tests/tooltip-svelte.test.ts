import './tooltip-polyfills';
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/svelte';
import Fixture from './SvelteTooltipFixture.svelte';
afterEach(cleanup);
it('binds open state, portals the text, retains description, and closes on Escape', async () => {
  const { getByRole, findByRole, queryByRole } = render(Fixture);
  const trigger = getByRole('button', { name: 'Inspect' }); expect(trigger.id).toBe('svelte-trigger');
  await fireEvent.pointerMove(trigger, { pointerType: 'mouse' }); const tip = await findByRole('tooltip');
  expect(tip).toHaveTextContent('Svelte hint'); expect(trigger.getAttribute('aria-describedby')).toContain('svelte-help');
  expect(trigger.getAttribute('aria-describedby')).toContain(tip.id); expect(getByRole('status')).toHaveTextContent('true');
  await fireEvent.keyDown(document, { key: 'Escape' }); await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
  expect(getByRole('status')).toHaveTextContent('false'); expect(trigger).toHaveAttribute('aria-describedby', 'svelte-help');
});
it('does not open disabled or empty content', async () => {
  const { getByRole, queryByRole, rerender } = render(Fixture, { disabled: true });
  await fireEvent.pointerMove(getByRole('button')); expect(queryByRole('tooltip')).toBeNull();
  await rerender({ disabled: false, content: '  ' });
  await fireEvent.pointerMove(getByRole('button'));
  await new Promise(resolve => setTimeout(resolve, 30)); expect(queryByRole('tooltip')).toBeNull();
});
it('supports the close-button dialog and restores its native trigger focus', async () => {
  const { getByRole, findByRole, queryByRole } = render(Fixture, { closable: true });
  const trigger = getByRole('button', { name: 'Inspect' }); await fireEvent.pointerMove(trigger); await findByRole('dialog');
  await fireEvent.keyDown(trigger, { key: 'Tab' }); const close = getByRole('button', { name: 'Close hint' });
  await waitFor(() => expect(close).toHaveFocus()); await fireEvent.click(close);
  await waitFor(() => expect(queryByRole('dialog')).toBeNull()); expect(trigger).toHaveFocus();
});
it('returns focus after Escape dismisses the Svelte close-button dialog', async () => {
  const { getByRole, findByRole, queryByRole } = render(Fixture, { closable: true });
  const trigger = getByRole('button', { name: 'Inspect' }); await fireEvent.pointerMove(trigger); await findByRole('dialog');
  await fireEvent.keyDown(trigger, { key: 'Tab' }); const close = getByRole('button', { name: 'Close hint' });
  await waitFor(() => expect(close).toHaveFocus()); await fireEvent.keyDown(close, { key: 'Escape' });
  await waitFor(() => expect(queryByRole('dialog')).toBeNull()); expect(trigger).toHaveFocus();
});
it('resolves auto and can change positioning without closing the Svelte hint', async () => {
  const { getByRole, findByRole, rerender } = render(Fixture, { placement: 'auto', tailAlign: 'auto' });
  await fireEvent.pointerMove(getByRole('button'));
  const tip = await findByRole('tooltip');
  await waitFor(() => expect(tip).toHaveAttribute('data-placement', expect.stringMatching(/^(top|bottom|left|right)/)));
  expect(tip.parentElement).toHaveAttribute('data-tail-align', 'auto');
  await rerender({ placement: 'bottom', tailAlign: 'start' });
  await waitFor(() => expect(tip).toHaveAttribute('data-side', 'bottom'));
  expect(tip.parentElement).toHaveAttribute('data-tail-align', 'start');
});
