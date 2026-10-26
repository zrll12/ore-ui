import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor, act } from '@testing-library/react';
import { createRef } from 'react';
import { Radio, RadioGroup, Checkbox, CheckboxGroup } from '../packages/react/src';
const options=[{value:'survival',label:'Survival'},{value:'spectator',label:'Spectator',disabled:true},{value:'creative',label:'Creative'}];
afterEach(cleanup);
describe('native React choices',()=>{
  it('keeps named uncontrolled radios exclusive across rerenders and form reset',async()=>{
    const view=(className='')=><form><Radio label="Steve" name="skin" value="steve" defaultChecked className={className}/><Radio label="Alex" name="skin" value="alex"/></form>;
    const {getByRole,rerender,container}=render(view());const steve=getByRole('radio',{name:'Steve'});const alex=getByRole('radio',{name:'Alex'});
    fireEvent.click(alex);expect(alex).toBeChecked();expect(steve).not.toBeChecked();rerender(view('new-style'));expect(alex).toBeChecked();expect(steve).not.toBeChecked();
    await act(async()=>container.querySelector('form')!.reset());await waitFor(()=>expect(steve).toBeChecked());expect(alex).not.toBeChecked();
  });
  it('exposes the native checkbox ref, a mixed state, and its submitted checked value',()=>{
    const ref=createRef<HTMLInputElement>();const change=vi.fn();const {getByRole,rerender,container}=render(<form><Checkbox ref={ref} label="All" name="all" value="yes" indeterminate checked={false} onCheckedChange={change}/></form>);
    const input=getByRole('checkbox');expect(ref.current).toBe(input);expect(ref.current!.indeterminate).toBe(true);expect(input).toHaveAttribute('aria-checked','mixed');fireEvent.click(input);expect(change).toHaveBeenCalledWith(true);
    rerender(<form><Checkbox ref={ref} label="All" name="all" value="yes" checked onCheckedChange={change}/></form>);expect(ref.current!.indeterminate).toBe(false);expect(new FormData(container.querySelector('form')!).get('all')).toBe('yes');
  });
  it('submits a single group value, blocks disabled options, and resets its default',async()=>{
    const change=vi.fn();const ref=createRef<HTMLFieldSetElement>();const {getByRole,container}=render(<form><RadioGroup ref={ref} options={options} label="Mode" name="mode" defaultValue="survival" required onValueChange={change}/></form>);
    expect(ref.current).toBe(getByRole('radiogroup',{name:'Mode'}));(getByRole('radio',{name:'Spectator'}) as HTMLInputElement).click();expect(change).not.toHaveBeenCalled();fireEvent.click(getByRole('radio',{name:'Creative'}));expect(change).toHaveBeenCalledWith('creative');const form=container.querySelector('form')!;expect(new FormData(form).get('mode')).toBe('creative');await act(async()=>form.reset());await waitFor(()=>expect(getByRole('radio',{name:'Survival'})).toBeChecked());
  });
  it('requires any enabled checkbox, preserves a disabled selection, and submits repeated values',async()=>{
    const change=vi.fn();const {getByRole,container}=render(<form><CheckboxGroup options={options} label="Rules" name="rules" defaultValue={['spectator']} required onValueChange={change}/></form>);const form=container.querySelector('form')!;
    expect(form.checkValidity()).toBe(false);fireEvent.click(getByRole('checkbox',{name:'Creative'}));expect(change).toHaveBeenCalledWith(['spectator','creative']);await waitFor(()=>expect(form.checkValidity()).toBe(true));expect(new FormData(form).getAll('rules')).toEqual(['creative']);fireEvent.click(getByRole('checkbox',{name:'Survival'}));expect(new FormData(form).getAll('rules')).toEqual(['survival','creative']);await act(async()=>form.reset());await waitFor(()=>expect(getByRole('checkbox',{name:'Creative'})).not.toBeChecked());expect(form.checkValidity()).toBe(false);
  });
  it('retains rejected controlled changes and ignores a canceled reset',async()=>{
    const radioChange=vi.fn();const checkboxChange=vi.fn();const {getByRole,container}=render(<form onReset={e=>e.preventDefault()}><RadioGroup options={options} label="Mode" value="survival" onValueChange={radioChange}/><CheckboxGroup options={options} label="Rules" value={[]} required onValueChange={checkboxChange}/></form>);
    fireEvent.click(getByRole('radio',{name:'Creative'}));expect(getByRole('radio',{name:'Survival'})).toBeChecked();expect(radioChange).toHaveBeenCalledWith('creative');fireEvent.click(getByRole('checkbox',{name:'Creative'}));expect(getByRole('checkbox',{name:'Creative'})).not.toBeChecked();await waitFor(()=>expect(container.querySelector('form')!.checkValidity()).toBe(false));radioChange.mockClear();checkboxChange.mockClear();await act(async()=>container.querySelector('form')!.reset());await Promise.resolve();expect(radioChange).not.toHaveBeenCalled();expect(checkboxChange).not.toHaveBeenCalled();
  });
  it('honors disabled fieldsets and an external form owner',async()=>{
    const {getByRole,container}=render(<><form id="world"/><Checkbox label="Inventory" name="inventory" value="yes" form="world" defaultChecked/><fieldset disabled><RadioGroup options={options} label="Mode" name="mode" defaultValue="survival"/><CheckboxGroup options={options} label="Rules" name="rules" defaultValue={['creative']} required/></fieldset></>);
    expect(getByRole('radio',{name:'Survival'})).toBeDisabled();expect(getByRole('checkbox',{name:'Creative'})).toBeDisabled();const form=container.querySelector('form')!;const inventory=getByRole('checkbox',{name:'Inventory'});fireEvent.click(inventory);expect(new FormData(form).has('inventory')).toBe(false);await act(async()=>form.reset());await waitFor(()=>expect(inventory).toBeChecked());expect(new FormData(form).get('inventory')).toBe('yes');
  });
});
