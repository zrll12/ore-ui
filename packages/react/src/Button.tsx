import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { buttonAttributes, buttonClass, type ButtonOptions } from '../../core/src/index.js';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOptions>, ButtonOptions {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant, size, color, radius, loading = false, fullWidth, unstyled = false,
  className, disabled, type = 'button', children, ...rest
}, ref) {
  return <button {...rest} {...buttonAttributes({ variant, size, color, radius, loading, fullWidth })}
    ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    className={buttonClass(unstyled, className)}>
    {loading && <span className="ore-button__loader" aria-hidden="true" />}
    <span className="ore-button__label">{children}</span>
  </button>;
});
