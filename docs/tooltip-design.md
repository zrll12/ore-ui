# Tooltip

Both adapters share `@zag-js/tooltip` 1.46.0 and `packages/core/src/tooltip.ts`. The core helper owns delays, open callbacks, content/disabled guards, description merging, and fixed positioning with viewport padding and alternative-axis fallbacks. Styling is shared in core CSS.

The visual target is the blue speech-bubble component set at (3424.75, 9301) in the user-exported `Minecraft - Ore UI Style (Community).svg`. The face is #2E6BE5 with a #1E1E1F stepped frame. Original vector paths are preserved in `tooltip-bubble.svg`, `tooltip-tail.svg`, `tooltip-info.svg`, and `tooltip-close.svg`. The 634 × 46 source frame uses 12px nine-slice insets, rendered with 9px borders; the three-step tail retains its 32 × 28 viewBox and is rendered at 24 × 21. Info and close symbols retain their source coordinates. No bitmap screenshot is embedded.

## Usage

React wraps one focusable element (or a component that forwards native props):

```tsx
<Tooltip content="Keep your items after respawning.">
  <Button>Keep inventory</Button>
</Tooltip>
```

Its original ref, id, accessible name, description ids, class, styles, and handlers are retained. A child handler can preventDefault to cancel the matching Tooltip event. `triggerId` can explicitly override the trigger id. Disabled/loading Ore Buttons suppress Tooltip; custom components must forward the trigger props to their DOM element. Fragments and multiple children are unsupported. Focusable anchors also work when their native props are forwarded.

Svelte uses a children snippet so the real trigger receives all events and accessibility attributes:

```svelte
<Tooltip content="Keep your items after respawning." bind:open>
  {#snippet children({ triggerProps })}
    <Button {...triggerProps}>Keep inventory</Button>
  {/snippet}
</Tooltip>
```

Put `disabled` on Tooltip as well as a disabled Svelte trigger if needed. Use `triggerId` and Tooltip's `aria-describedby` for existing trigger identity/help. When adding custom event handlers, compose them with the corresponding triggerProps handlers instead of overwriting them. Svelte offers `bind:open`; React uses `open` + `onOpenChange`, or `defaultOpen`. Callbacks receive a boolean in both frameworks.

## Behavior and appearance

- Plain-text `content` only, with optional decorative `withIcon` and an optional `closable` button. Empty/whitespace content and disabled tooltips never open, including controlled/default-open cases. Tooltips supplement visible labels; they are not the only place to put essential information. Additional interactive content is not supported.
- Pointer hover opens after 400ms; keyboard focus opens immediately. Leave closes after 150ms. Both delays are configurable; negative values clamp to zero. Touch hover is ignored.
- Content is hoverable, allowing the pointer to move across the gap to continue reading. Escape, trigger activation/pointer-down, blur, and scrolling the trigger's ancestors dismiss. A controlled owner remains authoritative.
- Portal to the document body avoids clipping by ancestor overflow. Default placement is top-end; twelve explicit side/alignment placements plus `placement="auto"`, an 8px offset, and a staircase tail (enabled by default) are available. `tailAlign="start|end|auto"` controls only the forward/backward direction of the staircase tail; it never changes the arrow anchor. `placement="auto"` selects the side with the most available space. `tailAlign="auto"` chooses the staircase direction from the trigger’s position relative to the bubble center, and recomputes that direction responsively. All three tail settings use the same trigger-aligned arrow coordinate. While open, both adapters share Floating UI observers for viewport/ancestor resizing, element resizing, scrolling and layout shifts; observers are disposed when closed or unmounted.  The positioning engine tries the opposite side and alternative axes before overflowing; the bubble is 420px wide, capped at viewport width minus 36px, with 12px positioning padding.
- The close-button variant uses a nonmodal `dialog` named by `label` (default Information), plus `aria-haspopup`, expanded state and controls on its trigger. Tab from the trigger reaches the Close button; Shift+Tab returns. Closing or Escape while focus is inside restores the trigger without reopening. Pointer exit does not dismiss while its Close button has focus. `closeLabel` localizes the button name. Plain variants retain `role="tooltip"` and do not receive focus.
- `className`/`class` and `style` target the tooltip content. `unstyled` removes visual classes while retaining positioning and behavior. Global tokens such as `--ore-font` continue through the portal. Forced colors uses system colors. There is no decorative opening or closing animation.
- Default closed rendering is SSR-safe. Floating content is positioned and portalled on the client; do not rely on an initially open tooltip for server-rendered essential help.

Reference: [Zag Tooltip](https://zagjs.com/components/react/tooltip). Browser QA covers layout/flipping and actual keyboard interaction; jsdom tests cover state, events, descriptions, refs, portals, touch, and controlled/bound values.
