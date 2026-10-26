import { forwardRef } from 'react';
import { Checkbox, type CheckboxProps } from './Choice';

export interface SwitchProps extends Omit<CheckboxProps, 'indeterminate' | 'role' | 'aria-checked'> { withIcons?: boolean }

/** A two-state native form control; checkedness remains the single source of truth. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({ className, withIcons = true, ...props }, ref) {
  return <Checkbox {...props} ref={ref} role="switch" className={['ore-switch', withIcons && 'ore-switch--icons', className].filter(Boolean).join(' ')}/>;
});
