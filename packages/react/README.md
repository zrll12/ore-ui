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
