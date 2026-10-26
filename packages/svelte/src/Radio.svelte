<script lang="ts">
  import { untrack } from 'svelte';
  import ChoiceInput, { type ChoiceInputProps } from './ChoiceInput.svelte';
  import { listenChoiceReset } from '@ore-ui/core/choice';
  export interface RadioProps extends Omit<ChoiceInputProps, 'type' | 'indeterminate'> {}
  let { checked = $bindable<boolean | undefined>(), defaultChecked, onCheckedChange, ref = $bindable(), ...rest }: RadioProps = $props();
  const initial = untrack(() => defaultChecked ?? checked ?? false);
  $effect(() => { if (ref) return listenChoiceReset(ref, () => { const next = checked === undefined ? !!ref?.checked : initial; if (checked !== undefined) checked = initial; onCheckedChange?.(next); }); });
</script>
<ChoiceInput {...rest} type="radio" {checked} {defaultChecked} bind:ref onCheckedChange={next => { if (checked !== undefined) checked = next; onCheckedChange?.(next); }}/>
