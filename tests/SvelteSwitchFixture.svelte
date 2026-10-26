<script lang="ts">
  import { Switch } from '../packages/svelte/src';
  let { disabled = false }: { disabled?: boolean } = $props();
  let checked = $state(true);
</script>
<form aria-label="Settings"><fieldset {disabled}><Switch label="Daylight" name="daylight" value="on" bind:checked required/></fieldset><span role="status" aria-label="Switch value">{String(checked)}</span></form>
