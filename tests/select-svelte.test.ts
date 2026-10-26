import './select-polyfills';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import Fixture from './SvelteSelectFixture.svelte';
afterEach(cleanup);
describe('Svelte Select',()=>{
  it('binds selection, skips a disabled item with the keyboard, and resets the form',async()=>{
    const onValueChange=vi.fn();const {getByRole,findByRole,queryByRole}=render(Fixture,{onValueChange});
    const trigger=getByRole('combobox');const form=getByRole('form') as HTMLFormElement;
    expect(new FormData(form).get('mode')).toBe('survival');await fireEvent.click(trigger);
    const list=await findByRole('listbox');await waitFor(()=>expect(list).toHaveFocus());
    await waitFor(()=>expect(getByRole('option',{name:'Survival'})).toHaveAttribute('data-highlighted'));
    await fireEvent.keyDown(list,{key:'ArrowDown'});
    await waitFor(()=>expect(getByRole('option',{name:'Creative'})).toHaveAttribute('data-highlighted'));
    await fireEvent.keyDown(list,{key:'Enter'});
    await waitFor(()=>expect(trigger).toHaveTextContent('Creative'));expect(getByRole('status')).toHaveTextContent('creative');expect(onValueChange).toHaveBeenCalledWith('creative');
    expect(new FormData(form).get('mode')).toBe('creative');await waitFor(()=>expect(queryByRole('listbox')).not.toBeInTheDocument());
    await fireEvent.reset(form);await waitFor(()=>expect(trigger).toHaveTextContent('Survival'));expect(getByRole('status')).toHaveTextContent('survival');
  });
  it('cannot open when disabled and is excluded from FormData',async()=>{
    const {getByRole,queryByRole}=render(Fixture,{disabled:true});const trigger=getByRole('combobox');expect(trigger).toBeDisabled();trigger.click();expect(queryByRole('listbox')).not.toBeInTheDocument();expect(new FormData(getByRole('form') as HTMLFormElement).has('mode')).toBe(false);
  });
});
