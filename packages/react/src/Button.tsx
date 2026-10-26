import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { buttonAttributes, buttonClass, type ButtonOptions } from '../../core/src/index.js';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOptions>, ButtonOptions {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant, size, loading = false, fullWidth, unstyled = false,
  className, disabled, type = 'button', children, ...rest
}, ref) {
  return <button {...rest} {...buttonAttributes({ variant, size, loading, fullWidth })}
    ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined}
    className={buttonClass(unstyled, className)}>
    <span className="ore-button__surface"><span className="ore-button__content">
      {loading && <span className="ore-button__loader" aria-hidden="true" />}
      <span className="ore-button__label">{children}</span>
    </span></span>
  </button>;
});
