import * as select from '@zag-js/select';
import type { ButtonOptions } from './index.js';
export interface SelectItem { value: string; label: string; disabled?: boolean }
export interface SelectOptions {
  options: readonly SelectItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  name?: string;
  form?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  variant?: ButtonOptions['variant'];
  size?: ButtonOptions['size'];
  fullWidth?: boolean;
  unstyled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
export function createSelectCollection(options: readonly SelectItem[]): ReturnType<typeof select.collection<SelectItem>> {
  const values = new Set<string>();
  for (const option of options) {
    if (!option.value || values.has(option.value)) throw new Error('Select options require unique, non-empty values.');
    values.add(option.value);
  }
  return select.collection<SelectItem>({ items: [...options], itemToString: item => item.label,
    itemToValue: item => item.value, isItemDisabled: item => !!item.disabled });
}
export function selectMachineProps(options: SelectOptions, machineId: string, collection: ReturnType<typeof createSelectCollection>): select.Props<SelectItem> {
  return { id: machineId, ids: options.id ? { trigger: options.id } : undefined, collection,
    value: options.value === undefined ? undefined : options.value ? [options.value] : [],
    defaultValue: options.defaultValue ? [options.defaultValue] : [],
    onValueChange: details => options.onValueChange?.(details.value[0] ?? ''),
    name: options.name, form: options.form, disabled: options.disabled, required: options.required,
    invalid: options.invalid, multiple: false, loopFocus: false, closeOnSelect: true,
    positioning: { placement: 'bottom-start', gutter: 4, sameWidth: true, strategy: 'fixed' } };
}
export function selectAttributes({ variant = 'general', size = 'md', fullWidth, invalid }: Pick<SelectOptions, 'variant' | 'size' | 'fullWidth' | 'invalid'>) {
  return { 'data-variant': variant, 'data-size': size, 'data-full-width': fullWidth ? '' : undefined,
    'data-invalid': invalid ? '' : undefined };
}
