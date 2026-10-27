import { cp, mkdir, readdir, readFile, writeFile, rm } from 'node:fs/promises';
const root = new URL('../packages/svelte/', import.meta.url);
const staging = new URL('.package-input/', root);
await rm(staging, { recursive: true, force: true });
await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(staging, { recursive: true });
await cp(new URL('src/', root), staging, { recursive: true });
// Include the private shared implementation: published packages have no private workspace dependency.
for (const name of await readdir(staging)) {
  const file = new URL(name, staging);
  const source = await readFile(file, 'utf8');
  await writeFile(file, source.replaceAll("'@ore-ui/core/motion'", "'./shared/motion.js'").replaceAll("'@ore-ui/core/choice'", "'./shared/choice.js'").replaceAll("'@ore-ui/core/tooltip'", "'./shared/tooltip.js'").replaceAll("'@ore-ui/core/select'", "'./shared/select.js'").replaceAll("'@ore-ui/core'", "'./shared/index.js'"));
}
await mkdir(new URL('shared/', staging), { recursive: true });
for (const name of ['index.ts', 'motion.ts', 'select.ts', 'choice.ts', 'tooltip.ts']) {
  await cp(new URL(`../packages/core/src/${name}`, import.meta.url), new URL(`shared/${name}`, staging));
}
