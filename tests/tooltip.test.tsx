import './tooltip-polyfills';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { Button, Tooltip } from '../packages/react/src';
afterEach(cleanup);
it('opens from keyboard focus, preserves child identity, ref, name, events and descriptions, and closes on Escape', async () => {
  const ref = createRef<HTMLButtonElement>(); const focused = vi.fn();
  const { getByRole, queryByRole, findByRole } = render(<><p id="existing">Existing help</p><Tooltip content="More detail"><Button ref={ref} id="inspect" aria-describedby="existing" onFocus={focused}>Inspect</Button></Tooltip></>);
  const trigger = getByRole('button', { name: 'Inspect' });
  expect(ref.current).toBe(trigger); expect(trigger).toHaveAttribute('id', 'inspect');
  await act(async () => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
  fireEvent.keyDown(document, { key: 'Tab' }); await act(async () => trigger.focus());
  const tip = await findByRole('tooltip');
  expect(tip).toHaveTextContent('More detail'); expect(focused).toHaveBeenCalled();
  expect(trigger.getAttribute('aria-describedby')?.split(' ')).toEqual(['existing', tip.id]);
  expect(tip.parentElement?.parentElement).toBe(document.body);
  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(queryByRole('tooltip')).not.toBeInTheDocument());
  expect(trigger).toHaveAttribute('aria-describedby', 'existing'); expect(trigger).toHaveFocus();
});
it('honors show/hide delay, keeps hovered content open, and ignores touch hover', async () => {
  const { getByRole, findByRole, queryByRole } = render(<Tooltip content="Hint" openDelay={60} closeDelay={60}><button>Hover</button></Tooltip>);
  const trigger = getByRole('button');
  fireEvent.pointerMove(trigger, { pointerType: 'touch' });
  await new Promise(resolve => setTimeout(resolve, 90)); expect(queryByRole('tooltip')).toBeNull();
  fireEvent.pointerMove(trigger, { pointerType: 'mouse' }); expect(queryByRole('tooltip')).toBeNull();
  const tip = await findByRole('tooltip');
  fireEvent.pointerLeave(trigger); fireEvent.pointerEnter(tip);
  await new Promise(resolve => setTimeout(resolve, 90)); expect(getByRole('tooltip')).toBe(tip);
  fireEvent.pointerLeave(tip); await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
});
it('keeps controlled open authoritative and suppresses disabled or empty tooltips', async () => {
  const change = vi.fn();
  const { getByRole, queryByRole, rerender } = render(<Tooltip content="Hint" open onOpenChange={change}><button>Trigger</button></Tooltip>);
  expect(getByRole('tooltip')).toHaveTextContent('Hint'); await act(async () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))); fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(change).toHaveBeenCalledWith(false)); expect(getByRole('tooltip')).toBeInTheDocument();
  rerender(<Tooltip content="Hint" defaultOpen><Button disabled>Trigger</Button></Tooltip>);
  await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
  rerender(<Tooltip content="  " open><button>Trigger</button></Tooltip>); expect(queryByRole('tooltip')).toBeNull();
});
it('lets the trigger cancel tooltip events without replacing its own handler', async () => {
  const { getByRole, queryByRole } = render(<Tooltip content="Hint" openDelay={0}><button onPointerMove={event => event.preventDefault()}>Cancel</button></Tooltip>);
  fireEvent.pointerMove(getByRole('button')); await new Promise(resolve => setTimeout(resolve, 30)); expect(queryByRole('tooltip')).toBeNull();
});
it('makes the close variant a keyboard-accessible help dialog and restores focus without reopening', async () => {
  const { getByRole, queryByRole, findByRole } = render(<Tooltip content="Blue help" closable withIcon><button>Inspect</button></Tooltip>);
  const trigger = getByRole('button', { name: 'Inspect' });
  fireEvent.pointerMove(trigger); const dialog = await findByRole('dialog', { name: 'Information' });
  expect(queryByRole('tooltip')).toBeNull(); expect(dialog).toHaveTextContent('Blue help');
  const close = getByRole('button', { name: 'Close hint' });
  await act(async () => trigger.focus());
  fireEvent.pointerLeave(trigger);
  fireEvent.keyDown(trigger, { key: 'Tab' }); await waitFor(() => expect(close).toHaveFocus());
  fireEvent.pointerLeave(dialog); await new Promise(resolve => setTimeout(resolve, 180)); expect(close).toHaveFocus();
  fireEvent.click(close); await waitFor(() => expect(queryByRole('dialog')).toBeNull()); expect(trigger).toHaveFocus();
});
it('returns focus from the close button on Escape', async () => {
  const { getByRole, findByRole, queryByRole } = render(<Tooltip content="Blue help" closable openDelay={0}><button>Inspect</button></Tooltip>);
  const trigger = getByRole('button', { name: 'Inspect' }); fireEvent.pointerMove(trigger); await findByRole('dialog');
  fireEvent.keyDown(trigger, { key: 'Tab' }); const close = getByRole('button', { name: 'Close hint' });
  await waitFor(() => expect(close).toHaveFocus());
  fireEvent.keyDown(close, { key: 'Escape' }); await waitFor(() => expect(queryByRole('dialog')).toBeNull()); expect(trigger).toHaveFocus();
});
it('accepts auto placement and tail alignment and updates options while still open', async () => {
  const { getByRole, rerender, unmount } = render(<Tooltip content="Hint" open placement="auto" tailAlign="auto"><button>Inspect</button></Tooltip>);
  const tip = getByRole('tooltip');
  await waitFor(() => expect(tip).toHaveAttribute('data-placement', expect.stringMatching(/^(top|bottom|left|right)/)));
  expect(tip.parentElement).toHaveAttribute('data-tail-align', 'auto');
  rerender(<Tooltip content="Hint" open placement="bottom" tailAlign="start"><button>Inspect</button></Tooltip>);
  await waitFor(() => expect(tip).toHaveAttribute('data-side', 'bottom'));
  expect(tip.parentElement).toHaveAttribute('data-tail-align', 'start');
  unmount();
  fireEvent(window, new Event('resize'));
  expect(document.querySelector('.ore-tooltip__positioner')).toBeNull();
});
