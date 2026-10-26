export const buttonVariants = ['filled', 'light', 'outline', 'subtle'] as const;
export const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export const buttonColors = ['violet', 'blue', 'teal', 'rose', 'amber', 'slate'] as const;
export const buttonRadii = ['none', 'sm', 'md', 'lg', 'full'] as const;
export interface ButtonOptions {
  variant?: (typeof buttonVariants)[number];
  size?: (typeof buttonSizes)[number];
  color?: (typeof buttonColors)[number];
  radius?: (typeof buttonRadii)[number];
  loading?: boolean;
  fullWidth?: boolean;
  unstyled?: boolean;
}
/** Stable data attributes are the contract between adapters and the shared stylesheet. */
export function buttonAttributes({ variant = 'filled', size = 'md', color = 'violet', radius = 'md', loading = false, fullWidth = false }: ButtonOptions = {}) {
  return { 'data-variant': variant, 'data-size': size, 'data-color': color, 'data-radius': radius,
    'data-loading': loading ? '' : undefined, 'data-full-width': fullWidth ? '' : undefined };
}
export function buttonClass(unstyled = false, className?: string) {
  return [unstyled ? '' : 'ore-button', className].filter(Boolean).join(' ');
}
