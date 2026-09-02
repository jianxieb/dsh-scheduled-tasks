window.__ModuleLoader__.load({ id: "dsh-scheduled-tasks", factory: (require) => { var module = { exports: {} }; var exports = module.exports;

// src/client/index.cjs
var React = require("react");
var CSS = [
  ".dshsched-module { display:flex; align-items:center; justify-content:center; gap:6px; height:38px; padding:8px 16px; margin:0 2px 8px; box-sizing:border-box; width:calc(100% - 4px); border:1px solid var(--dsw-alias-border-l2); border-radius:12px; background:var(--dsw-alias-button-elevated-fill, var(--dsw-alias-bg-layer-1)); color:var(--dsw-alias-label-primary); font-size:14px; font-weight:500; cursor:pointer; overflow:hidden; }",
  ".dshsched-module:hover { background:var(--dsw-alias-button-floating-hover, var(--dsw-alias-bg-layer-2)); }",
  ".dshsched-module-label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }",
  ".dshsched-module-badge { flex:none; display:inline-flex; align-items:center; justify-content:center; min-width:16px; height:16px; line-height:1; padding:0 5px; box-sizing:border-box; background:#3B82F6; color:#ffffff; border-radius:999px; font-size:11px; }",
  ".dshsched-clock { display:inline-flex; align-items:center; color:#3B82F6; }",
  ".dshsched-module-icon { display:inline-flex; align-items:center; flex:none; color:#3B82F6; }",
  ".dshsched-rail-btn { width:36px; height:36px; border:none; border-radius:8px; background:transparent; color:var(--dsw-alias-label-primary); cursor:pointer; font-size:16px; display:inline-flex; align-items:center; justify-content:center; }",
  ".dshsched-rail-btn:hover { background:var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2)); }",
  ".dshsched-drawer { position:fixed; top:0; right:0; bottom:0; width:460px; max-width:92vw; background:var(--dsw-alias-bg-layer-1); border-left:1px solid var(--dsw-alias-border-l1); z-index:800; display:flex; flex-direction:column; box-shadow:-10px 0 30px rgba(0,0,0,0.15); }",
  ".dshsched-drawer-head { flex:none; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:14px 16px; border-bottom:1px solid var(--dsw-alias-border-l1); }",
  ".dshsched-drawer-title { font-size:15px; font-weight:600; color:var(--dsw-alias-label-primary); }",
  ".dshsched-drawer-body { flex:1; overflow-y:auto; padding:12px 16px; display:flex; flex-direction:column; gap:10px; }",
  ".dshsched-card { display:flex; flex-direction:column; gap:8px; border:1px solid var(--dsw-alias-border-l1); border-radius:10px; padding:12px; background:var(--dsw-alias-bg-layer-2, var(--dsw-alias-bg-layer-1)); }",
  ".dshsched-row { display:flex; gap:6px; align-items:center; flex-wrap:wrap; }",
  ".dshsched-actions { flex:none; display:flex; gap:4px; position:relative; }",
  ".dshsched-menu { position:absolute; right:0; top:28px; min-width:120px; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.18); z-index:850; padding:4px; display:flex; flex-direction:column; gap:2px; }",
  ".dshsched-menu-item { display:block; width:100%; text-align:left; border:none; background:transparent; color:var(--dsw-alias-label-primary); font-size:12.5px; padding:6px 10px; border-radius:6px; cursor:pointer; }",
  ".dshsched-menu-item:hover { background:var(--dsw-alias-bg-layer-2); }",
  ".dshsched-menu-item-danger { color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-menu-catcher { position:fixed; inset:0; z-index:840; }",
  ".dshsched-iconbtn { width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--dsw-alias-border-l1); border-radius:6px; background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-secondary); cursor:pointer; font-size:12px; padding:0; }",
  ".dshsched-iconbtn:hover { color:var(--dsw-alias-label-primary); border-color:var(--dsw-alias-label-primary); }",
  ".dshsched-iconbtn-on { color:var(--dsw-alias-state-success-primary); }",
  ".dshsched-iconbtn-danger:hover { color:var(--dsw-alias-state-error-primary); border-color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-task-main { flex:1; min-width:0; display:flex; flex-direction:column; gap:2px; padding:0; background:transparent; border:none; text-align:left; color:inherit; font:inherit; cursor:pointer; }",
  ".dshsched-task-name { font-size:14px; font-weight:600; line-height:20px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }",
  ".dshsched-task-sub { font-size:12px; color:var(--dsw-alias-label-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }",
  ".dshsched-status { display:flex; flex-direction:column; gap:3px; font-size:12px; }",
  ".dshsched-ok { color:var(--dsw-alias-state-success-primary); }",
  ".dshsched-err { color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-warn { color:var(--dsw-alias-state-warn-primary); }",
  ".dshsched-muted { color:var(--dsw-alias-label-secondary); font-size:12px; }",
  ".dshsched-history-toggle { align-self:flex-start; display:inline-flex; align-items:center; gap:4px; border:none; background:transparent; color:var(--dsw-alias-label-secondary); cursor:pointer; font-size:12px; padding:2px 0; }",
  ".dshsched-history-toggle:hover { color:var(--dsw-alias-label-primary); }",
  ".dshsched-runs { display:flex; flex-direction:column; gap:2px; padding:2px 0 2px 8px; border-left:2px solid var(--dsw-alias-border-l1); }",
  ".dshsched-run { display:flex; flex-direction:column; align-items:flex-start; gap:1px; width:100%; border:none; background:transparent; color:inherit; font:inherit; cursor:pointer; text-align:left; padding:5px 8px; border-radius:6px; }",
  ".dshsched-run:hover { background:var(--dsw-alias-bg-layer-2); }",
  ".dshsched-run-title { font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width:100%; }",
  ".dshsched-run-sub { font-size:11px; color:var(--dsw-alias-label-secondary); }",
  ".dshsched-editor { display:flex; flex-direction:column; gap:10px; border:1px solid var(--dsw-alias-border-l2); border-radius:10px; padding:12px; background:var(--dsw-alias-bg-layer-1); }",
  ".dshsched-label { font-size:12px; color:var(--dsw-alias-label-secondary); display:block; margin-bottom:4px; }",
  ".dshsched-input, .dshsched-select, .dshsched-textarea { width:100%; box-sizing:border-box; background:var(--dsw-alias-bg-layer-2); border:1px solid var(--dsw-alias-border-l1); border-radius:6px; color:var(--dsw-alias-label-primary); padding:6px 8px; font-size:13px; font-family:inherit; }",
  ".dshsched-input:focus, .dshsched-select:focus, .dshsched-textarea:focus { outline:1px solid var(--dsw-alias-brand-primary); }",
  ".dshsched-textarea { resize:vertical; min-height:64px; }",
  ".dshsched-btn { background:var(--dsw-alias-bg-layer-2); border:1px solid var(--dsw-alias-border-l2); border-radius:6px; color:var(--dsw-alias-label-primary); padding:5px 11px; font-size:13px; cursor:pointer; }",
  ".dshsched-btn:hover:not(:disabled) { border-color:var(--dsw-alias-label-primary); }",
  ".dshsched-btn:disabled { opacity:0.5; cursor:default; }",
  ".dshsched-btn-active { border-color:var(--dsw-alias-label-primary); color:var(--dsw-alias-label-primary); }",
  ".dshsched-btn-primary { background:var(--dsw-alias-label-primary); border-color:var(--dsw-alias-label-primary); color:var(--dsw-alias-label-primary-inverted); }",
  ".dshsched-btn-primary:hover:not(:disabled) { opacity:0.9; }",
  ".dshsched-day { width:28px; height:26px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--dsw-alias-border-l1); border-radius:6px; background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-secondary); cursor:pointer; font-size:12px; padding:0; }",
  ".dshsched-day-on { background:var(--dsw-alias-label-primary); color:var(--dsw-alias-label-primary-inverted); border-color:var(--dsw-alias-label-primary); }",
  ".dshsched-banner { border:1px solid var(--dsw-alias-state-warn-primary); color:var(--dsw-alias-state-warn-primary); border-radius:8px; padding:8px 10px; font-size:12px; }",
  ".dshsched-banner-err { border-color:var(--dsw-alias-state-error-primary); color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-backdrop { position:fixed; inset:0; z-index:790; background:rgba(0,0,0,0.18); }",
  ".dshsched-dialog { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); width:320px; max-width:88vw; background:var(--dsw-alias-bg-layer-1); border:1px solid var(--dsw-alias-border-l1); border-radius:12px; padding:16px; z-index:860; display:flex; flex-direction:column; gap:12px; box-shadow:0 12px 40px rgba(0,0,0,0.25); }",
  ".dshsched-dialog-title { font-size:14px; font-weight:600; color:var(--dsw-alias-label-primary); }",
  ".dshsched-btn-sm { padding:3px 8px; font-size:12px; }",
  ".dshsched-btn-danger { color:var(--dsw-alias-state-error-primary); border-color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-btn-danger:hover:not(:disabled) { border-color:var(--dsw-alias-state-error-primary); }",
  ".dshsched-foot { padding:10px 16px; border-top:1px solid var(--dsw-alias-border-l1); font-size:11px; color:var(--dsw-alias-label-secondary); }"
].join("\n");
var rpcFn = null;
var openSession = null;
function el(type, props, ...children) {
  return React.createElement(type, props, ...children);
}
function ClockIcon(size) {
  return el(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    },
    el("circle", { cx: 12, cy: 12, r: 9 }),
    el("path", { d: "M12 7v5l3.5 2" })
  );
}
async function rpc(endpoint, payload) {
  const result = await rpcFn(endpoint, payload);
  if (result && result.ok === true) return result.value;
  const message = result && result.error ? result.error.message : "RPC \u8C03\u7528\u5931\u8D25";
  throw new Error(message);
}
function Field(props, ...children) {
  return el(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 3, flex: props.grow ? 1 : void 0, minWidth: props.minWidth || 110 } },
    props.label ? el("span", { className: "dshsched-label" }, props.label) : null,
    children
  );
}
function Btn(props, ...children) {
  const cls = "dshsched-btn" + (props.sm ? " dshsched-btn-sm" : "") + (props.danger ? " dshsched-btn-danger" : "") + (props.active ? " dshsched-btn-active" : "") + (props.primary ? " dshsched-btn-primary" : "");
  return el("button", { className: cls, onClick: props.onClick, disabled: props.disabled === true, title: props.title }, children);
}
function IconBtn(props, ...children) {
  const cls = "dshsched-iconbtn" + (props.on ? " dshsched-iconbtn-on" : "") + (props.danger ? " dshsched-iconbtn-danger" : "");
  return el("button", { className: cls, onClick: props.onClick, title: props.title }, children);
}
function fmtTime(ms) {
  if (!ms) return "\u2014";
  const d = new Date(ms);
  const p = (n) => n < 10 ? "0" + n : String(n);
  return p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}
