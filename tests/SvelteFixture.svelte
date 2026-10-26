<script lang="ts">
  import Button from '../packages/svelte/src/Button.svelte';
  let { loading = false, onclick = () => {} }: { loading?: boolean; onclick?: () => void } = $props();
</script>
<Button {loading} {onclick} variant="outline" color="teal" name="action">Continue</Button>
