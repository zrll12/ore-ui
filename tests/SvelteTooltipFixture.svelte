<script lang="ts">
  import { Tooltip, Button, type TooltipPlacement } from '../packages/svelte/src';
  let { disabled = false, content = 'Svelte hint', closable = false, placement, tailAlign }: { disabled?: boolean; content?: string; closable?: boolean; placement?: TooltipPlacement; tailAlign?: 'auto' | 'start' | 'end' } = $props();
  let open = $state<boolean | undefined>();
</script>
<p id="svelte-help">Existing help</p>
<Tooltip {placement} {tailAlign} {content} {disabled} {closable} withIcon bind:open openDelay={0} closeDelay={0} triggerId="svelte-trigger" aria-describedby="svelte-help">
  {#snippet children({ triggerProps })}<Button {...triggerProps}>Inspect</Button>{/snippet}
</Tooltip>
<span role="status" aria-label="Open state">{String(open ?? false)}</span>
