// dsh-scheduled-tasks — host half.
//
// A profile plugin (real Node process): durable scheduled-task engine for the
// DSH Web GUI. Each firing creates a brand-new session, optionally selects a
// model/reasoning effort, and queues the configured prompt. Config persists at
// <DSH_HOME or ~/.dsh>/scheduled-tasks.json, cross-platform.
//
// RPC: one logical channel `/scheduled-tasks` registered on ctx.connection.
//   Endpoints: getState | upsert | setEnabled | delete | runNow | modelCatalog
//   Result shape: { ok: true, value } | { ok: false, error: { code, message, details } }

import { readFile, writeFile, rename, mkdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

export const name = 'dsh-scheduled-tasks'

// Hard dependencies: the connection registry (RPC) and the session controller
// (execution). The plugin waits until both are available.
export const inject = ['connection', 'sessionController']

// ── frequency math (pure JS, no cron) ──────────────────────────────────────

function clampInt(value, fallback, min, max) {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n) || n < min || n > max) return fallback
  return n
}

function parseTime(str) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(str || '').trim())
  if (m === null) return null
  const h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return { h, m: min }
}

function fmtHHMM(t) {
  return (t.h < 10 ? '0' + t.h : String(t.h)) + ':' + (t.m < 10 ? '0' + t.m : String(t.m))
}

function normalizeFrequency(raw) {
  const f = raw && typeof raw === 'object' ? raw : {}
  const t = parseTime(f.time)
  if (f.mode === 'minutes') return { mode: 'minutes', every: clampInt(f.every, 5, 1, 1440) }
  if (f.mode === 'hours') return { mode: 'hours', every: clampInt(f.every, 1, 1, 168) }
  if (f.mode === 'daily' && t !== null) return { mode: 'daily', time: fmtHHMM(t) }
  if (f.mode === 'weekly') {
    const days = Array.isArray(f.days) ? f.days.map(Number).filter((d) => d >= 0 && d <= 6) : []
    const uniq = []
    for (const d of days) { if (uniq.indexOf(d) === -1) uniq.push(d) }
    uniq.sort((a, b) => a - b)
    if (uniq.length > 0 && t !== null) return { mode: 'weekly', days: uniq, time: fmtHHMM(t) }
  }
  if (f.mode === 'monthly' && t !== null) return { mode: 'monthly', day: clampInt(f.day, 1, 1, 31), time: fmtHHMM(t) }
  return { mode: 'minutes', every: 5 }
}

function nextDaily(from, h, m) {
  const d = new Date(from)
  d.setHours(h, m, 0, 0)
  if (d.getTime() <= from) d.setDate(d.getDate() + 1)
  return d.getTime()
}

function nextWeekly(from, days, h, m) {
  const base = new Date(from)
  for (let i = 0; i <= 7; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i, h, m, 0, 0)
    if (d.getTime() > from && days.indexOf(d.getDay()) !== -1) return d.getTime()
  }
  return from + 86400000
}

function nextMonthly(from, day, h, m) {
  const base = new Date(from)
  for (let i = 0; i <= 26; i++) {
    const y = base.getFullYear()
    const month = base.getMonth() + i
    const maxDay = new Date(y, month + 1, 0).getDate()
    const d = Math.min(day, maxDay)
    const t = new Date(y, month, d, h, m, 0, 0)
    if (t.getTime() > from) return t.getTime()
  }
  return from + 86400000
}

function computeNext(freq, fromMs) {
  const from = typeof fromMs === 'number' ? fromMs : Date.now()
  if (freq.mode === 'minutes') return from + freq.every * 60000
  if (freq.mode === 'hours') return from + freq.every * 3600000
  const t = parseTime(freq.time)
  if (t === null) return from + 300000
  if (freq.mode === 'daily') return nextDaily(from, t.h, t.m)
  if (freq.mode === 'weekly') return nextWeekly(from, freq.days || [], t.h, t.m)
  if (freq.mode === 'monthly') return nextMonthly(from, freq.day || 1, t.h, t.m)
  return from + 300000
}

