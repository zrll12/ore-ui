# Radio / RadioGroup / Checkbox / CheckboxGroup

Radio and Checkbox geometry, colors, and marks are audited against the user-exported `Minecraft - Ore UI Style (Community).svg` (10383 × 12909). The Radio component set is at (8852.5, 1462.5), and the Checkbox set is at (7333.5, 1486.5). The SVG is a reference document, not an application background or embedded screenshot.

- Radio: a rotated 64px square, 4px outer frame, uniform 4px inner stroke, and a 32px faceted center. Pressed centers are 24.04px. The light center uses white / #E6E8EB / #D0D1D4; general and warning use #464646 / #2F2F2F / #1E1E1F. Hover changes the face only; the stroke stays uniform. Disabled checked and unchecked states have distinct neutral fills/strokes.
- Checkbox: 58px square, 4px frame/bevel, neutral #B1B2B6 unchecked face, and recessed checked/mixed backgrounds (#1C4A12 green, #AD1D1D red, #C09A0D yellow, #4A1CAC purple). Focus surrounds the control only. The seven-block check and half-selection bar are preserved as vector paths in `packages/core/src/icons/choice-check.svg` and `choice-minus.svg`; their viewBoxes retain the source coordinates and 58px component extent. CSS masks supply the semantic mark color, and a scaled hard shadow preserves the original 3.1px offset.
- Sizes scale those source ratios into the existing control footprint. Native input semantics, wrapped labels, group layout, and Switch styling remain unchanged. States not represented separately in the export (such as a general checked Checkbox or enabled empty Radio) remain library extensions using the same palette.

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

## Checkbox interaction states

Read each six-column SVG row as checked, mixed, unchecked, checked hover, mixed hover, unchecked hover. The third and sixth controls share #B1B2B6 faces and #E3E3E5 bevel strokes. Preserve the exported base colors. Per the subsequent visual adjustment, hover adds a 10% black overlay to only the inner face for a very subtle darkening; the bevel (including its translucent highlights), check/mixed mark, and shadow remain untouched. This applies to enabled checked, mixed, and unchecked controls with a fine pointer. The export has no separate Checkbox pressed variant, so no extra pressed face, bevel, mark translation, or shadow change is applied. Keyboard focus still surrounds the control, and native activation still toggles the value on release. Disabled controls remain neutral. These rules are shared by Checkbox and CheckboxGroup; Switch keeps its own independent interaction styling.

## Accessibility and visual behavior

Controls retain native roles and accessible wrapped labels. Descriptions are linked by ID. Group legends provide accessible group names; `aria-label` is available for visually unlabelled controls. Hidden native inputs stay focusable, and their visible control receives a focus outline. Forced-colors mode exposes native controls. No decorative toggle animation is added.

Native semantics reference: [radio](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio), [checkbox](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/checkbox).
