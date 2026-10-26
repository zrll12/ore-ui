import { defineConfig } from 'tsup';
export default defineConfig({ entry: ['src/index.ts', 'src/motion.ts'], format: ['esm'], dts: { resolve: ["@ore-ui/core", "@ore-ui/core/motion"] }, clean: true,
  sourcemap: true, external: ['react', 'react/jsx-runtime', 'motion'], noExternal: ['@ore-ui/core'] });
