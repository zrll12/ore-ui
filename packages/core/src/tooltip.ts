import { autoUpdate, autoPlacement, computePosition, flip, offset, shift, type Placement } from '@floating-ui/dom';
import type * as tooltip from '@zag-js/tooltip';
export const tooltipPlacements = ['auto', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'] as const;
export type TooltipPlacement = typeof tooltipPlacements[number];
export interface TooltipOptions {
  content: string;
  id?: string;
  triggerId?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  placement?: TooltipPlacement;
  openDelay?: number;
  closeDelay?: number;
  offset?: number;
  withArrow?: boolean;
  withIcon?: boolean;
  closable?: boolean;
  closeLabel?: string;
  label?: string;
  /** Staircase direction only; the arrow anchor always follows the positioning engine. */
  tailAlign?: 'auto' | 'start' | 'end';
  unstyled?: boolean;
  dir?: 'ltr' | 'rtl';
  'aria-describedby'?: string;
}
const nonnegative = (value: number | undefined, fallback: number) => value === undefined || !Number.isFinite(value) ? fallback : Math.max(0, value);
export function tooltipMachineProps(options: TooltipOptions, generatedId: string): tooltip.Props {
  const placement = options.placement === 'auto' ? 'top' : options.placement ?? 'top-end';
  const [side, align] = placement.split('-');
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side as 'top' | 'bottom' | 'left' | 'right'];
  const fallbackSides = [opposite, ...(side === 'left' || side === 'right' ? ['top', 'bottom'] : ['right', 'left'])];
  const flip = fallbackSides.map(value => `${value}${align ? `-${align}` : ''}` as Placement);
  const disabled = !!options.disabled || !options.content.trim();
  return { id: options.id ?? generatedId, ids: options.triggerId ? { trigger: options.triggerId } : undefined,
    disabled, open: disabled ? false : options.open, defaultOpen: disabled ? false : options.defaultOpen,
    onOpenChange: details => options.onOpenChange?.(details.open), dir: options.dir,
    openDelay: nonnegative(options.openDelay, 400), closeDelay: nonnegative(options.closeDelay, 150),
    interactive: true, closeOnEscape: true, closeOnClick: true, closeOnPointerDown: true, closeOnScroll: true,
    positioning: { listeners: false, placement, flip, fitViewport: true, overflowPadding: 12, gutter: nonnegative(options.offset, 8), strategy: 'fixed' } };
}
export function tooltipDescription(...ids: (string | null | undefined)[]) {
  return [...new Set(ids.flatMap(id => id?.split(/\s+/).filter(Boolean) ?? []))].join(' ') || undefined;
}

/** Observe only while mounted/open. Includes viewport, ancestor, element-size and layout changes. */
export function observeTooltipPosition(trigger: HTMLElement, floating: HTMLElement,
  options: Pick<TooltipOptions, 'placement' | 'tailAlign' | 'offset'>,
  reposition: (options: { placement: Placement; flip: false }) => void) {
  let disposed = false;
  let revision = 0;
  const update = async () => {
    const current = ++revision;
    const arrow = floating.querySelector<HTMLElement>('[data-part="arrow"]');
    const result = await computePosition(trigger, floating, {
      strategy: 'fixed', placement: options.placement === 'auto' ? 'top' : options.placement ?? 'top-end',
      middleware: [offset(nonnegative(options.offset, 8) + (arrow?.clientHeight ?? 0) / 2),
        options.placement === 'auto' ? autoPlacement({ padding: 12 }) : flip({ padding: 12, fallbackAxisSideDirection: 'end' }),
        shift({ padding: 12 })]
    });
    if (disposed || current !== revision) return;
    if (options.tailAlign === 'auto') {
      const rect = trigger.getBoundingClientRect();
      const vertical = result.placement.startsWith('top') || result.placement.startsWith('bottom');
      const start = vertical ? rect.left + rect.width / 2 < result.x + floating.offsetWidth / 2 - 1
        : rect.top + rect.height / 2 < result.y + floating.offsetHeight / 2 - 1;
      floating.dataset.tailDirection = start ? 'start' : 'end';
    } else delete floating.dataset.tailDirection;
    reposition({ placement: result.placement, flip: false });
  };
  const cleanup = autoUpdate(trigger, floating, () => { void update(); });
  return () => { disposed = true; revision++; cleanup(); };
}
