<script lang="ts">
  import Checkbox, { type CheckboxProps } from './Checkbox.svelte';
  export interface SwitchProps extends Omit<CheckboxProps, 'indeterminate' | 'role' | 'aria-checked'> { withIcons?: boolean }
  let { checked = $bindable<boolean | undefined>(), ref = $bindable(), class: className, withIcons = true, ...rest }: SwitchProps = $props();
</script>
<Checkbox {...rest} bind:checked bind:ref role="switch" class={['ore-switch', withIcons && 'ore-switch--icons', className]}/>
