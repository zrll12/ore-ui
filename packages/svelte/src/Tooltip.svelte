<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import type { ClassValue, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import * as tooltip from '@zag-js/tooltip';
  import { normalizeProps, portal, useMachine } from '@zag-js/svelte';
  import { tooltipDescription, tooltipMachineProps, observeTooltipPosition, type TooltipOptions } from '@ore-ui/core/tooltip';
  export interface TooltipProps extends TooltipOptions {
    children: Snippet<[{ triggerProps: HTMLButtonAttributes }]>;
    class?: ClassValue;
    style?: HTMLAttributes<HTMLDivElement>['style'];
  }
  const generatedId = $props.id();
  let contentRef: HTMLDivElement | undefined = $state();
  let suppressFocus = false;
  let { children, class: className, style, unstyled = false, withArrow = true, withIcon = false, closable = false,
    closeLabel = 'Close hint', label = 'Information', tailAlign = 'end', content, id, triggerId,
    open = $bindable<boolean | undefined>(), defaultOpen, onOpenChange, disabled, placement, openDelay, closeDelay, offset, dir,
    'aria-describedby': describedBy }: TooltipProps = $props();
  const service = useMachine(tooltip.machine, () => tooltipMachineProps({ content, id, triggerId, open, defaultOpen, disabled,
    placement, openDelay, closeDelay, offset, dir, onOpenChange(next) { if (!next && closable) restoreFocus(); open = next; onOpenChange?.(next); } }, generatedId));
  const api = $derived(tooltip.connect(service, normalizeProps));
  const nativeTrigger = $derived(api.getTriggerProps());
  const triggerProps = $derived({ ...nativeTrigger, 'aria-haspopup': closable ? 'dialog' as const : undefined, 'aria-expanded': closable ? api.open : undefined, 'aria-controls': closable && api.open ? api.getContentProps().id : undefined, 'aria-describedby': tooltipDescription(describedBy, nativeTrigger['aria-describedby']),
    onfocus(event: FocusEvent & { currentTarget: HTMLButtonElement }) { if (!suppressFocus) nativeTrigger.onfocus?.(event); },
    onblur(event: FocusEvent & { currentTarget: HTMLButtonElement }) { if (closable && contentRef?.contains(event.relatedTarget as Node)) return; nativeTrigger.onblur?.(event); },
    onpointerleave(event: PointerEvent & { currentTarget: HTMLButtonElement }) { if (closable && contentRef?.contains(document.activeElement)) return; nativeTrigger.onpointerleave?.(event); },
    onkeydown(event: KeyboardEvent) { if (event.defaultPrevented) return; if (closable && api.open && event.key === 'Tab' && !event.shiftKey) { event.preventDefault(); contentRef?.querySelector('button')?.focus({ preventScroll: true }); } }
  });
  const isOpen = $derived(api.open);
  const activeTriggerId = $derived(nativeTrigger.id);
  $effect(() => {
    const active = isOpen;
    const node = contentRef;
    const config = { placement, tailAlign, offset };
    const trigger = document.getElementById(activeTriggerId!);
    if (!active || !node?.parentElement || !trigger) return;
    return observeTooltipPosition(trigger, node.parentElement, config, value => untrack(() => api.reposition(value)));
  });
  function restoreFocus() { if (!contentRef?.contains(document.activeElement)) return; suppressFocus = true; document.getElementById(nativeTrigger.id!)?.focus({ preventScroll: true }); queueMicrotask(() => { suppressFocus = false; }); }
  function trackContent(node: HTMLDivElement) { contentRef = node; return { destroy() { if (closable) restoreFocus(); contentRef = undefined; } }; }
</script>
{@render children({ triggerProps })}
{#if api.open}
  <div use:portal {...api.getPositionerProps()} data-side={api.getContentProps()['data-side']} data-tail-align={tailAlign} class={unstyled ? undefined : 'ore-tooltip__positioner'}>
    {#if withArrow}<div {...api.getArrowProps()} class={unstyled ? undefined : 'ore-tooltip__arrow'}><span class={unstyled ? undefined : 'ore-tooltip__arrow-tip'}></span></div>{/if}
    <div {...api.getContentProps()} use:trackContent role={closable ? 'dialog' : api.getContentProps().role} aria-label={closable ? label : undefined}
      class={[unstyled ? '' : 'ore-tooltip', className]} style={[api.getContentProps().style, style].filter(Boolean).join(';')}
      onfocusin={() => { if (closable) service.send({ type: 'content.pointer.move' }); }}
      onpointerleave={event => { if (closable && contentRef?.contains(document.activeElement)) return; api.getContentProps().onpointerleave?.(event); }}
      onfocusout={event => { if (closable && !event.currentTarget.contains(event.relatedTarget as Node) && (event.relatedTarget as HTMLElement | null)?.id !== nativeTrigger.id) api.setOpen(false); }}
      onkeydown={event => { if (!closable) return; if (event.key === 'Escape') restoreFocus(); if (event.key === 'Tab' && event.shiftKey) { event.preventDefault(); document.getElementById(nativeTrigger.id!)?.focus({ preventScroll: true }); } }}>
      <div class={unstyled ? undefined : 'ore-tooltip__body'}>
        {#if withIcon}<span class={unstyled ? undefined : 'ore-tooltip__info'} aria-hidden="true"></span>{/if}
        <span class={unstyled ? undefined : 'ore-tooltip__text'}>{content}</span>
        {#if closable}<button type="button" class={unstyled ? undefined : 'ore-tooltip__close'} aria-label={closeLabel} onclick={() => { api.setOpen(false); restoreFocus(); }}><span aria-hidden="true" class={unstyled ? undefined : 'ore-tooltip__close-icon'}>×</span></button>{/if}
      </div>
    </div>
  </div>
{/if}
