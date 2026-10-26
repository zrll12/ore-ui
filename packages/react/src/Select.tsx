import { forwardRef, useId, useMemo, type CSSProperties } from 'react';
import * as select from '@zag-js/select';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import { createSelectCollection, selectAttributes, selectMachineProps, type SelectOptions } from '../../core/src/select.js';
import { buttonClass } from '../../core/src/index.js';
export interface SelectProps extends SelectOptions { className?: string; style?: CSSProperties }
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const { options, label, placeholder = 'Select an option', className, style, unstyled = false } = props;
  const machineId = useId();
  const collection = useMemo(() => createSelectCollection(options), [options]);
  const service = useMachine(select.machine, selectMachineProps(props, machineId, collection));
  const api = select.connect(service, normalizeProps);
  const attributes = selectAttributes(props);
  const accessibleLabel = props['aria-label'] ?? (label ? undefined : placeholder);
  return <div {...api.getRootProps()} {...attributes} className={[unstyled ? '' : 'ore-select', className].filter(Boolean).join(' ')} style={style}>
    {label && <label {...api.getLabelProps()} className={unstyled ? undefined : 'ore-select__label'}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>}
    <select {...api.getHiddenSelectProps()} aria-label={accessibleLabel}>
      <option value="" />
      {options.map(item => <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>)}
    </select>
    <div {...api.getControlProps()}>
      <button {...api.getTriggerProps()} {...attributes} ref={ref} className={buttonClass(unstyled, unstyled ? undefined : 'ore-select__trigger')}
        aria-label={accessibleLabel} aria-labelledby={label ? api.getTriggerProps()['aria-labelledby'] : undefined} aria-describedby={props['aria-describedby']}>
        <span className="ore-button__surface"><span className="ore-button__content"><span className="ore-button__label">
          <span {...api.getValueTextProps()} className={unstyled ? undefined : 'ore-select__value'} data-placeholder={api.empty ? '' : undefined}>{api.valueAsString || placeholder}</span>
          <span {...api.getIndicatorProps()} aria-hidden="true" className={unstyled ? undefined : 'ore-select__indicator'}>▾</span>
        </span></span></span>
      </button>
    </div>
    {api.open && <Portal><div {...api.getPositionerProps()} {...attributes} className={unstyled ? undefined : 'ore-select__positioner'}>
      <div {...api.getContentProps()} aria-label={accessibleLabel} aria-labelledby={label ? api.getContentProps()['aria-labelledby'] : undefined} className={unstyled ? undefined : 'ore-select__content'}>
        {options.length ? options.map(item => <div key={item.value} {...api.getItemProps({ item })} className={unstyled ? undefined : 'ore-select__item'}>
          <span {...api.getItemTextProps({ item })}>{item.label}</span>
          <span {...api.getItemIndicatorProps({ item })} aria-hidden="true" className={unstyled ? undefined : 'ore-select__check'}>✓</span>
        </div>) : <div className={unstyled ? undefined : 'ore-select__empty'}>No options</div>}
      </div>
    </div></Portal>}
  </div>;
});
