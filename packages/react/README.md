# @ore-ui/react

Ore UI for React 18 and 19. Shared design tokens, a small native button adapter, and optional framework-independent motion.

```tsx
import { Button } from '@ore-ui/react';
import '@ore-ui/react/styles.css';

<Button variant="colored" size="md">Continue</Button>
```

Variants: `colored`, `general`, `destructive`, `warning`, `realms`. Supports `size`, `loading`, `disabled`, `fullWidth`, `unstyled`, native button attributes, events, and refs. Default button type is `button`.

Optional spring displacement: `import { springTo } from '@ore-ui/react/motion'`. Animate a wrapper; call the returned cleanup when unmounting. Reduced motion preferences are respected.

Optional pixel font: `import '@ore-ui/react/fonts.css'`. See [third-party notices](./THIRD_PARTY_NOTICES.md) for design attribution and font terms.

## Select

```tsx
import { Select } from "@ore-ui/react";

<Select label="Game mode" options={[{value: 'survival', label: 'Survival'}, {value: 'creative', label: 'Creative'}]}
  defaultValue="survival" name="mode" />
```

Single selection with a string value. Supports `value`, `defaultValue`, `onValueChange`, disabled options, `label`, `placeholder`, `name`, `form`, `required`, `invalid`, `variant`, `size`, `fullWidth`, and `unstyled`. Popup styles share the same explicit stylesheet import as Button. Use value + onValueChange for controlled selection; ref points at the trigger.
