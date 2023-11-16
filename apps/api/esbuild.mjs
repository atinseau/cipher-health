import * as esbuild from 'esbuild'
import { spawn } from 'child_process'

const env = process.env.NODE_ENV || 'development'
const outputDirectory = "build"
let previousPid = -1

/**
 * @type {esbuild.Plugin}
 */
const runnerPlugin = {
  name: 'runner-plugin',
  setup(build) {
    let buildStart = null

    build.onStart(() => {
      buildStart = Date.now()
    })
    build.onEnd((result) => {

      try {
        if (previousPid !== -1) {
          process.kill(previousPid)
        }
      } catch (e) {
        // fail to kill previous process (probably already dead)
      }

      try {
        const buildTime = Date.now() - buildStart
        const runner = spawn('node', [outputDirectory + '/index.js'], {
          stdio: 'inherit'
        })
        runner.on('spawn', () => {
          console.log(`- Build completed in ${buildTime}ms`)
        })
        previousPid = runner.pid
      } catch (e) {
        // fail to spawn new process
      }
    })
  }
}

const ctx = await esbuild.context({
  entryPoints: ['./src/index.ts'],
  outdir: outputDirectory,
  platform: 'node',
  treeShaking: true,
  bundle: true,
  external: [
    'fastify',
  ],
  plugins: [runnerPlugin],
  sourcemap: true,
  minify: env === 'production',
  logLevel: env === 'production'
    ? 'info'
    : 'error',
})


await ctx.watch()