function normalizeTask(raw) {
  if (raw === null || typeof raw !== 'object') return null
  const id = String(raw.id || '')
  if (id === '') return null
  const frequency = normalizeFrequency(raw.frequency || raw.schedule)
  const runs = []
  if (Array.isArray(raw.runs)) {
    for (const r of raw.runs) {
      if (r && r.sessionId && r.at) runs.push({ sessionId: String(r.sessionId), at: Number(r.at) })
    }
    runs.sort((a, b) => b.at - a.at)
  }
  return {
    id,
    name: String(raw.name || '未命名任务').slice(0, 80),
    sessionForm: 'entry',
    workspaceId: raw.workspaceId ? String(raw.workspaceId) : '',
    frequency,
    prompt: String(raw.prompt || '').slice(0, 4000),
    model: raw.model && raw.model.provider && raw.model.model
      ? { provider: String(raw.model.provider), model: String(raw.model.model), reasoningEffort: String(raw.model.reasoningEffort || '') }
      : undefined,
    enabled: raw.enabled !== false,
    createdAt: Number(raw.createdAt) || Date.now(),
    lastRunAt: raw.lastRunAt ? Number(raw.lastRunAt) : undefined,
    lastRunOk: raw.lastRunOk === true,
    lastRunMessage: String(raw.lastRunMessage || ''),
    runs,
    nextRunAt: undefined,
    running: false,
  }
}

// ── plugin ─────────────────────────────────────────────────────────────────

