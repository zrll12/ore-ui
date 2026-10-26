import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import Fixture from './SvelteFixture.svelte';
afterEach(cleanup);
describe('Svelte Button adapter', () => {
  it('shares the recipe contract and forwards native events', async () => {
    const onclick = vi.fn(); const { getByRole } = render(Fixture, { onclick });
    const button = getByRole('button', { name: 'Continue' });
    expect(button).toHaveAttribute('type', 'button'); expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-color', 'teal'); expect(button).toHaveAttribute('name', 'action');
    await fireEvent.click(button); expect(onclick).toHaveBeenCalledOnce();
  });
  it('blocks activation and retains an accessible label while loading', async () => {
    const onclick = vi.fn(); const { getByRole } = render(Fixture, { loading: true, onclick });
    const button = getByRole('button', { name: 'Continue' });
    expect(button).toBeDisabled(); expect(button).toHaveAttribute('aria-busy', 'true');
    button.click(); expect(onclick).not.toHaveBeenCalled();
  });
});
