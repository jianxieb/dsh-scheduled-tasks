// Smoke-test the built client bundle without a browser: capture the
// __ModuleLoader__.load handoff, answer `require("react")` from a stub module
// table, and assert the delivered plugin object shape.
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')

let registration = null
const reactStub = {
  createElement: (type, props, ...children) => ({ type, props, children }),
  useState: (initial) => [initial, () => {}],
  useEffect: () => {},
}
const requireStub = (specifier) => {
  if (specifier === 'react') return reactStub
  throw new Error('unexpected external: ' + specifier)
}
const setTimeoutStub = () => 0
const clearTimeoutStub = () => {}
const setIntervalStub = () => 0
const clearIntervalStub = () => {}

const windowStub = {
  __ModuleLoader__: {
    load(handoff) { registration = handoff },
  },
  setTimeout: setTimeoutStub,
  clearTimeout: clearTimeoutStub,
  setInterval: setIntervalStub,
  clearInterval: clearIntervalStub,
}
const documentStub = {
  head: { appendChild() {} },
  createElement() { return { dataset: {}, remove() {} } },
}

const runner = new Function('window', 'document', 'setTimeout', 'clearTimeout', source)
runner(windowStub, documentStub, setTimeoutStub, clearTimeoutStub)

if (registration === null) {
  console.error('FAIL: __ModuleLoader__.load was never called')
  process.exit(1)
}
console.log('registered id:', registration.id)
const plugin = registration.factory(requireStub)
console.log('plugin inject:', JSON.stringify(plugin.inject))
if (typeof plugin.apply !== 'function') {
  console.error('FAIL: plugin.apply missing')
  process.exit(1)
}

// apply() against a mock client ctx: slots present, connection present.
let slotRegistered = null
let primaryInjected = false
let cssTag = null
const slotsStub = {
  inject(name, factory) {
    if (name === 'sidebar.sections') {
      primaryInjected = true
      factory() // simulate immediate declaration
    }
    return () => {}
  },
  register(options, component) { slotRegistered = { options, hasComponent: typeof component === 'function' } },
}
const connectionStub = {
  rpc: { call: async () => ({ ok: true, value: { tasks: [] } }) },
}
const ctxStub = {
  connection: connectionStub,
  get(name) {
    if (name === 'slots') return slotsStub
    if (name === 'sessions') return { open() {} }
    return undefined
  },
  effect() { return () => {} },
  inject(deps, callback) {
    // Simulate the services being present: attach immediately.
    callback({ connection: connectionStub, slots: slotsStub })
  },
}
plugin.apply(ctxStub)
console.log('primary slot injected:', primaryInjected)
console.log('registered:', JSON.stringify(slotRegistered))
if (!primaryInjected || slotRegistered === null || slotRegistered.options.name !== 'sidebar.sections') {
  console.error('FAIL: sidebar.sections registration did not happen')
  process.exit(1)
}
console.log('client smoke OK')
