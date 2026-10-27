# Third-party notices

## Minecraft — Ore UI Style

Button, Radio, Checkbox, and Tooltip appearance and palette values adapted from “Minecraft - Ore UI Style” by Miljö AB and Turóczi Ádám.

- Community source: https://www.figma.com/community/file/1675191037788105821/minecraft-ore-ui-style
- Design reference: https://www.figma.com/design/XAEZlcgBRTwyL5EvAVWdV3/?node-id=425-8428
- Community resource license: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/
- Changes: native accessible HTML buttons, React / Svelte adapters, responsive sizing, reduced-motion handling, loading state, and CSS token implementation.

The Checkbox check and minus vector paths in `dist/icons/choice-check.svg` and `dist/icons/choice-minus.svg` are retained from the user-exported community design SVG. CSS masks apply framework-independent semantic colors, and the controls scale the source geometry.

The blue Tooltip bubble frame, staircase tail, info glyph, and close glyph in `dist/icons/tooltip-*.svg` retain the exported design paths. The frame uses a stretchable SVG border image; the tail is mirrored/rotated for placement, and the glyphs use CSS masks.

## Minecraft Seven v2

Minecraft Seven v2 is a Mojang Studios / Microsoft font; it is not covered by the design kit's CC BY license or by the library's own code license.

- Font linked from the design file: https://www.minecraft.net/etc.clientlibs/minecraftnet/clientlibs/clientlib-site/resources/fonts/Minecraft-Seven_v2.woff2
- Identically named font retrieved from the official Minecraft Experience site because the main host was unreachable: https://www.minecraftexperience.com/app/themes/minecraftexperience/public/fonts/Minecraft-Seven_v2.1ccf5a.woff2
- Local file: `dist/fonts/minecraft-seven.woff2` in each package.
- Optional registration: import `@ore-ui/react/fonts.css` or `@ore-ui/svelte/fonts.css`. The core stylesheet alone does not load the font.

Minecraft and related intellectual property belong to their respective owners. This is an unofficial fan project, not affiliated with or endorsed by Mojang Studios or Microsoft. No new license or redistribution permission for the font is asserted here; verify applicable font permissions before publishing these packages. Consumers can instead provide their own font via `--ore-font`.
