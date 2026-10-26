<script lang="ts">
  import { untrack } from 'svelte';
  import ChoiceInput, { type ChoiceInputProps } from './ChoiceInput.svelte';
  import { listenChoiceReset, syncIndeterminate } from '@ore-ui/core/choice';
  export interface CheckboxProps extends Omit<ChoiceInputProps, 'type'> {}
  let { checked = $bindable<boolean | undefined>(), defaultChecked, onCheckedChange, ref = $bindable(), indeterminate = false, ...rest }: CheckboxProps = $props();
  const initial = untrack(() => defaultChecked ?? checked ?? false);
  const current = $derived(checked ?? defaultChecked ?? false);
  $effect(() => { if (ref) return listenChoiceReset(ref, () => { checked = initial; onCheckedChange?.(initial); syncIndeterminate(ref, indeterminate); }); });
</script>
<ChoiceInput {...rest} type="checkbox" checked={current} {indeterminate} bind:ref onCheckedChange={next => { checked = next; onCheckedChange?.(next); }}/>
