import { afterEach, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/svelte';
import Fixture from './SvelteSwitchFixture.svelte';
afterEach(cleanup);
it('binds Svelte switch values and restores the initial state on native reset', async () => {
  const { getByRole } = render(Fixture);
  const input = getByRole('switch', { name: 'Daylight' });
  const form = getByRole('form') as HTMLFormElement;
  expect(input).toBeChecked();
  expect(new FormData(form).get('daylight')).toBe('on');
  await fireEvent.click(input);
  expect(getByRole('status', { name: 'Switch value' })).toHaveTextContent('false');
  expect(form.checkValidity()).toBe(false);
  await act(async () => { form.reset(); await Promise.resolve(); });
  await waitFor(() => expect(getByRole('status', { name: 'Switch value' })).toHaveTextContent('true'));
  expect(input).toBeChecked();
});
it('inherits disabled fieldsets and omits disabled values from submission', () => {
  const { getByRole } = render(Fixture, { disabled: true });
  expect(getByRole('switch')).toBeDisabled();
  expect(new FormData(getByRole('form') as HTMLFormElement).has('daylight')).toBe(false);
});
