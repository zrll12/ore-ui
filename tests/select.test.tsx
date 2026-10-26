import './select-polyfills';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { Select } from '../packages/react/src';
const options = [{value:'survival',label:'Survival'},{value:'spectator',label:'Spectator',disabled:true},{value:'creative',label:'Creative'},{value:'adventure',label:'Adventure'}];
afterEach(cleanup);
describe('React Select', () => {
  it('selects with the keyboard, skips disabled options, submits and resets its default value', async () => {
    const onValueChange = vi.fn();
    const { getByRole, findByRole, queryByRole, container } = render(<form><Select options={options} label="Game mode" name="mode" defaultValue="survival" onValueChange={onValueChange}/></form>);
    const trigger = getByRole('combobox'); const form = container.querySelector('form')!;
    expect(new FormData(form).get('mode')).toBe('survival');
    fireEvent.click(trigger);
    const list = await findByRole('listbox');
    await waitFor(()=>expect(list).toHaveFocus());
    await waitFor(()=>expect(getByRole('option',{name:'Survival'})).toHaveAttribute('data-highlighted'));
    fireEvent.keyDown(list,{key:'ArrowDown'});
    await waitFor(()=>expect(getByRole('option',{name:'Creative'})).toHaveAttribute('data-highlighted'));
    fireEvent.keyDown(list,{key:'Enter'});
    await waitFor(()=>expect(trigger).toHaveTextContent('Creative'));
    expect(onValueChange).toHaveBeenCalledWith('creative'); expect(new FormData(form).get('mode')).toBe('creative');
    await waitFor(()=>expect(queryByRole('listbox')).not.toBeInTheDocument());
    await waitFor(()=>expect(trigger).toHaveFocus());
    fireEvent.reset(form); await waitFor(()=>expect(trigger).toHaveTextContent('Survival'));
    expect(new FormData(form).get('mode')).toBe('survival');
  });
  it('supports controlled values, ignores disabled option clicks, and closes with Escape', async () => {
    const onValueChange=vi.fn();
    const { getByRole, findByRole, queryByRole }=render(<Select options={options} value="survival" label="Game mode" onValueChange={onValueChange}/>);
    fireEvent.click(getByRole('combobox')); const list=await findByRole('listbox');
    fireEvent.click(getByRole('option',{name:'Spectator'}));expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(getByRole('option',{name:'Creative'}));
    await waitFor(()=>expect(onValueChange).toHaveBeenCalledWith('creative'));
    expect(getByRole('combobox')).toHaveTextContent('Survival');
    await waitFor(()=>expect(queryByRole('listbox')).not.toBeInTheDocument());
    fireEvent.click(getByRole('combobox')); const reopened=await findByRole('listbox');
    await waitFor(()=>expect(reopened).toHaveFocus());fireEvent.keyDown(reopened,{key:'Escape'});
    await waitFor(()=>expect(queryByRole('listbox')).not.toBeInTheDocument());
  });
  it('forwards the trigger ref and prevents disabled fields from opening or submitting', () => {
    const ref=createRef<HTMLButtonElement>();
    const {getByRole,queryByRole,container}=render(<form><Select options={options} aria-label="Game mode" id="mode" name="mode" defaultValue="survival" disabled ref={ref}/></form>);
    const trigger=getByRole('combobox');expect(ref.current).toBe(trigger);expect(trigger).toHaveAttribute('id','mode');expect(trigger).toBeDisabled();
    fireEvent.click(trigger);expect(queryByRole('listbox')).not.toBeInTheDocument();expect(new FormData(container.querySelector('form')!).has('mode')).toBe(false);
  });
});
