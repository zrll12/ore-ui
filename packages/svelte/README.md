# @ore-ui/svelte

Ore UI for Svelte 5.20+. Shared design tokens, a small native button adapter, and optional framework-independent motion.

```svelte
<script>
  import { Button } from '@ore-ui/svelte';
  import '@ore-ui/svelte/styles.css';
</script>

<Button variant="colored" size="md">Continue</Button>
```

Variants: `colored`, `general`, `destructive`, `warning`, `realms`. Supports `size`, `loading`, `disabled`, `fullWidth`, `unstyled`, native button attributes, events, snippets, and `bind:ref`. Default button type is `button`.

Optional spring displacement: `import { springTo } from '@ore-ui/svelte/motion'`. Animate a wrapper; call the returned cleanup in `onDestroy`. Reduced motion preferences are respected.

Optional pixel font: `import '@ore-ui/svelte/fonts.css'`. See [third-party notices](./THIRD_PARTY_NOTICES.md) for design attribution and font terms.

## Select

```svelte
<script> import { Select } from "@ore-ui/svelte"; </script>

<Select label="Game mode" options={[{value: 'survival', label: 'Survival'}, {value: 'creative', label: 'Creative'}]}
  defaultValue="survival" name="mode" />
```

Single selection with a string value. Supports `value`, `defaultValue`, `onValueChange`, disabled options, `label`, `placeholder`, `name`, `form`, `required`, `invalid`, `variant`, `size`, `fullWidth`, and `unstyled`. Popup styles share the same explicit stylesheet import as Button. Use bind:value for two-way selection and bind:ref for the trigger.

## Native choice controls

Also exports `Radio`, `RadioGroup`, `Checkbox`, and `CheckboxGroup`. Singles expose `checked`, `defaultChecked`, `onCheckedChange`; Checkbox additionally supports `indeterminate`. Groups take `{value, label, description?, disabled?}[]` options, `value`, `defaultValue`, and `onValueChange`; RadioGroup uses a string and CheckboxGroup uses a string array. Both support `name`, `form`, `disabled`, `required`, `orientation`, and the shared appearance props. CheckboxGroup required means at least one enabled option. Native input / fieldset refs and form reset are preserved.
Svelte supports `bind:checked`, `bind:value`, and `bind:ref`.

`Switch` / `SwitchProps` provides a native two-state switch with checked/defaultChecked, onCheckedChange, native form attributes, and an input ref. Svelte also supports bind:checked and bind:ref. It uses the shared stylesheet, supports `withIcons` 1/0 marks (enabled by default), and does not support indeterminate state. Thumb travel animates for 160ms and respects reduced-motion preferences.
