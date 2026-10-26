<script lang="ts">
  import type { ClassValue, HTMLInputAttributes } from 'svelte/elements';
  import { choiceAttributes, syncIndeterminate, type ChoiceAppearance } from '@ore-ui/core/choice';
  export interface ChoiceInputProps extends Omit<HTMLInputAttributes, 'size' | 'type'>, ChoiceAppearance {
    type: 'radio' | 'checkbox'; class?: ClassValue; ref?: HTMLInputElement; indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
  const generated = $props.id();
  let { type, label, description, variant, size, invalid, unstyled = false, class: className, style, id,
    ref = $bindable(), indeterminate = false, checked, defaultChecked, onCheckedChange, onchange, 'aria-describedby': ariaDescribedby, ...rest }: ChoiceInputProps = $props();
  const inputId = $derived(id ?? `ore-choice-${generated}`);
  const descriptionId = $derived(description ? `${inputId}-description` : undefined);
  $effect(() => { syncIndeterminate(ref, indeterminate); });
</script>
<label {...choiceAttributes({ variant, size, invalid })} data-kind={type} class={[unstyled ? '' : 'ore-choice', className]} {style}>
  <input {...rest} checked={checked ?? defaultChecked} {defaultChecked} {type} id={inputId} bind:this={ref} class={unstyled ? undefined : 'ore-choice__input'}
    aria-invalid={invalid || undefined} aria-checked={type === 'checkbox' && indeterminate ? 'mixed' : undefined}
    aria-describedby={[ariaDescribedby, descriptionId].filter(Boolean).join(' ') || undefined}
    onchange={event => { onCheckedChange?.(event.currentTarget.checked); onchange?.(event); syncIndeterminate(ref, indeterminate); }}/>
  <span class={unstyled ? undefined : 'ore-choice__control'} aria-hidden="true"><span class={unstyled ? undefined : 'ore-choice__mark'}></span></span>
  {#if label || description}<span class={unstyled ? undefined : 'ore-choice__copy'}>{#if label}<span class={unstyled ? undefined : 'ore-choice__label'}>{label}</span>{/if}{#if description}<span id={descriptionId} class={unstyled ? undefined : 'ore-choice__description'}>{description}</span>{/if}</span>{/if}
</label>
