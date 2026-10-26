<script lang="ts">
  import * as select from '@zag-js/select';
  import { useMachine, normalizeProps, portal } from '@zag-js/svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';
  import { createSelectCollection, selectAttributes, selectMachineProps, type SelectOptions } from '@ore-ui/core/select';
  export interface SelectProps extends SelectOptions { class?: ClassValue; style?: HTMLAttributes<HTMLDivElement>['style']; ref?: HTMLButtonElement }
  const machineId = $props.id();
  let { options, value = $bindable<string | undefined>(), defaultValue, onValueChange, label,
    placeholder = 'Select an option', id, name, form, disabled, required, invalid, variant = 'general', size = 'md',
    fullWidth, unstyled = false, class: className, style, ref = $bindable(), 'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby }: SelectProps = $props();
  const collection = $derived(createSelectCollection(options));
  const service = useMachine(select.machine, () => selectMachineProps({ options, value, defaultValue, id, name,
    form, disabled, required, invalid, onValueChange(next) { value = next; onValueChange?.(next); } }, machineId, collection));
  const api = $derived(select.connect(service, normalizeProps));
  const attributes = $derived(selectAttributes({ variant, size, fullWidth, invalid }));
  const accessibleLabel = $derived(ariaLabel ?? (label ? undefined : placeholder));
</script>
<div {...api.getRootProps()} {...attributes} class={[unstyled ? '' : 'ore-select', className]} {style}>
  {#if label}<label {...api.getLabelProps()} class={unstyled ? undefined : 'ore-select__label'}>{label}{#if required}<span aria-hidden="true"> *</span>{/if}</label>{/if}
  <select {...api.getHiddenSelectProps()} aria-label={accessibleLabel}>
    <option value=""></option>
    {#each options as item (item.value)}<option value={item.value} disabled={item.disabled}>{item.label}</option>{/each}
  </select>
  <div {...api.getControlProps()}>
    <button {...api.getTriggerProps()} {...attributes} bind:this={ref} class={unstyled ? undefined : 'ore-button ore-select__trigger'}
      aria-label={accessibleLabel} aria-labelledby={label ? api.getTriggerProps()['aria-labelledby'] : undefined} aria-describedby={ariaDescribedby}>
      <span class="ore-button__surface"><span class="ore-button__content"><span class="ore-button__label">
        <span {...api.getValueTextProps()} class={unstyled ? undefined : 'ore-select__value'} data-placeholder={api.empty ? '' : undefined}>{api.valueAsString || placeholder}</span>
        <span {...api.getIndicatorProps()} aria-hidden="true" class={unstyled ? undefined : 'ore-select__indicator'}>▾</span>
      </span></span></span>
    </button>
  </div>
  {#if api.open}
    <div use:portal {...api.getPositionerProps()} {...attributes} class={unstyled ? undefined : 'ore-select__positioner'}>
      <div {...api.getContentProps()} aria-label={accessibleLabel} aria-labelledby={label ? api.getContentProps()['aria-labelledby'] : undefined} class={unstyled ? undefined : 'ore-select__content'}>
        {#each options as item (item.value)}
          <div {...api.getItemProps({ item })} class={unstyled ? undefined : 'ore-select__item'}>
            <span {...api.getItemTextProps({ item })}>{item.label}</span>
            <span {...api.getItemIndicatorProps({ item })} aria-hidden="true" class={unstyled ? undefined : 'ore-select__check'}>✓</span>
          </div>
        {:else}<div class={unstyled ? undefined : 'ore-select__empty'}>No options</div>{/each}
      </div>
    </div>
  {/if}
</div>
