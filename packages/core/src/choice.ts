import type { ButtonOptions } from './index.js';
export interface ChoiceAppearance {
  label?: string;
  description?: string;
  variant?: ButtonOptions['variant'];
  size?: ButtonOptions['size'];
  invalid?: boolean;
  unstyled?: boolean;
}
export interface ChoiceItem { value: string; label: string; description?: string; disabled?: boolean }
export interface ChoiceGroupOptions extends ChoiceAppearance {
  options: readonly ChoiceItem[];
  name?: string;
  form?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'vertical' | 'horizontal';
  'aria-label'?: string;
  'aria-describedby'?: string;
}
export interface RadioGroupOptions extends ChoiceGroupOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
export interface CheckboxGroupOptions extends ChoiceGroupOptions {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
export function choiceAttributes({ variant = 'colored', size = 'md', invalid }: ChoiceAppearance) {
  return { 'data-variant': variant, 'data-size': size, 'data-invalid': invalid ? '' : undefined };
}
export function validateChoiceItems(options: readonly ChoiceItem[]) {
  const values = new Set<string>();
  for (const item of options) {
    if (!item.value || values.has(item.value)) throw new Error('Choice groups require unique, non-empty option values.');
    values.add(item.value);
  }
}
export function toggleChoiceValue(current: readonly string[], value: string, checked: boolean, options: readonly ChoiceItem[]) {
  const next = new Set(current);
  if (checked) next.add(value); else next.delete(value);
  return options.filter(item => next.has(item.value)).map(item => item.value);
}
export function syncIndeterminate(input: HTMLInputElement | null | undefined, indeterminate = false) {
  if (input?.type === 'checkbox') input.indeterminate = indeterminate;
}
/** Use the real form owner (including form=); wait until the cancelable reset has completed. */
export function listenChoiceReset(element: HTMLInputElement | HTMLFieldSetElement, reset: () => void) {
  const form = element.form;
  if (!form) return () => {};
  let active = true;
  const listener = (event: Event) => queueMicrotask(() => { if (active && !event.defaultPrevented) reset(); });
  form.addEventListener('reset', listener);
  return () => { active = false; form.removeEventListener('reset', listener); };
}
/** One native validation target enforces at-least-one, rather than requiring every checkbox. */
export function syncCheckboxGroupValidity(fieldset: HTMLFieldSetElement | null | undefined, required: boolean) {
  if (!fieldset) return;
  const inputs = [...fieldset.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  for (const input of inputs) input.setCustomValidity('');
  const enabled = inputs.filter(input => !input.disabled);
  if (required && enabled.length && !enabled.some(input => input.checked)) enabled[0].setCustomValidity('Select at least one option.');
}