export function apply(ctx) {
  const connection = ctx.connection
  const sessionController = ctx.sessionController
  // Optional integrations — degrade gracefully when absent.
  const workspaceRegistry = ctx.get('workspaceRegistry')
  const sessions = ctx.get('sessions')
  const sessionTitle = ctx.get('sessionTitle')

  const configPath = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'scheduled-tasks.json')
  // One-time adoption of legacy config locations (checked only while the new
  // config does not exist yet). Purely best-effort and read-only for the old
  // file: tasks are copied to the new cross-platform location on first save.
  // Candidates cover both platforms:
  //   Windows: <drive>:/定时任务/scheduler-config.json (every drive letter)
  //   macOS/Linux: ~/定时任务/scheduler-config.json
  const legacyCandidates = () => {
    const list = [join(homedir(), '定时任务', 'scheduler-config.json')]
    if (process.platform === 'win32') {
      for (let c = 65; c <= 90; c++) list.push(String.fromCharCode(c) + ':/定时任务/scheduler-config.json')
    }
    return list
  }

  const state = {
    tasks: [],
    configPath: '',
    configError: '',
    saveError: '',
    seq: 0,
    titleMap: new Map(),
    workspaces: [],
    catalog: { default: null, groups: [], failures: [] },
  }
  let lastRefresh = 0
  let ticking = false
  let persistChain = Promise.resolve()

  // ── persistence ──────────────────────────────────────────────────────

  async function doPersist() {
    const json = JSON.stringify({
      version: 2,
      savedAt: Date.now(),
      tasks: state.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        sessionForm: 'entry',
        workspaceId: t.workspaceId || null,
        frequency: t.frequency.mode === 'weekly'
          ? { mode: 'weekly', days: t.frequency.days, time: t.frequency.time }
          : t.frequency.mode === 'monthly'
            ? { mode: 'monthly', day: t.frequency.day, time: t.frequency.time }
            : t.frequency.mode === 'daily'
              ? { mode: 'daily', time: t.frequency.time }
              : t.frequency.mode === 'hours'
                ? { mode: 'hours', every: t.frequency.every }
                : { mode: 'minutes', every: t.frequency.every },
        prompt: t.prompt,
        model: t.model ? { provider: t.model.provider, model: t.model.model, reasoningEffort: t.model.reasoningEffort } : null,
        enabled: t.enabled,
        createdAt: t.createdAt,
        lastRunAt: t.lastRunAt ?? null,
        lastRunOk: t.lastRunOk === true,
        lastRunMessage: String(t.lastRunMessage || ''),
        runs: t.runs.slice(0, 200).map((r) => ({ sessionId: r.sessionId, at: r.at })),
      })),
    }, null, 2)
    try {
      await mkdir(dirname(configPath), { recursive: true })
      await writeFile(configPath + '.tmp', json, 'utf8')
      await rename(configPath + '.tmp', configPath)
      state.configPath = configPath
      state.saveError = ''
    } catch (e) {
      state.saveError = '配置保存失败: ' + String((e && e.message) || e)
    }
  }

  function persist() {
    persistChain = persistChain.then(doPersist).catch(() => {})
    return persistChain
  }

  async function loadConfig() {
    try {
      const text = await readFile(configPath, 'utf8')
      const parsed = JSON.parse(text)
      const rawTasks = parsed && Array.isArray(parsed.tasks) ? parsed.tasks : []
      const tasks = []
      for (const raw of rawTasks) {
        const task = normalizeTask(raw)
        if (task !== null) tasks.push(task)
      }
      state.tasks = tasks
      state.configPath = configPath
      state.configError = ''
      const now = Date.now()
      for (const task of state.tasks) {
        task.nextRunAt = task.lastRunAt ? computeNext(task.frequency, task.lastRunAt) : computeNext(task.frequency, now)
      }
    } catch (e) {
      if (e && e.code === 'ENOENT') {
        // New config absent: adopt a legacy config once when it holds tasks.
        for (const legacy of legacyCandidates()) {
          try {
            const text = await readFile(legacy, 'utf8')
            const parsed = JSON.parse(text)
            const rawTasks = parsed && Array.isArray(parsed.tasks) ? parsed.tasks : []
            const tasks = []
            for (const raw of rawTasks) {
              const task = normalizeTask(raw)
              if (task !== null) tasks.push(task)
            }
            if (tasks.length === 0) continue
            state.tasks = tasks
            state.configPath = configPath
            state.configError = ''
            const now = Date.now()
            for (const task of state.tasks) {
              task.nextRunAt = task.lastRunAt ? computeNext(task.frequency, task.lastRunAt) : computeNext(task.frequency, now)
            }
            await doPersist() // persist to the new cross-platform location once
            return
          } catch (e2) { /* legacy absent or unreadable — try the next one */ }
        }
        state.configError = ''
        state.configPath = configPath
        return
      }
      state.configError = '配置加载失败,将从空任务列表开始: ' + String((e && e.message) || e)
    }
  }

  // ── live metadata ────────────────────────────────────────────────────

  async function refreshTitles() {
    const map = new Map()
    try {
      const value = await sessionController.list({}, undefined)
      const items = value && Array.isArray(value.items) ? value.items : []
      for (const item of items) {
        let title = ''
        const projections = item.projections && item.projections.values
        if (projections && typeof projections.title === 'string') title = projections.title
        if (title !== '') map.set(String(item.sessionId), title)
      }
    } catch (e) { /* best effort */ }
    if (sessions !== undefined) {
      try {
        for (const live of sessions.list()) {
          try {
            if (sessionTitle !== undefined) {
              const snapshot = sessionTitle.get(live)
              if (snapshot && snapshot.title) map.set(String(live.id), snapshot.title)
            }
          } catch (e) { /* best effort */ }
        }
      } catch (e) { /* best effort */ }
    }
    state.titleMap = map
  }

  async function refreshWorkspaces() {
    if (workspaceRegistry === undefined) { state.workspaces = []; return }
    try {
      const list = workspaceRegistry.list()
      state.workspaces = list.map((w) => ({
        id: String(w.id),
        title: String(w.title || ''),
        path: String(w.path || ''),
      }))
    } catch (e) {
      state.workspaces = []
    }
  }

  async function refreshCatalog() {
    try {
      const cat = await sessionController.modelCatalog()
      state.catalog = {
        default: cat && cat.default ? cat.default : null,
        groups: cat && Array.isArray(cat.groups) ? cat.groups : [],
        failures: cat && Array.isArray(cat.failures) ? cat.failures : [],
      }
    } catch (e) {
      state.catalog = { default: null, groups: [], failures: [] }
    }
  }

  function titleOf(sessionId) {
    return state.titleMap.get(String(sessionId)) || ''
  }

  function buildState() {
    return {
      configPath: state.configPath,
      configError: state.configError,
      saveError: state.saveError,
      now: Date.now(),
      catalog: state.catalog,
      workspaces: state.workspaces,
      tasks: state.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        sessionForm: 'entry',
        workspaceId: t.workspaceId || '',
        frequency: t.frequency.mode === 'weekly'
          ? { mode: 'weekly', days: t.frequency.days.slice(), time: t.frequency.time }
          : t.frequency.mode === 'monthly'
            ? { mode: 'monthly', day: t.frequency.day, time: t.frequency.time }
            : t.frequency.mode === 'daily'
              ? { mode: 'daily', time: t.frequency.time }
              : t.frequency.mode === 'hours'
                ? { mode: 'hours', every: t.frequency.every }
                : { mode: 'minutes', every: t.frequency.every },
        prompt: t.prompt,
        model: t.model ? { provider: t.model.provider, model: t.model.model, reasoningEffort: t.model.reasoningEffort } : null,
        enabled: t.enabled,
        createdAt: t.createdAt,
        lastRunAt: t.lastRunAt ?? null,
        lastRunOk: t.lastRunOk === true,
        lastRunMessage: String(t.lastRunMessage || ''),
        nextRunAt: t.nextRunAt ?? null,
        running: t.running,
        runs: t.runs.slice(0, 60).map((r) => ({ sessionId: r.sessionId, at: r.at, title: titleOf(r.sessionId) || '' })),
      })),
    }
  }

  // ── execution ────────────────────────────────────────────────────────

  async function fireTask(id) {
    const task = state.tasks.find((t) => t.id === id)
    if (task === undefined || task.running) return
    task.running = true
    const started = Date.now()
    try {
      const created = task.workspaceId
        ? await sessionController.create({ workspaceId: task.workspaceId })
        : await sessionController.create({})
      const sessionId = created && created.sessionId ? String(created.sessionId) : ''
      if (sessionId === '') throw new Error('会话创建失败: 未返回 sessionId')
      const sel = task.model
      if (sel && sel.provider && sel.model) {
        try {
          await sessionController.selectModel({
            sessionId,
            provider: sel.provider,
            model: sel.model,
            reasoningEffort: sel.reasoningEffort || undefined,
          })
        } catch (e) { /* model selection is best-effort */ }
      }
      const text = String(task.prompt || '').trim() || '开始执行任务。'
      const controller = new AbortController()
      await sessionController.prompt({
        requestId: 'sched-' + id + '-' + (state.seq++),
        sessionId,
        mode: 'queue',
        content: [{ type: 'text', text }],
      }, controller.signal)
      task.runs.unshift({ sessionId, at: started })
      if (task.runs.length > 200) task.runs.length = 200
      task.lastRunAt = started
      task.lastRunOk = true
      task.lastRunMessage = '已创建新会话并开始执行'
    } catch (err) {
      task.lastRunAt = started
      task.lastRunOk = false
      task.lastRunMessage = String((err && err.message) || err)
    } finally {
      task.running = false
      task.nextRunAt = computeNext(task.frequency, Date.now())
      void persist()
    }
  }

  function upsertTask(raw) {
    const id = raw && raw.id ? String(raw.id) : 'task-' + Date.now().toString(36) + '-' + (state.seq++)
    const name = String(raw && raw.name || '').trim().slice(0, 80) || '未命名任务'
    const frequency = normalizeFrequency(raw && raw.frequency)
    if (frequency.mode === 'weekly' && frequency.days.length === 0) throw new Error('请至少选择一个星期几')
    const workspaceId = raw && raw.workspaceId ? String(raw.workspaceId) : ''
    if (workspaceId !== '' && state.workspaces.length > 0 && !state.workspaces.some((w) => w.id === workspaceId)) {
      throw new Error('所选工作空间不存在,请重新选择')
    }
    const prompt = String(raw && raw.prompt || '').slice(0, 4000)
    const modelRaw = raw && raw.model
    const model = modelRaw && modelRaw.provider && modelRaw.model
      ? { provider: String(modelRaw.provider).slice(0, 100), model: String(modelRaw.model).slice(0, 100), reasoningEffort: String(modelRaw.reasoningEffort || '').slice(0, 100) }
      : undefined
    const existing = state.tasks.find((t) => t.id === id)
    const task = {
      id,
      name,
      sessionForm: 'entry',
      workspaceId,
      frequency,
      prompt,
      model,
      enabled: raw ? raw.enabled !== false : true,
      createdAt: existing ? existing.createdAt : Date.now(),
      lastRunAt: existing ? existing.lastRunAt : undefined,
      lastRunOk: existing ? existing.lastRunOk : undefined,
      lastRunMessage: existing ? existing.lastRunMessage : '',
      runs: existing ? existing.runs : [],
      nextRunAt: undefined,
      running: false,
    }
    task.nextRunAt = computeNext(task.frequency, Date.now())
    state.tasks = existing ? state.tasks.map((t) => (t.id === id ? task : t)) : state.tasks.concat([task])
    void persist()
    return buildState()
  }

  function setEnabled(id, enabled) {
    const task = state.tasks.find((t) => t.id === id)
    if (task === undefined) return buildState()
    task.enabled = enabled === true
    task.nextRunAt = computeNext(task.frequency, Date.now())
    void persist()
    return buildState()
  }

  function deleteTask(id) {
    state.tasks = state.tasks.filter((t) => t.id !== id)
    void persist()
    return buildState()
  }

  async function tick() {
    if (ticking) return
    ticking = true
    try {
      const now = Date.now()
      for (const task of state.tasks) {
        if (!task.enabled || task.running) continue
        if (!task.nextRunAt) {
          task.nextRunAt = computeNext(task.frequency, now)
        } else if (now >= task.nextRunAt) {
          void fireTask(task.id)
        }
      }
      if (now - lastRefresh > 30000) {
        lastRefresh = now
        void refreshTitles()
        void refreshWorkspaces()
      }
    } finally {
      ticking = false
    }
  }

  // ── RPC channel ──────────────────────────────────────────────────────

  const handler = async (endpoint, payload, _signal) => {
    try {
      let value
      if (endpoint === 'getState') {
        value = buildState()
      } else if (endpoint === 'upsert') {
        value = upsertTask(payload && payload.task)
      } else if (endpoint === 'setEnabled') {
        value = setEnabled(String((payload && payload.id) || ''), (payload && payload.enabled) === true)
      } else if (endpoint === 'delete') {
        deleteTask(String((payload && payload.id) || ''))
        value = buildState()
      } else if (endpoint === 'runNow') {
        await fireTask(String((payload && payload.id) || ''))
        value = buildState()
      } else if (endpoint === 'modelCatalog') {
        await refreshCatalog()
        value = state.catalog
      } else {
        throw new Error('unknown endpoint: ' + String(endpoint))
      }
      return { ok: true, value }
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'scheduler/failed',
          message: String((error && error.message) || error),
          details: {},
        },
      }
    }
  }

  connection.rpc.handle('/scheduled-tasks', handler)

  ctx.effect(() => {
    void loadConfig().then(async () => {
      await refreshTitles()
      await refreshWorkspaces()
      await refreshCatalog()
      lastRefresh = Date.now()
    }).catch((e) => {
      state.configError = String((e && e.message) || e)
    })
  }, 'dsh-scheduled-tasks: init')

  ctx.effect(() => {
    const interval = setInterval(() => { void tick() }, 1000)
    return () => { clearInterval(interval) }
  }, 'dsh-scheduled-tasks: tick')
}
