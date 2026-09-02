// patch-sidebar-sections.mjs — add the `sidebar.sections` slot to a
// released DSH sidebar shell so dsh-scheduled-tasks renders its module
// button right below the "New Session" button instead of falling back to
// the conversation header.
//
// Released DSH builds (≤ 0.1.1-rc.2, 0.1.2-alpha.3) do not declare the
// `sidebar.sections` slot in their sidebar shell; it exists in newer
// master builds. This script patches the LOCAL shell bundle (client.js) of
// the installed DSH. It is idempotent and safe to re-run.
//
// Usage:
//   node scripts/patch-sidebar-sections.mjs
//
// After patching, restart `dsh web` and refresh the browser page.
//
// Notes:
// - Re-run this script after upgrading DSH (npm update overwrites the
//   global bundle).
// - If the bundle cannot be located (npx installs, custom locations),
//   point the script at the file directly:
//   DSH_SIDEBAR_BUNDLE=/path/to/dsh-client-ui-sidebar/lib/client.js \
//     node scripts/patch-sidebar-sections.mjs

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DECL_ANCHOR = '\t\t\t\t\t"sidebar.workspaces": {\n\t\t\t\t\t\tkind: "single",\n\t\t\t\t\t\tscope: "root"\n\t\t\t\t\t},'
const DECL_NEW = '\t\t\t\t\t"sidebar.sections": {\n\t\t\t\t\t\tkind: "list",\n\t\t\t\t\t\tscope: "root"\n\t\t\t\t\t},\n' + DECL_ANCHOR
const RENDER_ANCHOR = '\t\t\t\t\t}),\n\t\t\t\t\t(0, react_jsx_runtime.jsx)("div", {\n\t\t\t\t\t\tclassName: SidebarRoot_module_css_default.regionArea,'
const RENDER_NEW = '\t\t\t\t\t}),\n\t\t\t\t\twide && (0, react_jsx_runtime.jsx)("div", {\n\t\t\t\t\t\tstyle: {\n\t\t\t\t\t\t\tpadding: "0 12px 12px"\n\t\t\t\t\t\t},\n\t\t\t\t\t\tchildren: renderSlot("sidebar.sections", {\n\t\t\t\t\t\t\twide\n\t\t\t\t\t\t})\n\t\t\t\t\t}),\n\t\t\t\t\t(0, react_jsx_runtime.jsx)("div", {\n\t\t\t\t\t\tclassName: SidebarRoot_module_css_default.regionArea,'

function npmRoot() {
  try {
    return execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}

function candidates() {
  const list = []
  if (process.env.DSH_SIDEBAR_BUNDLE) list.push(process.env.DSH_SIDEBAR_BUNDLE)
  const root = npmRoot()
  if (root) {
    list.push(
      join(root, '@deepseek-ai', 'dsh', 'node_modules', '@deepseek-ai', 'dsh-client-ui-sidebar', 'lib', 'client.js'),
      join(root, '@deepseek-ai', 'dsh-client-ui-sidebar', 'lib', 'client.js'),
    )
  }
  return list
}

let file = null
for (const candidate of candidates()) {
  if (candidate && existsSync(candidate)) { file = candidate; break }
}
if (file === null) {
  console.error('未找到侧边栏壳 bundle (dsh-client-ui-sidebar/lib/client.js)。')
  console.error('请用 DSH_SIDEBAR_BUNDLE 环境变量指定其绝对路径后重跑本脚本。')
  process.exit(1)
}

const src = readFileSync(file, 'utf8')
if (src.includes('renderSlot("sidebar.sections"')) {
  console.log(`补丁已存在,跳过: ${file}`)
  process.exit(0)
}

let next = src
if (next.includes(DECL_ANCHOR)) {
  next = next.replace(DECL_ANCHOR, DECL_NEW)
} else {
  console.error(`槽位声明锚点未匹配(该 DSH 版本的侧边栏结构与已知版本不同): ${file}`)
  console.error('请将该版本信息提交到 https://github.com/jianxieb/dsh-scheduled-tasks/issues 以扩展支持。')
  process.exit(1)
}
if (next.includes(RENDER_ANCHOR)) {
  next = next.replace(RENDER_ANCHOR, RENDER_NEW)
} else {
  console.error(`渲染锚点未匹配(该 DSH 版本的侧边栏结构与已知版本不同): ${file}`)
  console.error('请将该版本信息提交到 https://github.com/jianxieb/dsh-scheduled-tasks/issues 以扩展支持。')
  process.exit(1)
}

writeFileSync(file, next)
console.log(`补丁已应用: sidebar.sections 槽位已声明并渲染在「新会话」下方。`)
console.log(`文件: ${file}`)
console.log('请重启 dsh web 并刷新浏览器页面。')
