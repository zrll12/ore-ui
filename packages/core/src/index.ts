/** Semantic palettes from the Minecraft Ore UI Figma Button component set. */
export const buttonVariants = ['colored', 'general', 'destructive', 'warning', 'realms'] as const;
/** Scale presets; xl reproduces the source component's 105px height / 36px type. */
export const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export interface ButtonOptions {
  variant?: (typeof buttonVariants)[number];
  size?: (typeof buttonSizes)[number];
  loading?: boolean;
  fullWidth?: boolean;
  unstyled?: boolean;
}
/** Stable data attributes are the contract between adapters and the shared stylesheet. */
export function buttonAttributes({ variant = 'colored', size = 'md', loading = false, fullWidth = false }: ButtonOptions = {}) {
  return { 'data-variant': variant, 'data-size': size,
    'data-loading': loading ? '' : undefined, 'data-full-width': fullWidth ? '' : undefined };
}
export function buttonClass(unstyled = false, className?: string) {
  return [unstyled ? '' : 'ore-button', className].filter(Boolean).join(' ');
}
