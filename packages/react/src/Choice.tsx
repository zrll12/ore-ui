import { forwardRef, useCallback, useEffect, useId, useReducer, useRef, useState, type CSSProperties, type ForwardedRef, type InputHTMLAttributes } from 'react';
import { choiceAttributes, listenChoiceReset, syncCheckboxGroupValidity, syncIndeterminate, toggleChoiceValue, validateChoiceItems, type ChoiceAppearance, type CheckboxGroupOptions, type RadioGroupOptions } from '../../core/src/choice.js';
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'>, ChoiceAppearance { onCheckedChange?: (checked: boolean) => void }
export interface CheckboxProps extends RadioProps { indeterminate?: boolean }
export interface RadioGroupProps extends RadioGroupOptions { className?: string; style?: CSSProperties }
export interface CheckboxGroupProps extends CheckboxGroupOptions { className?: string; style?: CSSProperties }
function setRef<T>(ref: ForwardedRef<T>, value: T | null) { if (typeof ref === 'function') ref(value); else if (ref) ref.current = value; }
function useChoiceValue<T>(controlled: T | undefined, defaultValue: T | undefined, fallback: T, onChange?: (value: T) => void) {
  const initial = useRef(defaultValue ?? controlled ?? fallback);
  const [internal, setInternal] = useState(initial.current);
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const change = (value: T) => { if (controlled === undefined) setInternal(value); onChange?.(value); };
  const reset = () => { change(initial.current); refresh(); };
  return { value: controlled ?? internal, change, reset };
}
function useReset(element: React.RefObject<HTMLInputElement | HTMLFieldSetElement | null>, reset: () => void) {
  const latest = useRef(reset); latest.current = reset;
  useEffect(() => { if (element.current) return listenChoiceReset(element.current, () => latest.current()); });
}
interface ChoiceInputProps extends CheckboxProps { type: 'radio' | 'checkbox' }
const ChoiceInput = forwardRef<HTMLInputElement, ChoiceInputProps>(function ChoiceInput({
  type, label, description, variant, size, invalid, unstyled = false, className, style,
  indeterminate = false, id, onChange, onCheckedChange, 'aria-describedby': ariaDescribedby, ...rest
}, ref) {
  const generated = useId(); const inputId = id ?? `ore-choice-${generated}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const attributes = choiceAttributes({ variant, size, invalid });
  const inputRef = useCallback((node: HTMLInputElement | null) => { syncIndeterminate(node, indeterminate); setRef(ref, node); }, [ref, indeterminate]);
  return <label {...attributes} data-kind={type} className={[unstyled ? '' : 'ore-choice', className].filter(Boolean).join(' ')} style={style}>
    <input {...rest} ref={inputRef} id={inputId} type={type} className={unstyled ? undefined : 'ore-choice__input'}
      aria-invalid={invalid || undefined} aria-checked={type === 'checkbox' && indeterminate ? 'mixed' : undefined}
      aria-describedby={[ariaDescribedby, descriptionId].filter(Boolean).join(' ') || undefined}
      onChange={event => { onCheckedChange?.(event.currentTarget.checked); onChange?.(event); syncIndeterminate(event.currentTarget, indeterminate); }}/>
    <span className={unstyled ? undefined : 'ore-choice__control'} aria-hidden="true"><span className={unstyled ? undefined : 'ore-choice__mark'}/></span>
    {(label || description) && <span className={unstyled ? undefined : 'ore-choice__copy'}>{label && <span className={unstyled ? undefined : 'ore-choice__label'}>{label}</span>}{description && <span id={descriptionId} className={unstyled ? undefined : 'ore-choice__description'}>{description}</span>}</span>}
  </label>;
});
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ checked, defaultChecked, onCheckedChange, ...props }, ref) {
  const element = useRef<HTMLInputElement>(null);
  const initial = useRef(defaultChecked ?? checked ?? false);
  const [, refresh] = useReducer((n: number) => n + 1, 0);
  const composed = useCallback((node: HTMLInputElement | null) => { element.current = node; setRef(ref, node); }, [ref]);
  useReset(element, () => { onCheckedChange?.(checked === undefined ? !!element.current?.checked : initial.current); refresh(); });
  return <ChoiceInput {...props} type="radio" checked={checked} defaultChecked={defaultChecked} onCheckedChange={onCheckedChange} ref={composed}/>;
});
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({ checked, defaultChecked, onCheckedChange, ...props }, ref) {
  const element = useRef<HTMLInputElement>(null);
  const state = useChoiceValue(checked, defaultChecked, false, onCheckedChange);
  const composed = useCallback((node: HTMLInputElement | null) => { element.current = node; setRef(ref, node); }, [ref]);
  useReset(element, () => { state.reset(); syncIndeterminate(element.current, props.indeterminate); });
  return <ChoiceInput {...props} type="checkbox" checked={state.value} onCheckedChange={state.change} ref={composed}/>;
});
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup({ options, value, defaultValue, onValueChange, label, description, variant, size, invalid, unstyled = false, disabled, required, name, form, id, orientation = 'vertical', className, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby }, ref) {
  validateChoiceItems(options);
  const generated = useId(); const groupId = id ?? `ore-radio-group-${generated}`;
  const element = useRef<HTMLFieldSetElement>(null); const state = useChoiceValue(value, defaultValue, '', onValueChange);
  const composed = useCallback((node: HTMLFieldSetElement | null) => { element.current = node; setRef(ref, node); }, [ref]);
  useReset(element, state.reset);
  return <fieldset ref={composed} id={groupId} role="radiogroup" aria-label={ariaLabel} aria-required={required || undefined} aria-invalid={invalid || undefined} aria-describedby={[ariaDescribedby, description ? `${groupId}-description` : undefined].filter(Boolean).join(' ') || undefined}
    disabled={disabled} form={form} {...choiceAttributes({ variant, size, invalid })} data-orientation={orientation} className={[unstyled ? '' : 'ore-choice-group', className].filter(Boolean).join(' ')} style={style}>
    {label && <legend className={unstyled ? undefined : 'ore-choice-group__legend'}>{label}{required && <span aria-hidden="true"> *</span>}</legend>}
    {description && <p id={`${groupId}-description`} className={unstyled ? undefined : 'ore-choice-group__description'}>{description}</p>}
    <div className={unstyled ? undefined : 'ore-choice-group__items'}>{options.map((item, index) => <ChoiceInput key={item.value} type="radio" id={`${groupId}-${index}`} name={name ?? groupId} form={form} value={item.value} label={item.label} description={item.description} disabled={item.disabled} required={required} checked={state.value === item.value} onCheckedChange={selected => { if (selected) state.change(item.value); }} variant={variant} size={size} invalid={invalid} unstyled={unstyled}/>)}</div>
  </fieldset>;
});
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup({ options, value, defaultValue, onValueChange, label, description, variant, size, invalid, unstyled = false, disabled, required = false, name, form, id, orientation = 'vertical', className, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby }, ref) {
  validateChoiceItems(options);
  const generated = useId(); const groupId = id ?? `ore-checkbox-group-${generated}`;
  const element = useRef<HTMLFieldSetElement>(null); const state = useChoiceValue(value, defaultValue, [] as string[], onValueChange);
  const composed = useCallback((node: HTMLFieldSetElement | null) => { element.current = node; setRef(ref, node); }, [ref]);
  const help = description ?? (required ? 'Choose at least one option.' : undefined);
  useReset(element, state.reset);
  useEffect(() => { syncCheckboxGroupValidity(element.current, required); });
  return <fieldset ref={composed} id={groupId} aria-label={ariaLabel} aria-describedby={[ariaDescribedby, help ? `${groupId}-description` : undefined].filter(Boolean).join(' ') || undefined}
    disabled={disabled} form={form} {...choiceAttributes({ variant, size, invalid })} data-orientation={orientation} className={[unstyled ? '' : 'ore-choice-group', className].filter(Boolean).join(' ')} style={style}>
    {label && <legend className={unstyled ? undefined : 'ore-choice-group__legend'}>{label}{required && <span aria-hidden="true"> *</span>}</legend>}
    {help && <p id={`${groupId}-description`} className={unstyled ? undefined : 'ore-choice-group__description'}>{help}</p>}
    <div className={unstyled ? undefined : 'ore-choice-group__items'}>{options.map((item, index) => <ChoiceInput key={item.value} type="checkbox" id={`${groupId}-${index}`} name={name} form={form} value={item.value} label={item.label} description={item.description} disabled={item.disabled} checked={state.value.includes(item.value)} onCheckedChange={selected => { state.change(toggleChoiceValue(state.value, item.value, selected, options)); queueMicrotask(() => syncCheckboxGroupValidity(element.current, required)); }} variant={variant} size={size} invalid={invalid} unstyled={unstyled}/>)}</div>
  </fieldset>;
});
