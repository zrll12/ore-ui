import { Children, Fragment, cloneElement, isValidElement, useId, useEffect, useRef, useCallback, type CSSProperties, type ReactElement, type FocusEvent, type KeyboardEvent } from 'react';
import * as tooltip from '@zag-js/tooltip';
import { mergeProps, normalizeProps, Portal, useMachine } from '@zag-js/react';
import { tooltipDescription, tooltipMachineProps, observeTooltipPosition, type TooltipOptions } from '../../core/src/tooltip.js';
export interface TooltipProps extends TooltipOptions {
  children: ReactElement;
  className?: string;
  style?: CSSProperties;
}
export function Tooltip({ children, className, style, unstyled = false, withArrow = true, withIcon = false,
  closable = false, closeLabel = 'Close hint', label = 'Information', tailAlign = 'end', ...options }: TooltipProps) {
  const child = Children.only(children);
  if (!isValidElement(child) || child.type === Fragment) throw new Error('Tooltip requires one focusable element or a component that forwards native trigger props.');
  const childProps = child.props as Record<string, unknown>;
  const generatedId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const suppressFocus = useRef(false);
  const service = useMachine(tooltip.machine, tooltipMachineProps({ ...options,
    triggerId: options.triggerId ?? (typeof childProps.id === 'string' ? childProps.id : undefined),
    disabled: options.disabled || childProps.disabled === true || childProps.loading === true || childProps['aria-disabled'] === true || childProps['aria-disabled'] === 'true'
  }, generatedId));
  const api = tooltip.connect(service, normalizeProps);
  const nativeTrigger = api.getTriggerProps();
  const repositionRef = useRef(api.reposition);
  repositionRef.current = api.reposition;
  useEffect(() => {
    const trigger = document.getElementById(nativeTrigger.id!);
    const floating = contentRef.current?.parentElement;
    if (!api.open || !trigger || !floating) return;
    return observeTooltipPosition(trigger, floating, { placement: options.placement, tailAlign, offset: options.offset }, value => repositionRef.current(value));
  }, [api.open, nativeTrigger.id, options.placement, options.offset, tailAlign]);
  const restoreFocus = useCallback(() => {
    if (!contentRef.current?.contains(document.activeElement)) return;
    suppressFocus.current = true;
    document.getElementById(nativeTrigger.id!)?.focus({ preventScroll: true });
    queueMicrotask(() => { suppressFocus.current = false; });
  }, [nativeTrigger.id]);
  const bindContent = useCallback((node: HTMLDivElement | null) => { if (!node && closable) restoreFocus(); contentRef.current = node; }, [closable, restoreFocus]);
  const trigger = { ...nativeTrigger,
    onFocus(event: FocusEvent<HTMLButtonElement>) { if (!suppressFocus.current) nativeTrigger.onFocus?.(event); },
    onBlur(event: FocusEvent<HTMLButtonElement>) { if (closable && contentRef.current?.contains(event.relatedTarget as Node)) return; nativeTrigger.onBlur?.(event); },
    onPointerLeave(event: React.PointerEvent<HTMLButtonElement>) { if (closable && contentRef.current?.contains(document.activeElement)) return; nativeTrigger.onPointerLeave?.(event); },
    onKeyDown(event: KeyboardEvent<HTMLButtonElement>) { if (event.defaultPrevented) return; if (closable && api.open && event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); contentRef.current?.querySelector('button')?.focus({ preventScroll: true }); } }
  };
  const merged = mergeProps(trigger, childProps);
  merged.id = nativeTrigger.id;
  if (closable) { merged['aria-haspopup'] = 'dialog'; merged['aria-expanded'] = api.open; merged['aria-controls'] = api.open ? api.getContentProps().id : undefined; }
  merged['aria-describedby'] = tooltipDescription(childProps['aria-describedby'] as string | undefined, options['aria-describedby'], nativeTrigger['aria-describedby']);
  const contentProps = api.getContentProps();
  return <>{cloneElement(child, merged)}{api.open && <Portal>
    <div {...api.getPositionerProps()} data-side={(contentProps as typeof contentProps & { 'data-side'?: string })['data-side']} data-tail-align={tailAlign} className={unstyled ? undefined : 'ore-tooltip__positioner'}>
      {withArrow && <div {...api.getArrowProps()} className={unstyled ? undefined : 'ore-tooltip__arrow'}><span className={unstyled ? undefined : 'ore-tooltip__arrow-tip'}/></div>}
      <div {...contentProps} ref={bindContent} role={closable ? 'dialog' : contentProps.role} aria-label={closable ? label : undefined}
        className={[unstyled ? '' : 'ore-tooltip', className].filter(Boolean).join(' ')} style={{ ...contentProps.style, ...style }}
        onFocus={() => { if (closable) service.send({ type: 'content.pointer.move' }); }}
        onPointerLeave={event => { if (closable && contentRef.current?.contains(document.activeElement)) return; contentProps.onPointerLeave?.(event); }}
        onBlur={event => { if (closable && !event.currentTarget.contains(event.relatedTarget as Node) && (event.relatedTarget as HTMLElement | null)?.id !== nativeTrigger.id) api.setOpen(false); }}
        onKeyDown={event => { if (!closable) return; if (event.key === 'Escape') restoreFocus(); if (event.key === 'Tab' && event.shiftKey) { event.preventDefault(); document.getElementById(nativeTrigger.id!)?.focus({ preventScroll: true }); } }}>
        <div className={unstyled ? undefined : 'ore-tooltip__body'}>
          {withIcon && <span className={unstyled ? undefined : 'ore-tooltip__info'} aria-hidden="true"/>}
          <span className={unstyled ? undefined : 'ore-tooltip__text'}>{options.content}</span>
          {closable && <button type="button" className={unstyled ? undefined : 'ore-tooltip__close'} aria-label={closeLabel} onClick={() => { api.setOpen(false); restoreFocus(); }}><span aria-hidden="true" className={unstyled ? undefined : 'ore-tooltip__close-icon'}>×</span></button>}
        </div>
      </div>
    </div>
  </Portal>}</>;
}
