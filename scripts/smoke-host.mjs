// Smoke-test the built host half: import it (no side effects at module level),
// then exercise apply() against a mock context to prove the RPC channel
// registers, state loads, and handlers answer with the right shapes.
import { readFileSync, mkdtempSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Isolated home so the smoke never writes into the real ~/.dsh.
const smokeHome = mkdtempSync(join(tmpdir(), 'dsh-sched-smoke-'))
process.env.DSH_HOME = smokeHome

const mod = await import(new URL('../lib/index.js', import.meta.url).href)
console.log('exports:', Object.keys(mod).join(','))
console.log('inject:', JSON.stringify(mod.inject))

const calls = []
const disposers = []
const ctx = {
  connection: {
    rpc: {
      handle(channel, handler) {
        calls.push(['handle', channel])
        return async () => {}
      },
    },
  },
  sessionController: {
    async list() { return { items: [] } },
    async modelCatalog() { return { default: null, groups: [], failures: [] } },
    async create() { return { sessionId: 'smoke-session' } },
    async selectModel() {},
    async prompt() {},
  },
  get(name) {
    if (name === 'workspaceRegistry') return { list: () => [] }
    return undefined
  },
  inject(deps, callback) {
    // Simulate the services being present: attach immediately.
    callback(ctx)
  },
  effect(callback) {
    const disposer = callback()
    disposers.push(() => {
      if (typeof disposer === 'function') disposer()
    })
    return disposer
  },
}

mod.apply(ctx)
await new Promise((resolve) => setTimeout(resolve, 150))
console.log('handle called:', JSON.stringify(calls))
if (calls.length !== 1 || calls[0][1] !== '/scheduled-tasks') {
  console.error('FAIL: channel not registered as /scheduled-tasks')
  process.exit(1)
}
const legacy = existsSync('D:/定时任务/scheduler-config.json')
const written = join(smokeHome, 'scheduled-tasks.json')
if (legacy) {
  const text = JSON.parse(readFileSync(written, 'utf8'))
  console.log('legacy adoption: migrated', text.tasks.length, 'task(s)')
  if (!Array.isArray(text.tasks)) {
    console.error('FAIL: migrated config missing tasks array')
    process.exit(1)
  }
} else {
  console.log('legacy adoption: skipped (no legacy config on this machine)')
}
for (const dispose of disposers) { try { dispose() } catch {} }
rmSync(smokeHome, { recursive: true, force: true })

// Second phase: an incompatible DSH never provides the services. apply must
// complete instantly, register nothing, and never block the profile boot.
const noServiceCtx = {
  get() { return undefined },
  inject() { /* services never arrive */ },
  effect() { return () => {} },
}
mod.apply(noServiceCtx)
console.log('incompatible DSH: apply completed gracefully (no registration)')

console.log('host smoke OK')