function remainText(ms, now) {
  if (!ms) return "";
  const s = Math.max(0, Math.round((ms - now) / 1e3));
  if (s <= 0) return "\u73B0\u5728";
  if (s < 60) return "\u5373\u5C06";
  if (s < 3600) return Math.floor(s / 60) + "\u5206";
  if (s < 86400) return Math.floor(s / 3600) + "\u65F6" + Math.floor(s % 3600 / 60) + "\u5206";
  return Math.floor(s / 86400) + "\u5929";
}
var WEEKDAYS = ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"];
function freqText(f) {
  if (!f) return "";
  if (f.mode === "minutes") return "\u6BCF" + f.every + "\u5206\u949F";
  if (f.mode === "hours") return "\u6BCF" + f.every + "\u5C0F\u65F6";
  if (f.mode === "daily") return "\u6BCF\u5929 " + f.time;
  if (f.mode === "weekly") return "\u6BCF\u5468 " + (f.days || []).map((d) => WEEKDAYS[d]).join("\u3001") + " " + f.time;
  if (f.mode === "monthly") return "\u6BCF\u6708 " + f.day + " \u53F7 " + f.time;
  return "";
}
function modelEfforts(catalog, provider, modelId) {
  if (!catalog || !provider || !modelId) return null;
  for (const g of catalog.groups) {
    if (g.id !== provider) continue;
    for (const m of g.models) {
      if (m.id === modelId && m.reasoning && Array.isArray(m.reasoning.efforts) && m.reasoning.efforts.length > 0) return m.reasoning;
    }
  }
  return null;
}
function ModelPicker(props) {
  const catalog = props.catalog || { default: null, groups: [], failures: [] };
  const model = props.model || null;
  const value = model ? model.provider + "::" + model.model : "";
  const groups = catalog.groups || [];
  const reasoning = modelEfforts(catalog, model && model.provider, model && model.model);
  const optionList = [];
  optionList.push(el("option", { key: "default", value: "" }, "\u9ED8\u8BA4\u6A21\u578B"));
  for (const g of groups) {
    const groupOptions = (g.models || []).map((m) => el("option", { key: g.id + "::" + m.id, value: g.id + "::" + m.id }, (m.name || m.id) + " (" + (g.name || g.id) + ")"));
    optionList.push(el("optgroup", { key: g.id, label: g.name || g.id }, groupOptions));
  }
  const select = el("select", {
    className: "dshsched-select",
    value,
    onChange: (ev) => {
      const v = ev.target.value;
      if (v === "") {
        props.onChange(null);
        return;
      }
      const i = v.indexOf("::");
      props.onChange({ provider: v.slice(0, i), model: v.slice(i + 2), reasoningEffort: "" });
    }
  }, optionList);
  const combo = [el("div", { style: { flex: 1, minWidth: 170 } }, select)];
  if (reasoning !== null) {
    const effortOptions = [el("option", { key: "default", value: "" }, "\u9ED8\u8BA4")].concat(reasoning.efforts.map((e) => el("option", { key: e.id, value: e.id }, e.name || e.id)));
    const effortSelect = el("select", {
      className: "dshsched-select",
      value: model && model.reasoningEffort || "",
      onChange: (ev) => props.onChange({ provider: model.provider, model: model.model, reasoningEffort: ev.target.value })
    }, effortOptions);
    combo.push(el("div", { style: { width: 116 } }, effortSelect));
  }
  return Field({ label: "\u6A21\u578B\u4E0E\u5F3A\u5EA6" }, el("div", { className: "dshsched-row" }, combo));
}
function FrequencyEditor(props) {
  const f = props.value || { mode: "minutes", every: 5 };
  const set = (p) => props.onChange(Object.assign({}, f, p));
  const setMode = (mode) => {
    if (mode === "minutes") props.onChange({ mode: "minutes", every: 5 });
    else if (mode === "hours") props.onChange({ mode: "hours", every: 1 });
    else if (mode === "daily") props.onChange({ mode: "daily", time: "09:00" });
    else if (mode === "weekly") props.onChange({ mode: "weekly", days: [1, 2, 3, 4, 5], time: "09:00" });
    else props.onChange({ mode: "monthly", day: 1, time: "09:00" });
  };
  const modeBtn = (mode, label) => Btn({ active: f.mode === mode, onClick: () => setMode(mode) }, label);
  const timeInput = (value) => el("input", { className: "dshsched-input", type: "time", style: { width: 100 }, value: value || "09:00", onChange: (ev) => set({ time: ev.target.value }) });
  const children = [];
  children.push(el("span", { className: "dshsched-label" }, "\u6267\u884C\u9891\u7387"));
  children.push(el(
    "div",
    { className: "dshsched-row" },
    modeBtn("minutes", "\u6BCFN\u5206\u949F"),
    modeBtn("hours", "\u6BCFN\u5C0F\u65F6"),
    modeBtn("daily", "\u6BCF\u5929"),
    modeBtn("weekly", "\u6BCF\u5468"),
    modeBtn("monthly", "\u6BCF\u6708")
  ));
  if (f.mode === "minutes") {
    children.push(el(
      "div",
      { className: "dshsched-row" },
      el("input", { className: "dshsched-input", type: "number", min: 1, max: 1440, style: { width: 80 }, value: String(f.every == null ? 5 : f.every), onChange: (ev) => set({ every: ev.target.value }) }),
      el("span", { className: "dshsched-muted" }, "\u5206\u949F\u4E00\u6B21")
    ));
  } else if (f.mode === "hours") {
    children.push(el(
      "div",
      { className: "dshsched-row" },
      el("input", { className: "dshsched-input", type: "number", min: 1, max: 168, style: { width: 80 }, value: String(f.every == null ? 1 : f.every), onChange: (ev) => set({ every: ev.target.value }) }),
      el("span", { className: "dshsched-muted" }, "\u5C0F\u65F6\u4E00\u6B21")
    ));
  } else if (f.mode === "daily") {
    children.push(el("div", { className: "dshsched-row" }, el("span", { className: "dshsched-muted" }, "\u6BCF\u5929"), timeInput(f.time)));
  } else if (f.mode === "weekly") {
    const dayButtons = WEEKDAYS.map((name, d) => {
      const on = (f.days || []).indexOf(d) !== -1;
      const toggle = () => {
        const days = (f.days || []).slice();
        const i = days.indexOf(d);
        if (i === -1) days.push(d);
        else days.splice(i, 1);
        set({ days });
      };
      return el("button", { key: d, type: "button", className: "dshsched-day" + (on ? " dshsched-day-on" : ""), onClick: toggle }, name.slice(1));
    });
    children.push(el("div", { className: "dshsched-row" }, dayButtons));
    children.push(el("div", { className: "dshsched-row" }, el("span", { className: "dshsched-muted" }, "\u65F6\u95F4"), timeInput(f.time)));
  } else if (f.mode === "monthly") {
    children.push(el(
      "div",
      { className: "dshsched-row" },
      el("span", { className: "dshsched-muted" }, "\u6BCF\u6708"),
      el("input", { className: "dshsched-input", type: "number", min: 1, max: 31, style: { width: 70 }, value: String(f.day == null ? 1 : f.day), onChange: (ev) => set({ day: ev.target.value }) }),
      el("span", { className: "dshsched-muted" }, "\u53F7"),
      timeInput(f.time)
    ));
  }
  return el("div", { style: { display: "flex", flexDirection: "column", gap: 5 } }, children);
}
function TaskEditor(props) {
  const initial = props.initial;
  const catalog = props.catalog;
  const workspaces = props.workspaces || [];
  const [draft, setDraft] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const patch = (p) => setDraft(Object.assign({}, draft, p));
  const save = async () => {
    setBusy(true);
    setMessage("");
    try {
      const next = await rpc("upsert", { task: draft });
      props.onDone(next);
    } catch (e) {
      setMessage(String(e && e.message || e));
    } finally {
      setBusy(false);
    }
  };
  const wsOptions = [el("option", { key: "none", value: "" }, "\u9ED8\u8BA4(\u672A\u5206\u7EC4)")];
  for (const w of workspaces) {
    wsOptions.push(el("option", { key: w.id, value: w.id }, (w.title || w.path) + " \xB7 " + w.path));
  }
  const children = [];
  children.push(Field(
    { label: "\u6807\u9898" },
    el("input", { className: "dshsched-input", value: draft.name || "", placeholder: "\u4F8B\u5982: \u6BCF\u65E5\u7AD9\u4F1A\u6574\u7406", onChange: (ev) => patch({ name: ev.target.value }) })
  ));
  children.push(Field(
    { label: "\u6267\u884C\u5185\u5BB9" },
    el("textarea", { className: "dshsched-textarea", value: draft.prompt || "", placeholder: "\u5F00\u59CB\u6267\u884C\u4EFB\u52A1\u3002", onChange: (ev) => patch({ prompt: ev.target.value }) })
  ));
  children.push(Field(
    { label: "\u5DE5\u4F5C\u7A7A\u95F4" },
    el("select", { className: "dshsched-select", value: draft.workspaceId || "", onChange: (ev) => patch({ workspaceId: ev.target.value }) }, wsOptions)
  ));
  children.push(el(FrequencyEditor, { value: draft.frequency, onChange: (f) => patch({ frequency: f }) }));
  children.push(el(ModelPicker, { catalog, model: draft.model || null, onChange: (m) => patch({ model: m }) }));
  children.push(el(
    "div",
    { className: "dshsched-row", style: { justifyContent: "flex-end" } },
    Btn({ onClick: props.onCancel, disabled: busy }, "\u53D6\u6D88"),
    Btn({ primary: true, onClick: save, disabled: busy }, busy ? "\u4FDD\u5B58\u4E2D\u2026" : "\u4FDD\u5B58"),
    message ? el("span", { className: "dshsched-err" }, message) : null
  ));
  return el("div", { className: "dshsched-editor" }, children);
}
function TaskRow(props) {
  const task = props.task;
  const runs = Array.isArray(task.runs) ? task.runs : [];
  const latest = runs.length > 0 ? runs[0] : null;
  const expanded = props.expanded === true;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const children = [];
  const mainBtn = el(
    "button",
    {
      className: "dshsched-task-main",
      title: latest ? "\u6253\u5F00\u6700\u8FD1\u4E00\u6B21\u6267\u884C\u7684\u4F1A\u8BDD" : "\u5C1A\u65E0\u6267\u884C\u8BB0\u5F55",
      onClick: () => {
        if (latest) props.onOpen(latest.sessionId);
      }
    },
    el("span", { className: "dshsched-task-name" }, task.name + (task.enabled ? "" : " (\u5DF2\u505C\u7528)")),
    el(
      "span",
      { className: "dshsched-task-sub" },
      freqText(task.frequency) + " \xB7 \u4E0B\u6B21 " + fmtTime(task.nextRunAt) + " \xB7 " + remainText(task.nextRunAt, props.now) + "\u540E"
    )
  );
  const menu = menuOpen ? el(
    "div",
    null,
    el("div", { className: "dshsched-menu-catcher", onClick: () => setMenuOpen(false) }),
    el(
      "div",
      { className: "dshsched-menu" },
      el("button", { className: "dshsched-menu-item", onClick: () => {
        setMenuOpen(false);
        props.onToggleEnabled(task.id, !task.enabled);
      } }, task.enabled ? "\u6682\u505C\u4EFB\u52A1" : "\u7EE7\u7EED\u4EFB\u52A1"),
      el("button", { className: "dshsched-menu-item dshsched-menu-item-danger", onClick: () => {
        setMenuOpen(false);
        props.onDelete(task.id);
      } }, "\u5220\u9664")
    )
  ) : null;
  const actions = el(
    "div",
    { className: "dshsched-actions" },
    IconBtn({ title: "\u7ACB\u5373\u6267\u884C", onClick: () => props.onRunNow(task.id) }, "\u25B6"),
    IconBtn({ title: "\u7F16\u8F91", onClick: () => props.onEdit(task.id) }, "\u{1F58A}"),
    IconBtn({ title: "\u66F4\u591A\u64CD\u4F5C", onClick: () => setMenuOpen((o) => !o) }, "\u22EF"),
    menu
  );
  children.push(el("div", { className: "dshsched-row", style: { justifyContent: "space-between", alignItems: "flex-start" } }, mainBtn, actions));
  const statusChildren = [];
  if (task.running) {
    statusChildren.push(el("span", { className: "dshsched-warn" }, "\u6267\u884C\u4E2D\u2026"));
  } else if (task.lastRunAt) {
    statusChildren.push(el(
      "span",
      { className: task.lastRunOk ? "dshsched-ok" : "dshsched-err" },
      (task.lastRunOk ? "\u2713 \u4E0A\u6B21\u6210\u529F \xB7 " : "\u2717 \u4E0A\u6B21\u5931\u8D25 \xB7 ") + fmtTime(task.lastRunAt) + " \xB7 " + (task.lastRunMessage || "")
    ));
  } else {
    statusChildren.push(el("span", { className: "dshsched-muted" }, "\u5C1A\u672A\u6267\u884C"));
  }
  children.push(el("div", { className: "dshsched-status" }, statusChildren));
  children.push(el(
    "button",
    { className: "dshsched-history-toggle", onClick: () => props.onToggleExpand(task.id) },
    (expanded ? "\u25BE" : "\u25B8") + " \u6267\u884C\u5386\u53F2 (" + runs.length + ")"
  ));
  if (expanded) {
    if (runs.length === 0) {
      children.push(el("div", { className: "dshsched-muted" }, "\u5C1A\u65E0\u6267\u884C\u8BB0\u5F55"));
    } else {
      const runRows = runs.map((r) => el(
        "button",
        { key: r.sessionId, className: "dshsched-run", onClick: () => props.onOpen(r.sessionId) },
        el("span", { className: "dshsched-run-title" }, r.title || r.sessionId),
        el("span", { className: "dshsched-run-sub" }, fmtTime(r.at))
      ));
      children.push(el("div", { className: "dshsched-runs" }, runRows));
    }
  }
  return el("div", { className: "dshsched-card" }, children);
}
function TaskPanel(props) {
  const data = props.data;
  const [editing, setEditing] = React.useState(null);
  const [expanded, setExpanded] = React.useState({});
  const [deleting, setDeleting] = React.useState(null);
  const call = async (method, args) => {
    try {
      const next = await rpc(method, args);
      props.onState(next);
      return next;
    } catch (e) {
      props.onError(String(e && e.message || e));
      return null;
    }
  };
  const tasks = data && Array.isArray(data.tasks) ? data.tasks : [];
  const catalog = data && data.catalog ? data.catalog : { default: null, groups: [], failures: [] };
  const editingTask = editing === "new" ? null : tasks.find((t) => t.id === editing);
  const editingDraft = editing === "new" ? { id: null, name: "", workspaceId: "", frequency: { mode: "daily", time: "09:00" }, prompt: "\u5F00\u59CB\u6267\u884C\u4EFB\u52A1\u3002", enabled: true, model: null } : editingTask ? {
    id: editingTask.id,
    name: editingTask.name,
    workspaceId: editingTask.workspaceId || "",
    frequency: editingTask.frequency,
    prompt: editingTask.prompt,
    enabled: editingTask.enabled,
    model: editingTask.model || null
  } : null;
  const doDelete = (id) => {
    setDeleting(id);
  };
  const body = [];
  if (data && data.configError) body.push(el("div", { className: "dshsched-banner dshsched-banner-err" }, data.configError));
  if (data && data.saveError) body.push(el("div", { className: "dshsched-banner dshsched-banner-err" }, data.saveError));
  if (editing !== null && editingDraft !== null) {
    body.push(el(TaskEditor, {
      initial: editingDraft,
      catalog,
      workspaces: data && Array.isArray(data.workspaces) ? data.workspaces : [],
      onDone: (next) => {
        props.onState(next);
        setEditing(null);
      },
      onCancel: () => setEditing(null)
    }));
  }
  for (const task of tasks) {
    if (editing === task.id) continue;
    body.push(el(TaskRow, {
      key: task.id,
      task,
      catalog,
      now: props.now,
      expanded: expanded[task.id] === true,
      onOpen: props.onOpen,
      onRunNow: (id) => call("runNow", { id }),
      onToggleEnabled: (id, enabled) => call("setEnabled", { id, enabled }),
      onEdit: (id) => setEditing(editing === id ? null : id),
      onDelete: doDelete,
      onToggleExpand: (id) => setExpanded(Object.assign({}, expanded, { [id]: !(expanded[id] === true) }))
    }));
  }
  if (tasks.length === 0) {
    body.push(el("div", { className: "dshsched-muted", style: { padding: "12px 4px" } }, "\u8FD8\u6CA1\u6709\u5B9A\u65F6\u4EFB\u52A1\u3002\u70B9\u53F3\u4E0A\u89D2\u300C\uFF0B \u65B0\u5EFA\u4EFB\u52A1\u300D\u521B\u5EFA\u7B2C\u4E00\u4E2A\u3002"));
  }
  body.push(el(
    "div",
    { className: "dshsched-muted", style: { padding: "6px 0" } },
    "\u8BF4\u660E: \u5230\u70B9\u540E\u81EA\u52A8\u521B\u5EFA\u4E00\u4E2A\u5168\u65B0\u4F1A\u8BDD\u6267\u884C\u914D\u7F6E\u7684\u5185\u5BB9;\u70B9\u51FB\u4EFB\u52A1\u540D\u6253\u5F00\u6700\u8FD1\u4E00\u6B21\u6267\u884C\u7684\u4F1A\u8BDD,\u5C55\u5F00\u6267\u884C\u5386\u53F2\u53EF\u6253\u5F00\u4EFB\u610F\u4E00\u6B21\u3002"
  ));
  const head = el(
    "div",
    { className: "dshsched-drawer-head" },
    el(
      "span",
      { className: "dshsched-drawer-title", style: { display: "inline-flex", alignItems: "center", gap: 6 } },
      el("span", { className: "dshsched-clock" }, ClockIcon(16)),
      "\u5B9A\u65F6\u4EFB\u52A1"
    ),
    el(
      "div",
      { className: "dshsched-row" },
      Btn({ primary: true, onClick: () => setEditing(editing === "new" ? null : "new") }, "\uFF0B \u65B0\u5EFA\u4EFB\u52A1"),
      Btn({ onClick: props.onClose }, "\u2715")
    )
  );
  const bodyEl = el("div", { className: "dshsched-drawer-body" }, body);
  const foot = el(
    "div",
    { className: "dshsched-foot" },
    (data && data.configPath ? "\u914D\u7F6E: " + data.configPath : "\u5C1A\u672A\u4FDD\u5B58\u914D\u7F6E") + (data && data.pluginVersion ? " \xB7 v" + data.pluginVersion : "") + " \xB7 \u5E38\u9A7B\u8C03\u5EA6,\u5173\u95ED\u672C\u9875\u4E0D\u5F71\u54CD\u6267\u884C"
  );
  const dialog = deleting !== null ? (() => {
    const target = tasks.find((t) => t.id === deleting);
    return el(
      "div",
      { className: "dshsched-dialog", onClick: (ev) => ev.stopPropagation() },
      el("div", { className: "dshsched-dialog-title" }, "\u5220\u9664\u5B9A\u65F6\u4EFB\u52A1"),
      el("div", { className: "dshsched-muted" }, "\u786E\u5B9A\u5220\u9664\u300C" + (target ? target.name : "") + "\u300D\u5417?\u4EFB\u52A1\u4E0E\u5176\u6267\u884C\u8BB0\u5F55\u5217\u8868\u5C06\u88AB\u79FB\u9664(\u5DF2\u521B\u5EFA\u7684\u4F1A\u8BDD\u672C\u8EAB\u4FDD\u7559)\u3002"),
      el(
        "div",
        { className: "dshsched-row", style: { justifyContent: "flex-end" } },
        Btn({ onClick: () => setDeleting(null) }, "\u53D6\u6D88"),
        Btn({ danger: true, onClick: () => {
          const id = deleting;
          setDeleting(null);
          void call("delete", { id });
        } }, "\u786E\u8BA4\u5220\u9664")
      )
    );
  })() : null;
  return el("div", { className: "dshsched-drawer", onClick: (ev) => ev.stopPropagation() }, head, bodyEl, foot, dialog);
}
function SchedulerSection(props) {
  const wide = props.wide === true;
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState("");
  const [, setClock] = React.useState(0);
  const pressInside = React.useRef(false);
  React.useEffect(() => {
    let alive = true;
    const refresh = async () => {
      try {
        const next = await rpc("getState");
        if (alive) {
          setData(next);
          setError("");
        }
      } catch (e) {
        if (alive) setError(String(e && e.message || e));
      }
    };
    void refresh();
    const stopPoll = setInterval(() => {
      void refresh();
    }, 5e3);
    const stopClock = setInterval(() => setClock((t) => t + 1), 1e3);
    return () => {
      alive = false;
      clearInterval(stopPoll);
      clearInterval(stopClock);
    };
  }, []);
  const enabledCount = data && Array.isArray(data.tasks) ? data.tasks.filter((t) => t.enabled).length : 0;
  const openSessionById = (id) => {
    if (openSession !== null) openSession(id);
  };
  const trigger = wide ? el(
    "button",
    { className: "dshsched-module", onClick: () => setOpen((o) => !o), title: "\u5B9A\u65F6\u4EFB\u52A1" },
    el("span", { className: "dshsched-module-icon" }, ClockIcon(16)),
    el("span", { className: "dshsched-module-label" }, "\u5B9A\u65F6\u4EFB\u52A1"),
    el("span", { className: "dshsched-module-badge" }, String(enabledCount))
  ) : el(
    "button",
    { className: "dshsched-rail-btn", onClick: () => setOpen((o) => !o), title: "\u5B9A\u65F6\u4EFB\u52A1" },
    el("span", { className: "dshsched-clock" }, ClockIcon(18))
  );
  const drawer = open ? el(
    "div",
    {
      className: "dshsched-backdrop",
      onMouseDown: (ev) => {
        pressInside.current = ev.target !== ev.currentTarget;
      },
      onClick: () => {
        if (pressInside.current !== true) setOpen(false);
      }
    },
    el(TaskPanel, {
      data,
      now: Date.now(),
      onState: setData,
      onError: setError,
      onOpen: openSessionById,
      onClose: () => setOpen(false)
    })
  ) : null;
  const errToast = open && error !== "" ? el("div", { className: "dshsched-banner dshsched-banner-err", style: { position: "fixed", bottom: 12, right: 16, zIndex: 810 } }, error) : null;
  return el("div", null, trigger, drawer, errToast);
}
module.exports = {
  inject: [],
  apply(ctx) {
    ctx.inject(["connection", "slots"], (child) => {
      const connection = child.connection;
      const slots = child.slots;
      if (slots === void 0) return;
      rpcFn = (endpoint, payload) => connection.rpc.call("/scheduled-tasks", endpoint, payload ?? null);
      openSession = (id) => {
        const sessionsService = ctx.get("sessions");
        if (sessionsService !== void 0 && id) {
          try {
            sessionsService.open(id);
          } catch (e) {
          }
        }
      };
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-scheduled-tasks";
      tag.textContent = CSS;
      document.head.appendChild(tag);
      ctx.effect(() => () => {
        tag.remove();
      }, "dsh-scheduled-tasks: css");
      let settled = false;
      const win = (register) => {
        if (settled) return;
        settled = true;
        register();
      };
      slots.inject("sidebar.sections", () => win(() => {
        slots.register(
          { name: "sidebar.sections", id: "scheduled-tasks", order: 0, label: "\u5B9A\u65F6\u4EFB\u52A1" },
          (slotProps) => el(SchedulerSection, { wide: !!(slotProps && slotProps.wide) })
        );
      }));
      const fallbackTimer = setTimeout(() => win(() => {
        slots.inject("conversation.session.header.actions", () => {
          slots.register(
            { name: "conversation.session.header.actions", id: "scheduled-tasks", order: 20 },
            () => el(SchedulerSection, { wide: false })
          );
        });
      }), 4e3);
      ctx.effect(() => () => {
        clearTimeout(fallbackTimer);
      }, "dsh-scheduled-tasks: slot fallback timer");
      ctx.effect(() => () => {
        rpcFn = null;
        openSession = null;
      }, "dsh-scheduled-tasks: bridges");
    });
  }
};
return module.exports; } });
