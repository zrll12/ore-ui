# Button design reference

Source: [Minecraft - Ore UI Style](https://www.figma.com/design/XAEZlcgBRTwyL5EvAVWdV3/?node-id=425-8428), component set `425:8428`.

## Source nodes inspected

| Purpose | Node |
| --- | --- |
| Colored / default | `425:8432` |
| Colored / hovered | `2005:2474` |
| Colored / focused | `2005:2479` |
| Colored / focused + hovered | `2005:2484` |
| Colored / pressed | `2005:2489` |
| Colored / pressed + hovered | `2005:2494` |
| Colored / disabled | `2005:2504` |
| General / default | `2045:2464` |
| Destructive / default | `2045:2724` |
| Warning / default, pressed | `2045:2989`, `2045:3024` |
| Realms / default | `2045:2984` |
| Colored / text + icon | `2045:2216` |
| Font download references | `2031:10226` |

`get_design_context` supplied the implementation references; `get_variable_defs` supplied the shared palette/state values. The metadata was used only to locate components. No design screenshot is embedded in the implementation.

## Geometry

At source scale (`size="xl"`): 105px outer height, 89px face height, 36px font, 4px stroke, 8px bottom shadow. The source width is 648px; the library keeps width content-based, while the playground's default 324px width and 52.5px height show the 50% version.

The outer hit region never moves or resizes. The pressed face moves down 12px, becomes 85px high, and loses its shadow. Disabled faces fill 97px inside the frame, use the hover background, and reduce label opacity to 50%. Focus uses a white outline. Hover/pressed combinations inherit the appropriate highlight and stroke tokens.

## Motion and extensions

The design returned no keyframe tracks. Pointer press feedback uses an implementation-selected 160ms transform transition with the existing `--ore-ease-out` curve. Height and shadow switch immediately, rather than animating layout/paint. Keyboard press transitions immediately; reduced-motion disables travel. The standalone framework-independent spring helper remains available for larger displacement on an outer wrapper.

Responsive width, scale presets, loading indicator, `fullWidth`, and `unstyled` are library adaptations. The first implementation covers horizontal text and custom children/icons; vertical composition is outside this change.

Figma Starter quota stopped a supplemental General pressed-node query. General pressed uses its existing hover token, as does the inspected Warning pressed variant. This General pressed mapping is an implementation inference and should be compared with the source when further design reads are available; it is not presented as a separately verified frame.

## Assets and attribution

The optional icon is the original 32 × 32 exported SVG. Its wrapper scales proportionally without changing the asset's root dimensions. Minecraft Seven v2 is locally registered through the optional `fonts.css` export; no temporary Figma asset URLs are used at runtime. See [third-party notices](../THIRD_PARTY_NOTICES.md).
