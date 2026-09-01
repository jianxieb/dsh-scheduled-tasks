# dsh-scheduled-tasks

DSH Web 图形界面的**定时任务**插件:配置按分钟/小时/天/周/月的任务,到点自动开启一个**全新会话**执行,可指定工作空间、模型与推理强度。常驻调度,关闭页面不影响执行。

- 频率:每 N 分钟 / 每 N 小时 / 每天(指定时间)/ 每周(自选星期几 + 时间)/ 每月(几号 + 时间)。无需 cron 表达式。
- 每次执行 = 新建会话,历史记录可点击打开对应会话。
- 配置持久化于 `<DSH_HOME>/scheduled-tasks.json`(DSH_HOME 未设置时为 `~/.dsh/scheduled-tasks.json`),Windows / macOS / Linux 通用。
- 侧边栏「定时任务」模块按钮;若侧边栏没有对应插槽(未打补丁的 DSH),自动回退为会话头部的 ⏱ 按钮。

## 一条命令安装

```sh
dsh plugin --profile web add dsh-scheduled-tasks
```

或直接从 GitHub 安装(构建产物已提交,无需本地构建):

```sh
dsh plugin --profile web add git+https://github.com/<你的用户名>/dsh-scheduled-tasks.git
```

然后**重启** `dsh web` 即可看到「定时任务」入口。

> pnpm ≥ 10 会默认拦截 git 依赖的构建脚本。若 git 安装时报错,按提示把输出的构建键加入
> `<DSH_HOME>/profiles/web/pnpm-workspace.yaml` 的 `allowBuilds`,重跑一次即可。

## 卸载

```sh
dsh plugin --profile web remove dsh-scheduled-tasks
```

重启 `dsh web` 后生效。任务配置文件 `scheduled-tasks.json` 会保留,重装后任务仍在。

## 旧配置迁移

首次启动时,若新位置 `<DSH_HOME>/scheduled-tasks.json` 不存在,插件会自动检测旧位置的配置并把其中的任务一次性复制过来(旧文件保持原样,只读不删)。适配两个平台:

- **Windows**:`<盘符>:/定时任务/scheduler-config.json`(如 `D:\定时任务\scheduler-config.json`,所有盘符都会检查)
- **macOS / Linux**:`~/定时任务/scheduler-config.json`

## 更新

```sh
dsh plugin --profile web update dsh-scheduled-tasks
```

## 本地开发 / 重新构建

```sh
pnpm install
pnpm run build   # 产出 lib/index.js(宿主)+ lib/client.js(浏览器 bundle)
```

`lib/` 已提交进仓库,直接 git 安装无需构建。

## 兼容性说明

- 插件运行于 profile 的 node_modules,DSH 升级不会覆盖或删除它;重启后自动重新挂载。
- 依赖 DSH 宿主服务 `connection`、`sessionController`(可选:`workspaceRegistry`、`sessions`)。这些是当前 DSH Web profile 的内部 API,大版本更新可能调整,届时更新本插件即可。
- 侧边栏槽位 `sidebar.sections` 不在原版 DSH 中:检测到该槽位时显示侧边栏模块按钮,否则自动使用会话头部按钮,两种形态功能一致。

## 目录结构

```
cordis.patch.yml      # 宿主插件行(bundle patch)
src/host/index.js     # 宿主调度引擎(RPC、持久化、执行)
src/client/index.cjs  # 浏览器 UI(模块按钮、抽屉、编辑器)
scripts/build.js      # esbuild 构建两个产物
lib/                  # 已提交的构建产物
```
