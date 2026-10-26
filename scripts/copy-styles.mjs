import { copyFile, cp } from 'node:fs/promises';
const source = new URL('../packages/core/src/', import.meta.url);
const target = new URL(`../packages/${process.argv[2]}/dist/`, import.meta.url);
await copyFile(new URL('styles.css', source), new URL('styles.css', target));
await copyFile(new URL('fonts.css', source), new URL('fonts.css', target));
await cp(new URL('fonts/', source), new URL('fonts/', target), { recursive: true });

await cp(new URL('icons/', source), new URL('icons/', target), { recursive: true });
