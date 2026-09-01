<div align="center">

<img src="assets/icon.svg" width="96" height="96" alt="dsh-scheduled-tasks logo">

# dsh-scheduled-tasks

**DSH Web 定时任务插件** — 让 AI 在你设定的时间,自动开始工作

[![version](https://img.shields.io/badge/version-0.1.2-blue)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](#)
[![dsh](https://img.shields.io/badge/DSH-Web%20Profile-blueviolet)](#)

一行命令安装 · 跨平台 · 常驻调度 · 每次执行开启全新会话

</div>

---

## ✨ 功能特性

- **五种频率,零 cron 语法**:每 N 分钟 / 每 N 小时 / 每天(指定时间)/ 每周(自选星期几 + 时间)/ 每月(几号 + 时间)
- **每次执行 = 全新会话**:到点自动创建新会话并开始执行,不与现有会话混用
- **按任务定制执行环境**:可选工作空间(输出落入其目录)、模型与推理强度(一处同时选择)
- **完整任务管理**:立即执行 ▶、编辑 🖊、暂停/继续、删除(带确认弹窗),⋯ 菜单收纳次要操作
- **执行历史可追溯**:每次执行的会话记录、成功/失败状态,点击即可打开对应会话
- **常驻调度**:宿主进程内运行,关闭页面不影响执行;重启后自动恢复
- **跨平台配置**:`<DSH_HOME>/scheduled-tasks.json`(未设置时为 `~/.dsh/`),Windows / macOS / Linux 通用
- **旧配置自动迁移**:自动识别并复制旧版配置,老用户零成本升级
- **双入口自适应**:有 `sidebar.sections` 槽位时显示侧边栏模块按钮;原版 DSH 自动回退为会话头部时钟按钮

## 🚀 快速开始

```sh
dsh plugin --profile web add dsh-scheduled-tasks
```

或直接从 GitHub 安装(构建产物已提交,免本地构建):

```sh
dsh plugin --profile web add git+https://github.com/jianxieb/dsh-scheduled-tasks.git
```

重启 `dsh web`,侧边栏即出现蓝色时钟「定时任务」入口。

> pnpm ≥ 10 默认拦截 git 依赖的构建脚本。若 git 安装报错,按提示把输出的构建键加入
> `<DSH_HOME>/profiles/web/pnpm-workspace.yaml` 的 `allowBuilds`,重跑一次即可。

### 卸载 / 更新

```sh
dsh plugin --profile web remove dsh-scheduled-tasks   # 卸载(任务配置保留)
dsh plugin --profile web update dsh-scheduled-tasks   # 更新到最新版
```

## 🧭 使用指南

1. 点击侧边栏「定时任务」打开任务抽屉;
2. 点击「＋ 新建任务」,按顺序填写:**标题 → 执行内容 → 工作空间 → 执行频率 → 模型与强度**;
3. 保存后任务自动进入调度队列,卡片上实时显示「下次执行时间」与倒计时;
4. 点击任务名打开最近一次执行的会话;展开「执行历史」可打开任意一次执行;
5. 「⋯」菜单内可暂停/继续任务或删除(删除需二次确认,已创建的会话不受影响)。

## ⚙️ 配置与数据

| 项 | 说明 |
|---|---|
| 任务配置 | `<DSH_HOME>/scheduled-tasks.json`(自动创建,UTF-8) |
| 旧配置迁移 | Windows: `<盘符>:/定时任务/scheduler-config.json`(全盘符扫描)· macOS/Linux: `~/定时任务/scheduler-config.json` |
| 迁移策略 | 首次启动且新配置不存在时,复制旧任务到新位置;旧文件只读保留 |

## 🏗️ 架构与工作原理

```
┌─ 宿主半 (Node 进程内) ───────────────────────────┐
│ 调度引擎:每秒 tick,纯 JS 计算下次执行时间(无 cron) │
│ 持久化: 原子写入 JSON 配置;启动时加载/迁移        │
│ RPC:    /scheduled-tasks 通道(getState/upsert/…)  │
└──────────────┬───────────────────────────────────┘
               │ connection RPC (JSON)
┌──────────────┴───────────────────────────────────┐
│ 浏览器半 (侧边栏模块按钮 / 会话头部回退按钮)        │
│ 抽屉式任务面板:列表、编辑器、历史、确认弹窗          │
└──────────────────────────────────────────────────┘
```

执行链路:到点 → 创建新会话(可选指定工作空间)→ 选定模型与强度 → 投递执行内容 → 记录执行历史 → 计算下一次时间。

## 🛠️ 开发

要求:Node.js ≥ 18、pnpm(仓库锁定 `pnpm@11.7.0`)。

```sh
pnpm install
pnpm run build              # 产出 lib/index.js(宿主)+ lib/client.js(浏览器 bundle)
node scripts/smoke-host.mjs # 宿主冒烟:RPC 通道注册、状态加载、旧配置迁移
node scripts/smoke-client.mjs # 客户端冒烟:模块握手、槽位注册
```

```
src/host/index.js     # 宿主调度引擎(RPC、持久化、执行)
src/client/index.cjs  # 浏览器 UI(模块按钮、抽屉、编辑器)
assets/icon.svg       # 项目图标(蓝色时钟)
cordis.patch.yml      # 插件组合声明
```

`lib/` 构建产物随仓库提交,git 安装免构建。

## 🗺️ 路线图

- [x] 五种执行频率、新会话执行、模型与强度、工作空间
- [x] 执行历史、暂停/继续、删除确认、持久化、跨平台迁移、槽位回退
- [ ] 界面预览图与使用文档完善
- [ ] 失败自动重试与执行结果通知
- [ ] 英文界面本地化
- [ ] 更完整的自动化测试覆盖

## 📄 许可证

[MIT](./LICENSE) © 2026 Jian Xie

版本历史见 [CHANGELOG.md](./CHANGELOG.md)。MVP 完成前保持 `0.x` 版本。
