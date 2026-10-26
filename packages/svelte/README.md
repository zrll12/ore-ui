# @ore-ui/svelte

Ore UI for Svelte 5. Shared design tokens, a small native button adapter, and optional framework-independent motion.

```svelte
<script>
  import { Button } from '@ore-ui/svelte';
  import '@ore-ui/svelte/styles.css';
</script>

<Button variant="filled" color="violet" size="md">Continue</Button>
```

Variants: `filled`, `light`, `outline`, `subtle`. Supports `size`, `radius`, `loading`, `disabled`, `fullWidth`, `unstyled`, native button attributes, events, snippets, and `bind:ref`. Default button type is `button`.

Optional spring displacement: `import { springTo } from '@ore-ui/svelte/motion'`. Animate a wrapper; call the returned cleanup in `onDestroy`. Reduced motion preferences are respected.
