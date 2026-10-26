import { copyFile } from 'node:fs/promises';
await copyFile(new URL('../packages/core/src/styles.css', import.meta.url), new URL(`../packages/${process.argv[2]}/dist/styles.css`, import.meta.url));
