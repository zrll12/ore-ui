<script lang="ts">
  import { untrack } from 'svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import ChoiceInput from './ChoiceInput.svelte';
  import { choiceAttributes, listenChoiceReset, validateChoiceItems, syncCheckboxGroupValidity, toggleChoiceValue, type CheckboxGroupOptions } from '@ore-ui/core/choice';
  export interface CheckboxGroupProps extends CheckboxGroupOptions { class?: ClassValue; style?: HTMLAttributes<HTMLFieldSetElement>['style']; ref?: HTMLFieldSetElement }
  const generated = $props.id();
  let { options, value = $bindable<string[] | undefined>(), defaultValue, onValueChange, label, description, variant, size, invalid, unstyled = false,
    disabled, required = false, name, form, id, orientation = 'vertical', class: className, style, ref = $bindable(), 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby }: CheckboxGroupProps = $props();
  const groupId = $derived(id ?? `ore-checkbox-group-${generated}`);
  const initial = untrack(() => [...(defaultValue ?? value ?? [])]);
  const current = $derived(value ?? defaultValue ?? []);
  const items = $derived.by(() => { validateChoiceItems(options); return options; });
  const help = $derived(description ?? (required ? 'Choose at least one option.' : undefined));
  function change(next: string[]) { value = next; onValueChange?.(next); }
  $effect(() => { if (ref) return listenChoiceReset(ref, () => change([...initial])); });
  $effect(() => { void current; void options; const fieldset = ref; const needed = required; syncCheckboxGroupValidity(fieldset, needed); queueMicrotask(() => syncCheckboxGroupValidity(fieldset, needed)); });
</script>
<fieldset id={groupId} bind:this={ref} aria-label={ariaLabel}
  aria-describedby={[ariaDescribedby, help ? `${groupId}-description` : undefined].filter(Boolean).join(' ') || undefined}
  {disabled} {form} {...choiceAttributes({ variant, size, invalid })} data-orientation={orientation} class={[unstyled ? '' : 'ore-choice-group', className]} {style}>
  {#if label}<legend class={unstyled ? undefined : 'ore-choice-group__legend'}>{label}{#if required}<span aria-hidden="true"> *</span>{/if}</legend>{/if}
  {#if help}<p id={`${groupId}-description`} class={unstyled ? undefined : 'ore-choice-group__description'}>{help}</p>{/if}
  <div class={unstyled ? undefined : 'ore-choice-group__items'}>{#each items as item, index (item.value)}<ChoiceInput type="checkbox" id={`${groupId}-${index}`} {name} {form} value={item.value} label={item.label} description={item.description} disabled={item.disabled} checked={current.includes(item.value)} onCheckedChange={selected => { change(toggleChoiceValue(current, item.value, selected, options)); queueMicrotask(() => syncCheckboxGroupValidity(ref, required)); }} {variant} {size} {invalid} {unstyled}/>{/each}</div>
</fieldset>
