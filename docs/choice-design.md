# Radio / RadioGroup / Checkbox / CheckboxGroup

This stage adds four components using the existing Minecraft-inspired tokens and pixel typography. These are library extensions based on the shared visual language, not a claim of pixel-exact fidelity to unread Figma nodes. Radio geometry is corrected against the supplied design screenshot: a 45-degree diamond, faceted center, diamond focus ring, and neutral disabled palette. No new imagery or motion dependencies are used.

## Architecture

- `packages/core/src/choice.ts`: shared appearance attributes, option validation, ordered immutable checkbox toggling, canceled-reset-aware form listeners, native indeterminate synchronization, and group constraint validation.
- Both adapters keep real `<input type="radio|checkbox">` elements. Groups use `<fieldset>` and `<legend>`. Browser radio naming handles mutual exclusivity and arrow-key interaction; Space toggles native checkboxes. Native form owners, disabled fieldsets, and FormData remain intact.
- `packages/core/src/styles.css`: shared control, mark, label, description, focus, disabled, invalid, palette, and size rules. CSS reflects `:checked` and `:indeterminate`, not duplicated component visual state. The mixed ARIA state also renders the half-selection mark before hydration.
- Each framework only renders markup, bridges reactive values/refs, and hooks into its lifecycle. Svelte requires 5.20+ for SSR-safe instance IDs, as with Select.

## API

`Radio` and `Checkbox` accept native input attributes (except the reserved `size` and `type`) plus `label`, `description`, `variant`, `size`, `invalid`, `unstyled`, and `onCheckedChange(boolean)`. React uses `checked` / `defaultChecked`; Svelte also offers `bind:checked`. `ref` / `bind:ref` targets the real input. Native `onChange` / `onchange` is forwarded separately.

`Checkbox.indeterminate` controls the mixed visual state independently of checkedness. It does not change submitted values. Derive it from a checkbox group, and clear/recompute it in response to `onCheckedChange` for a select-all control.

Group `options` are `{ value, label, description?, disabled? }` objects with unique, non-empty values. `RadioGroup` uses a string; `CheckboxGroup` uses a string array in option order. Groups support controlled `value` / `onValueChange`, `defaultValue`, Svelte `bind:value`, `orientation`, appearance props, `name`, `form`, `required`, `disabled`, and invalid styling. Group refs point at the fieldset.

A RadioGroup without a name generates an isolated native name to keep unrelated groups independent. For forms, provide an explicit name for a predictable FormData key. For standalone same-name radios, prefer native uncontrolled defaults; use RadioGroup for one reactive scalar value rather than maintaining a separate checked boolean for every radio.

## Forms and validation

- RadioGroup uses native required-radio constraints.
- CheckboxGroup's `required` means **at least one enabled option**, not every checkbox. A single enabled input receives a custom validity message while no enabled item is checked. Disabled selections remain in the group value but are omitted from FormData by native form behavior.
- Disabled fieldsets disable their descendants. CheckboxGroup validation remains attached so re-enabling the fieldset restores constraints.
- `form` associates both the fieldset and each input with an external form owner.
- Form reset restores the initial defaults and emits the corresponding change callback. Canceled resets do not change component state. Controlled React owners can accept or reject callbacks; the controlled prop remains authoritative.
- Select-all is a demo composition of Checkbox and CheckboxGroup, preserving disabled selections. It is not a separate state system or additional public component.

## Accessibility and visual behavior

Controls retain native roles and accessible wrapped labels. Descriptions are linked by ID. Group legends provide accessible group names; `aria-label` is available for visually unlabelled controls. Hidden native inputs stay focusable, and their visible wrapper receives a focus outline. Forced-colors mode exposes native controls. No decorative toggle animation is added.

Native semantics reference: [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio), [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox).
