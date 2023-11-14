import * as esbuild from 'esbuild'

const env = process.env.NODE_ENV || 'development'

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  outdir: "build",
  platform: 'node',
  treeShaking: true,
  bundle: true,
  external: [
    'fastify',
  ],
  sourcemap: true,
  minify: env === 'production',
  logLevel: env === 'production'
    ? 'info'
    : 'error',
})

