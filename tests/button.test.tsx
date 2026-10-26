import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Button } from '../packages/react/src';
import { createRef } from 'react';
afterEach(cleanup);
describe('React Button adapter', () => {
  it('forwards events, native attributes, and ref while preventing implicit form submission', () => {
    const onClick = vi.fn(); const ref = createRef<HTMLButtonElement>();
    const { getByRole } = render(<Button ref={ref} onClick={onClick} name="action" variant="outline">Continue</Button>);
    const button = getByRole('button', { name: 'Continue' });
    expect(ref.current).toBe(button); expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('name', 'action'); expect(button).toHaveAttribute('data-variant', 'outline');
    fireEvent.click(button); expect(onClick).toHaveBeenCalledOnce();
  });
  it('preserves the accessible label and blocks clicks while loading', () => {
    const onClick = vi.fn(); const { getByRole, rerender } = render(<Button loading onClick={onClick}>Save</Button>);
    const button = getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled(); expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button); expect(onClick).not.toHaveBeenCalled();
    rerender(<Button onClick={onClick}>Save</Button>); fireEvent.click(button); expect(onClick).toHaveBeenCalledOnce();
  });
  it('supports removing styles and explicit submit behavior', () => {
    const { getByRole } = render(<Button type="submit" unstyled className="custom">Submit</Button>);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
    expect(getByRole('button')).toHaveClass('custom'); expect(getByRole('button')).not.toHaveClass('ore-button');
  });
});
