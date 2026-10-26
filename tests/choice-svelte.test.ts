import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor, act } from '@testing-library/svelte';
import Fixture from './SvelteChoiceFixture.svelte';
afterEach(cleanup);
describe('native Svelte choices',()=>{
  it('binds standalone checked state and preserves native named radio exclusivity',async()=>{
    const {getByRole}=render(Fixture,{required:false});const steve=getByRole('radio',{name:'Steve'});const alex=getByRole('radio',{name:'Alex'});expect(steve).toBeChecked();await fireEvent.click(alex);expect(alex).toBeChecked();expect(steve).not.toBeChecked();await fireEvent.click(getByRole('checkbox',{name:'Accept'}));expect(getByRole('status',{name:'Checked value'})).toHaveTextContent('true');expect((getByRole('checkbox',{name:'Mixed'}) as HTMLInputElement).indeterminate).toBe(true);
  });
  it('binds both group values, validates any-checkbox required, and resets to initial values',async()=>{
    const onValueChange=vi.fn();const {getByRole}=render(Fixture,{onValueChange});const form=getByRole('form') as HTMLFormElement;expect(form.checkValidity()).toBe(false);await fireEvent.click(getByRole('radio',{name:'Creative'}));expect(getByRole('status',{name:'Mode value'})).toHaveTextContent('creative');await fireEvent.click(getByRole('checkbox',{name:'Creative'}));expect(onValueChange).toHaveBeenCalledWith(['creative']);expect(getByRole('status',{name:'Rules value'})).toHaveTextContent('creative');expect(new FormData(form).getAll('rules')).toEqual(['creative']);expect(form.checkValidity()).toBe(true);await act(()=>form.reset());await waitFor(()=>expect(getByRole('radio',{name:'Survival'})).toBeChecked());expect(getByRole('checkbox',{name:'Creative'})).not.toBeChecked();expect(form.checkValidity()).toBe(false);
  });
  it('honors inherited disabled state and omits the groups from FormData',()=>{
    const {getByRole}=render(Fixture,{disabled:true});expect(getByRole('radio',{name:'Survival'})).toBeDisabled();expect(getByRole('checkbox',{name:'Creative'})).toBeDisabled();const data=new FormData(getByRole('form') as HTMLFormElement);expect(data.has('mode')).toBe(false);expect(data.has('rules')).toBe(false);
  });
});
