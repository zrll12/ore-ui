# Select

This stage implements an accessible **single-select** dropdown for React and Svelte. It composes the verified Ore UI Button trigger with a newly styled dropdown using the shared palette and square border tokens. It is not claimed as a pixel-exact implementation of a new Figma Select node: Figma Starter read quota was still exhausted during this stage.

## Shared behavior

`packages/core/src/select.ts` owns option validation, collection creation, machine defaults, string/array conversion, and popup positioning. Both adapters use the same `@zag-js/select` machine, with `@zag-js/react` / `@zag-js/svelte` supplying framework lifecycle and prop normalization. The native hidden select is retained for FormData, browser validation, form reset, and disabled fieldsets.

References: [Zag Select](https://zagjs.com/components/react/select), [Svelte adapter](https://zagjs.com/components/svelte/select). The installed 1.46.0 collection API uses `isItemDisabled` (verified against its shipped types), rather than the older documentation's `itemToDisabled` spelling.

## Public contract

- `options`: `{ value: string; label: string; disabled?: boolean }[]`. Values must be unique and non-empty; the empty string clears selection and is reserved for the placeholder.
- React: controlled `value` / `onValueChange`, or uncontrolled `defaultValue`.
- Svelte: `bind:value` / `onValueChange`, or `defaultValue`. The callback receives a single string in both adapters, not a Zag array.
- `label` renders a visible accessible label. For external/hidden labels, use `id` with a native label or supply `aria-label`. Unlabelled instances fall back to the placeholder as their accessible name. `aria-describedby` can reference help or validation text.
- `disabled`, `required`, `invalid`, `name`, and `form` integrate with native forms. A forwarded/bindable `ref` targets the visible trigger button.
- `variant`, `size`, `fullWidth`, and `unstyled` match the Button conventions. React accepts `className` / CSS style objects; Svelte accepts `class` / style strings.
- The menu is portalled to the document body. Variant and size attributes are copied onto the positioner so scoped styling survives the portal. Tokens should be set on `:root` or globally when the popup needs the same theme.

The popup matches the trigger width, flips at viewport edges, scrolls long collections, and restores focus on selection or Escape. Keyboard navigation skips disabled options; Home / End and typeahead are delegated to the same state machine. There is no decorative opening motion or extra animation dependency.

## Scope

This stage excludes multiselect, searching/filtering, option groups, asynchronous loading, and custom option markup. Select's arrow and check are text indicators, not recreated Figma vector assets. Existing Button style and asset attribution remain in [third-party notices](../THIRD_PARTY_NOTICES.md).
