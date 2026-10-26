# @ore-ui/react

Ore UI for React 18 and 19. Shared design tokens, a small native button adapter, and optional framework-independent motion.

```tsx
import { Button } from '@ore-ui/react';
import '@ore-ui/react/styles.css';

<Button variant="filled" color="violet" size="md">Continue</Button>
```

Variants: `filled`, `light`, `outline`, `subtle`. Supports `size`, `radius`, `loading`, `disabled`, `fullWidth`, `unstyled`, native button attributes, events, and refs. Default button type is `button`.

Optional spring displacement: `import { springTo } from '@ore-ui/react/motion'`. Animate a wrapper; call the returned cleanup when unmounting. Reduced motion preferences are respected.
