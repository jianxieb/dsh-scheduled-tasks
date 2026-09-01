// Build the two shipped artifacts:
//   lib/index.js  — host half (ESM, Node; node builtins stay external)
//   lib/client.js — browser bundle calling
//                   window.__ModuleLoader__.load({ id, factory }) with the
//                   module-table require for externals (react is baseline).
// Mirrors the artifact contract of the workspace client preset.
import { build } from 'esbuild'

const PACKAGE_ID = 'dsh-scheduled-tasks'

await Promise.all([
  build({
    entryPoints: ['src/host/index.js'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    outfile: 'lib/index.js',
    sourcemap: true,
  }),
  build({
    entryPoints: ['src/client/index.cjs'],
    bundle: true,
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    outfile: 'lib/client.js',
    sourcemap: true,
    external: ['react'],
    banner: {
      js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PACKAGE_ID)}, factory: (require) => { var module = { exports: {} }; var exports = module.exports;`,
    },
    footer: {
      js: 'return module.exports; } });',
    },
  }),
])

console.log('built lib/index.js and lib/client.js')
