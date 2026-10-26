<script lang="ts">
  import { untrack } from 'svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import ChoiceInput from './ChoiceInput.svelte';
  import { choiceAttributes, listenChoiceReset, validateChoiceItems, type RadioGroupOptions } from '@ore-ui/core/choice';
  export interface RadioGroupProps extends RadioGroupOptions { class?: ClassValue; style?: HTMLAttributes<HTMLFieldSetElement>['style']; ref?: HTMLFieldSetElement }
  const generated = $props.id();
  let { options, value = $bindable<string | undefined>(), defaultValue, onValueChange, label, description, variant, size, invalid, unstyled = false,
    disabled, required, name, form, id, orientation = 'vertical', class: className, style, ref = $bindable(), 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby }: RadioGroupProps = $props();
  const groupId = $derived(id ?? `ore-radio-group-${generated}`);
  const initial = untrack(() => defaultValue ?? value ?? '');
  const current = $derived(value ?? defaultValue ?? '');
  const items = $derived.by(() => { validateChoiceItems(options); return options; });
  function change(next: string) { value = next; onValueChange?.(next); }
  $effect(() => { if (ref) return listenChoiceReset(ref, () => change(initial)); });
</script>
<fieldset id={groupId} bind:this={ref} role="radiogroup" aria-label={ariaLabel} aria-required={required || undefined} aria-invalid={invalid || undefined}
  aria-describedby={[ariaDescribedby, description ? `${groupId}-description` : undefined].filter(Boolean).join(' ') || undefined}
  {disabled} {form} {...choiceAttributes({ variant, size, invalid })} data-orientation={orientation} class={[unstyled ? '' : 'ore-choice-group', className]} {style}>
  {#if label}<legend class={unstyled ? undefined : 'ore-choice-group__legend'}>{label}{#if required}<span aria-hidden="true"> *</span>{/if}</legend>{/if}
  {#if description}<p id={`${groupId}-description`} class={unstyled ? undefined : 'ore-choice-group__description'}>{description}</p>{/if}
  <div class={unstyled ? undefined : 'ore-choice-group__items'}>{#each items as item, index (item.value)}<ChoiceInput type="radio" id={`${groupId}-${index}`} name={name ?? groupId} {form} value={item.value} label={item.label} description={item.description} disabled={item.disabled} {required} checked={current === item.value} onCheckedChange={selected => { if (selected) change(item.value); }} {variant} {size} {invalid} {unstyled}/>{/each}</div>
</fieldset>
