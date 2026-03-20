<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chatbot Agent Builder — UX Storyboard</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

_, _::before, \*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
--bg: #f4f3f0;
--surface: #ffffff;
--surface2: #f8f7f5;
--border: rgba(0,0,0,0.09);
--border-strong: rgba(0,0,0,0.15);
--text: #1a1a18;
--text2: #6b6b67;
--text3: #a0a09c;
--accent: #4f46e5;
--accent-light: #eef2ff;
--accent-text: #3730a3;
--success: #16a34a;
--success-light: #f0fdf4;
--warning: #d97706;
--warning-light: #fffbeb;
--danger: #dc2626;
--danger-light: #fef2f2;
--purple: #7c3aed;
--purple-light: #f5f3ff;
--teal: #0d9488;
--teal-light: #f0fdfa;
--r: 8px;
--r-lg: 12px;
--r-xl: 16px;
--shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-lg: 0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
}

body {
font-family: 'DM Sans', sans-serif;
background: var(--bg);
color: var(--text);
font-size: 13px;
line-height: 1.5;
min-height: 100vh;
}

/_ ─── STORYBOARD SHELL ─── _/
.storyboard-header {
background: var(--text);
color: #fff;
padding: 14px 24px;
display: flex;
align-items: center;
justify-content: space-between;
position: sticky;
top: 0;
z-index: 100;
}
.storyboard-header h1 { font-size: 14px; font-weight: 500; letter-spacing: -0.01em; }
.storyboard-header .meta { font-size: 11px; color: rgba(255,255,255,0.5); }

.screen-nav {
display: flex;
gap: 4px;
padding: 0 24px;
background: var(--surface);
border-bottom: 1px solid var(--border);
overflow-x: auto;
scrollbar-width: none;
position: sticky;
top: 49px;
z-index: 90;
}
.screen-nav::-webkit-scrollbar { display: none; }
.screen-tab {
padding: 10px 16px;
font-size: 12px;
font-weight: 500;
color: var(--text2);
border: none;
background: none;
cursor: pointer;
white-space: nowrap;
border-bottom: 2px solid transparent;
transition: all 0.15s;
font-family: inherit;
}
.screen-tab:hover { color: var(--text); }
.screen-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

.screen-num {
display: inline-flex;
align-items: center;
justify-content: center;
width: 18px; height: 18px;
border-radius: 50%;
background: var(--border);
font-size: 10px;
font-weight: 600;
margin-right: 6px;
color: var(--text2);
}
.screen-tab.active .screen-num { background: var(--accent); color: #fff; }

.storyboard-body {
padding: 32px 24px;
max-width: 1400px;
margin: 0 auto;
}

.screen-section { display: none; }
.screen-section.active { display: block; }

.screen-label {
display: flex;
align-items: flex-start;
gap: 16px;
margin-bottom: 20px;
}
.screen-label-num {
font-size: 11px;
font-weight: 600;
color: var(--accent);
background: var(--accent-light);
padding: 3px 10px;
border-radius: 20px;
white-space: nowrap;
margin-top: 2px;
}
.screen-label h2 { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 4px; }
.screen-label p { font-size: 12px; color: var(--text2); line-height: 1.6; }

/_ ─── CHROME FRAME ─── _/
.browser-chrome {
background: var(--surface);
border-radius: var(--r-xl);
box-shadow: var(--shadow-lg);
overflow: hidden;
border: 1px solid var(--border);
}
.chrome-bar {
background: #f0efed;
padding: 10px 16px;
display: flex;
align-items: center;
gap: 10px;
border-bottom: 1px solid var(--border);
}
.chrome-dots { display: flex; gap: 5px; }
.chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
.chrome-dot.r { background: #ff5f57; }
.chrome-dot.y { background: #ffbd2e; }
.chrome-dot.g { background: #28c840; }
.chrome-url {
flex: 1;
background: var(--surface);
border-radius: 6px;
padding: 5px 12px;
font-size: 11px;
color: var(--text2);
font-family: 'DM Mono', monospace;
}

/_ ─── APP SHELL ─── _/
.app-topbar {
display: flex;
align-items: center;
justify-content: space-between;
padding: 12px 20px;
border-bottom: 1px solid var(--border);
background: var(--surface);
}
.app-topbar-left { display: flex; align-items: center; gap: 12px; }
.app-topbar-right { display: flex; align-items: center; gap: 8px; }
.app-logo { font-size: 14px; font-weight: 600; letter-spacing: -0.02em; color: var(--text); }
.app-logo span { color: var(--accent); }

/_ ─── BUTTONS ─── _/
.btn {
display: inline-flex; align-items: center; gap: 6px;
padding: 7px 14px;
border-radius: var(--r);
font-size: 12px;
font-weight: 500;
font-family: inherit;
cursor: pointer;
border: 1px solid var(--border-strong);
background: var(--surface);
color: var(--text);
transition: all 0.12s;
white-space: nowrap;
}
.btn:hover { background: var(--surface2); }
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.btn-primary:hover { background: #4338ca; }
.btn-sm { padding: 4px 10px; font-size: 11px; }
.btn-ghost { border-color: transparent; background: transparent; }
.btn-ghost:hover { background: var(--surface2); }
.btn-success { background: var(--success-light); color: var(--success); border-color: rgba(22,163,74,0.2); }
.btn-danger { background: var(--danger-light); color: var(--danger); border-color: rgba(220,38,38,0.2); }

/_ ─── BADGES ─── _/
.badge {
display: inline-flex; align-items: center;
padding: 2px 8px; border-radius: 20px;
font-size: 10px; font-weight: 600; letter-spacing: 0.02em;
}
.badge-success { background: var(--success-light); color: var(--success); }
.badge-warning { background: var(--warning-light); color: var(--warning); }
.badge-danger { background: var(--danger-light); color: var(--danger); }
.badge-purple { background: var(--purple-light); color: var(--purple); }
.badge-teal { background: var(--teal-light); color: var(--teal); }
.badge-neutral { background: var(--surface2); color: var(--text2); border: 1px solid var(--border); }
.badge-accent { background: var(--accent-light); color: var(--accent-text); }

/_ ─── CARDS ─── _/
.card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--r-lg);
padding: 16px;
}
.card-hover { cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; }
.card-hover:hover { box-shadow: var(--shadow); border-color: var(--border-strong); }

/_ ─── FORM ELEMENTS ─── _/
.form-label { font-size: 11px; font-weight: 500; color: var(--text2); display: block; margin-bottom: 5px; }
.form-input {
width: 100%; padding: 8px 10px; border: 1px solid var(--border-strong);
border-radius: var(--r); font-size: 13px; font-family: inherit;
background: var(--surface); color: var(--text);
outline: none; transition: border-color 0.12s;
}
.form-input:focus { border-color: var(--accent); }
.form-textarea { resize: none; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.6; }
.form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }

/_ ─── TOGGLE ─── _/
.toggle { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-track {
position: absolute; inset: 0;
background: var(--border-strong); border-radius: 20px;
cursor: pointer; transition: background 0.2s;
}
.toggle input:checked + .toggle-track { background: var(--accent); }
.toggle-thumb {
position: absolute;
top: 3px; left: 3px;
width: 14px; height: 14px;
border-radius: 50%; background: #fff;
transition: transform 0.2s; pointer-events: none;
box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }

/_ ─── PROGRESS BAR ─── _/
.progress-bar { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 2px; background: var(--accent); transition: width 0.3s; }

/_ ─── DIVIDER ─── _/
.divider { height: 1px; background: var(--border); margin: 16px 0; }

/_ ─── SECTION HEADING ─── _/
.section-head { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.section-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
.section-head h3 { font-size: 14px; font-weight: 600; }
.section-head .section-action { margin-left: auto; }

/_ ─── CALLOUT ─── _/
.callout { border-radius: var(--r); padding: 10px 12px; display: flex; gap: 10px; align-items: flex-start; font-size: 12px; line-height: 1.5; }
.callout-icon { flex-shrink: 0; font-size: 14px; }
.callout-info { background: var(--accent-light); color: var(--accent-text); }
.callout-warning { background: var(--warning-light); color: var(--warning); }
.callout-success { background: var(--success-light); color: var(--success); }

/_ ─── ANNOTATION SYSTEM ─── _/
.annotations { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
.annotation {
background: var(--surface);
border: 1px solid var(--border);
border-left: 3px solid var(--accent);
border-radius: var(--r);
padding: 10px 12px;
}
.annotation-label { font-size: 10px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.annotation p { font-size: 11px; color: var(--text2); line-height: 1.5; }
.annotation.warn { border-left-color: var(--warning); }
.annotation.warn .annotation-label { color: var(--warning); }
.annotation.good { border-left-color: var(--success); }
.annotation.good .annotation-label { color: var(--success); }

/_ ─── SCREEN 1: DASHBOARD ─── _/
.dashboard-grid {
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 10px;
margin-bottom: 20px;
}
.metric-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: var(--r-lg);
padding: 14px 16px;
}
.metric-label { font-size: 11px; color: var(--text2); margin-bottom: 6px; }
.metric-value { font-size: 26px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
.metric-trend { font-size: 11px; }
.metric-trend.up { color: var(--success); }
.metric-trend.down { color: var(--danger); }
.metric-trend.flat { color: var(--text3); }

.agent-table { width: 100%; border-collapse: collapse; }
.agent-table th { text-align: left; font-size: 11px; font-weight: 500; color: var(--text2); padding: 8px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); }
.agent-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
.agent-table tr:last-child td { border-bottom: none; }
.agent-table tr:hover td { background: var(--surface2); cursor: pointer; }

/_ ─── SCREEN 2: ONBOARDING ─── _/
.template-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.template-card {
border: 1.5px solid var(--border);
border-radius: var(--r-lg);
padding: 16px;
cursor: pointer;
transition: all 0.15s;
background: var(--surface);
}
.template-card:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); }
.template-card.selected { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light); background: var(--accent-light); }
.template-emoji { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 10px; }
.template-card h4 { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.template-card p { font-size: 11px; color: var(--text2); line-height: 1.4; }
.template-meta { font-size: 10px; color: var(--text3); margin-top: 8px; }

/_ ─── BUILDER LAYOUT ─── _/
.builder-layout {
display: grid;
grid-template-columns: 168px 1fr 300px;
height: 520px;
}
.builder-nav {
border-right: 1px solid var(--border);
padding: 12px 10px;
background: var(--surface2);
display: flex;
flex-direction: column;
gap: 2px;
}
.builder-nav-item {
display: flex; align-items: center; gap: 8px;
padding: 8px 10px;
border-radius: var(--r);
font-size: 12px; font-weight: 500;
color: var(--text2);
cursor: pointer;
transition: all 0.12s;
text-decoration: none;
}
.builder-nav-item:hover { background: var(--surface); color: var(--text); }
.builder-nav-item.active { background: var(--accent-light); color: var(--accent-text); }
.builder-nav-item .nav-icon { font-size: 14px; width: 20px; text-align: center; }
.builder-nav-item .nav-check { margin-left: auto; font-size: 11px; color: var(--success); }

.builder-content { overflow-y: auto; padding: 22px 24px; }

/_ ─── TEST CHAT PANEL ─── _/
.test-chat-panel {
border-left: 1px solid var(--border);
display: flex; flex-direction: column;
background: var(--surface);
}
.test-chat-header {
padding: 10px 14px;
border-bottom: 1px solid var(--border);
display: flex; align-items: center; justify-content: space-between;
background: var(--surface2);
flex-shrink: 0;
}
.test-chat-header span { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.test-chat-live { width: 7px; height: 7px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.chat-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.chat-msg { display: flex; gap: 7px; align-items: flex-start; }
.chat-msg.user { flex-direction: row-reverse; }
.chat-avatar {
width: 24px; height: 24px; border-radius: 50%;
background: var(--accent-light); display: flex; align-items: center;
justify-content: center; font-size: 11px; flex-shrink: 0; color: var(--accent);
}
.chat-avatar.user { background: var(--surface2); color: var(--text2); }
.chat-bubble {
padding: 9px 11px; border-radius: 10px 10px 10px 3px;
font-size: 12px; line-height: 1.5; max-width: 195px;
background: var(--accent-light); color: var(--text);
}
.chat-bubble.user { border-radius: 10px 10px 3px 10px; background: var(--surface2); }
.chat-meta { font-size: 10px; color: var(--text3); margin-top: 4px; }
.chat-meta .conf { color: var(--success); font-weight: 600; }
.chat-actions { display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap; }
.chat-action-btn {
font-size: 10px; padding: 3px 9px; border: 1px solid var(--border-strong);
border-radius: 6px; background: var(--surface); cursor: pointer; font-family: inherit;
color: var(--text); transition: background 0.12s;
}
.chat-action-btn:hover { background: var(--surface2); }
.chat-input-row {
padding: 10px 12px; border-top: 1px solid var(--border);
display: flex; gap: 7px; flex-shrink: 0;
}
.chat-input {
flex: 1; padding: 7px 10px; border: 1px solid var(--border-strong);
border-radius: var(--r); font-size: 12px; font-family: inherit;
outline: none; background: var(--surface);
}
.chat-input:focus { border-color: var(--accent); }
.chat-send {
width: 32px; height: 32px; border-radius: var(--r);
background: var(--accent); border: none; cursor: pointer;
display: flex; align-items: center; justify-content: center;
flex-shrink: 0;
}
.chat-send svg { width: 14px; height: 14px; fill: #fff; }

/_ ─── ACTION ITEM ─── _/
.action-item {
display: flex; align-items: center; gap: 12px;
padding: 12px 14px;
border: 1px solid var(--border);
border-radius: var(--r-lg);
background: var(--surface);
}
.action-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.action-info { flex: 1 }
.action-name { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.action-desc { font-size: 11px; color: var(--text2); margin-top: 1px; }

/_ ─── KNOWLEDGE ITEM ─── _/
.knowledge-item {
display: flex; align-items: center; gap: 12px;
padding: 12px 14px;
border: 1px solid var(--border);
border-radius: var(--r-lg);
background: var(--surface);
}
.knowledge-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
.knowledge-info { flex: 1; }
.knowledge-name { font-size: 13px; font-weight: 500; }
.knowledge-meta { font-size: 11px; color: var(--text2); margin-top: 1px; }
.knowledge-actions { display: flex; align-items: center; gap: 8px; }

/_ ─── CHANNEL CARD ─── _/
.channel-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--r-lg); background: var(--surface); }
.channel-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.channel-info { flex: 1; }
.channel-name { font-size: 13px; font-weight: 500; }
.channel-desc { font-size: 11px; color: var(--text2); }

/_ ─── SCREEN 7: PUBLISH ─── _/
.deploy-step { display: flex; gap: 14px; padding: 14px 16px; border: 1px solid var(--border); border-radius: var(--r-lg); background: var(--surface); }
.deploy-step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-light); color: var(--accent-text); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.deploy-step-num.done { background: var(--success-light); color: var(--success); }
.deploy-step h4 { font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.deploy-step p { font-size: 11px; color: var(--text2); }

/_ ─── SCREEN 8: ANALYTICS ─── _/
.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/_ ─── SCREEN 9: HUMAN HANDOFF ─── _/
.conversation-item { display: flex; gap: 12px; padding: 12px 14px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.12s; }
.conversation-item:hover { background: var(--surface2); }
.conv-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent-light); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: var(--accent-text); flex-shrink: 0; }
.conv-name { font-size: 12px; font-weight: 500; }
.conv-preview { font-size: 11px; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
.conv-time { font-size: 10px; color: var(--text3); margin-left: auto; white-space: nowrap; }

/_ ─── SCREEN 10: SETTINGS ─── _/
.settings-row { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border); }
.settings-row:last-child { border-bottom: none; }
.settings-info { flex: 1; }
.settings-label { font-size: 13px; font-weight: 500; }
.settings-desc { font-size: 11px; color: var(--text2); margin-top: 2px; }

/_ mini chart _/
.mini-bar-chart { display: flex; align-items: flex-end; gap: 3px; height: 48px; }
.mini-bar { flex: 1; border-radius: 3px 3px 0 0; background: var(--accent-light); min-height: 4px; }
.mini-bar.hi { background: var(--accent); }

/_ intent row _/
.intent-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.intent-label { font-size: 12px; flex: 1; }
.intent-bar-wrap { width: 110px; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.intent-fill { height: 100%; border-radius: 3px; }
.intent-pct { font-size: 11px; color: var(--text2); min-width: 30px; text-align: right; }

/_ ─── FLOW MAP (SCREEN 1 HEADER) ─── _/
.flow-map { display: flex; align-items: center; gap: 0; overflow-x: auto; padding: 16px 0 20px; scrollbar-width: none; }
.flow-map::-webkit-scrollbar { display: none; }
.flow-node { text-align: center; flex-shrink: 0; }
.flow-node-box {
width: 90px; padding: 10px 8px;
border-radius: var(--r-lg);
border: 1.5px solid var(--border);
background: var(--surface);
cursor: pointer; transition: all 0.15s;
}
.flow-node-box:hover { border-color: var(--accent); }
.flow-node-box.current { border-color: var(--accent); background: var(--accent-light); }
.flow-node-icon { font-size: 20px; margin-bottom: 4px; }
.flow-node-label { font-size: 10px; font-weight: 500; color: var(--text2); }
.flow-arrow { color: var(--text3); font-size: 16px; padding: 0 4px; margin-top: -16px; }

/_ tag chip _/
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; font-size: 11px; background: var(--surface2); border: 1px solid var(--border); color: var(--text2); }

/_ code block _/
.code-block { background: #1e1e2e; color: #cdd6f4; border-radius: var(--r-lg); padding: 14px 16px; font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.7; overflow-x: auto; }
.code-block .cm { color: #6c7086; }
.code-block .ck { color: #89dceb; }
.code-block .cv { color: #a6e3a1; }
.code-block .cs { color: #f38ba8; }

/_ ─── RESPONSIVE ─── _/
@media (max-width: 900px) {
.builder-layout { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; height: auto; }
.builder-nav { flex-direction: row; overflow-x: auto; border-right: none; border-bottom: 1px solid var(--border); }
.test-chat-panel { border-left: none; border-top: 1px solid var(--border); height: 300px; }
.template-grid { grid-template-columns: 1fr 1fr; }
.dashboard-grid { grid-template-columns: 1fr 1fr; }
}
</style>

</head>
<body>

<!-- ══════════════════════════════════════════
     STORYBOARD SHELL
══════════════════════════════════════════ -->
<header class="storyboard-header">
  <div>
    <h1>Chatbot Agent Builder — UX Storyboard</h1>
  </div>
  <div class="meta">10 screens · Full user journey</div>
</header>

<nav class="screen-nav">
  <button class="screen-tab active" onclick="showScreen(0)"><span class="screen-num">1</span>Dashboard</button>
  <button class="screen-tab" onclick="showScreen(1)"><span class="screen-num">2</span>Onboarding</button>
  <button class="screen-tab" onclick="showScreen(2)"><span class="screen-num">3</span>Identity</button>
  <button class="screen-tab" onclick="showScreen(3)"><span class="screen-num">4</span>Behaviour</button>
  <button class="screen-tab" onclick="showScreen(4)"><span class="screen-num">5</span>Actions</button>
  <button class="screen-tab" onclick="showScreen(5)"><span class="screen-num">6</span>Knowledge</button>
  <button class="screen-tab" onclick="showScreen(6)"><span class="screen-num">7</span>Channels</button>
  <button class="screen-tab" onclick="showScreen(7)"><span class="screen-num">8</span>Publish</button>
  <button class="screen-tab" onclick="showScreen(8)"><span class="screen-num">9</span>Analytics</button>
  <button class="screen-tab" onclick="showScreen(9)"><span class="screen-num">10</span>Handoff Inbox</button>
</nav>

<main class="storyboard-body">

<!-- ══════════════════════
     SCREEN 1 — DASHBOARD
══════════════════════ -->
<section class="screen-section active" id="s0">
  <div class="screen-label">
    <div class="screen-label-num">Screen 1</div>
    <div>
      <h2>Agent Dashboard</h2>
      <p>Home base. Users land here every session. Shows all agents, live metrics, and action-prompting insight cards. Fixes Pain #9 (shallow analytics) and Pain #10 (no roadmap visibility).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents</div>
    </div>

    <!-- App top bar -->
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:12px;color:var(--text2)">Workspace: Acme Corp</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm btn-ghost">Docs</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(1)">+ New Agent</button>
        <div style="width:30px;height:30px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--accent-text);cursor:pointer">R</div>
      </div>
    </div>

    <div style="padding:20px 24px;background:var(--bg)">

      <!-- Top metrics -->
      <div class="dashboard-grid">
        <div class="metric-card">
          <div class="metric-label">Total conversations (7d)</div>
          <div class="metric-value">12,847</div>
          <div class="metric-trend up">↑ 14% vs last week</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Avg resolution rate</div>
          <div class="metric-value" style="color:var(--success)">78%</div>
          <div class="metric-trend up">↑ 3% vs last week</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Human handoffs</div>
          <div class="metric-value" style="color:var(--warning)">8.2%</div>
          <div class="metric-trend down">↑ 2% — needs attention</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Avg response time</div>
          <div class="metric-value">1.2s</div>
          <div class="metric-trend flat">No change</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 320px;gap:14px">

        <!-- Agent list -->
        <div class="card" style="padding:0;overflow:hidden">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border)">
            <span style="font-size:13px;font-weight:600">Active agents</span>
            <button class="btn btn-sm btn-primary" onclick="showScreen(1)">+ New agent</button>
          </div>
          <table class="agent-table">
            <thead>
              <tr>
                <th>Agent</th><th>Conversations</th><th>Resolution</th><th>CSAT</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr onclick="showScreen(2)">
                <td>
                  <div style="font-weight:500">Customer Support Bot</div>
                  <div style="font-size:11px;color:var(--text2)">Web · WhatsApp</div>
                </td>
                <td>9,420</td>
                <td style="color:var(--success);font-weight:500">82%</td>
                <td>4.6 ★</td>
                <td><span class="badge badge-success">Live</span></td>
                <td><button class="btn btn-sm">Edit</button></td>
              </tr>
              <tr onclick="showScreen(2)">
                <td>
                  <div style="font-weight:500">Lead Qualifier</div>
                  <div style="font-size:11px;color:var(--text2)">Web embed</div>
                </td>
                <td>2,104</td>
                <td style="color:var(--success);font-weight:500">71%</td>
                <td>4.2 ★</td>
                <td><span class="badge badge-success">Live</span></td>
                <td><button class="btn btn-sm">Edit</button></td>
              </tr>
              <tr onclick="showScreen(2)">
                <td>
                  <div style="font-weight:500;opacity:.6">Order Assistant</div>
                  <div style="font-size:11px;color:var(--text2)">Not deployed</div>
                </td>
                <td style="color:var(--text3)">—</td>
                <td style="color:var(--text3)">—</td>
                <td style="color:var(--text3)">—</td>
                <td><span class="badge badge-neutral">Draft</span></td>
                <td><button class="btn btn-sm">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Right column: insights -->
        <div style="display:flex;flex-direction:column;gap:12px">
          <!-- Unresolved intents -->
          <div class="card">
            <div style="font-size:12px;font-weight:600;margin-bottom:12px">Top unresolved intents</div>
            <div class="intent-row">
              <span class="intent-label">Refund request</span>
              <div class="intent-bar-wrap"><div class="intent-fill" style="width:68%;background:var(--danger)"></div></div>
              <span class="intent-pct">68%</span>
            </div>
            <div class="intent-row">
              <span class="intent-label">Cancel subscription</span>
              <div class="intent-bar-wrap"><div class="intent-fill" style="width:54%;background:var(--warning)"></div></div>
              <span class="intent-pct">54%</span>
            </div>
            <div class="intent-row" style="margin-bottom:0">
              <span class="intent-label">Billing question</span>
              <div class="intent-bar-wrap"><div class="intent-fill" style="width:31%;background:var(--warning)"></div></div>
              <span class="intent-pct">31%</span>
            </div>
            <button class="btn btn-sm" style="margin-top:12px;width:100%;justify-content:center" onclick="showScreen(2)">Fix in builder →</button>
          </div>

          <!-- Action callout -->
          <div class="callout callout-warning">
            <span class="callout-icon">⚠</span>
            <div>
              <strong style="font-weight:600">Handoff rate rising</strong><br>
              Support Bot is escalating 10%+ on billing questions. Add refund + billing intents.
              <br><button class="btn btn-sm" style="margin-top:8px" onclick="showScreen(2)">Open builder →</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">UX Win</div><p>Metric cards link directly to actionable states — "needs attention" is clickable</p></div>
    <div class="annotation"><div class="annotation-label">Pain #9</div><p>Analytics surface the "why" (top unresolved intents) not just the "what" (resolution %)</p></div>
    <div class="annotation good"><div class="annotation-label">UX Win</div><p>Agent table shows CSAT, status, and conversations at a glance — no drill-down needed for daily review</p></div>
    <div class="annotation"><div class="annotation-label">Pain #10</div><p>Recommendation panel acts as a lightweight "roadmap" — tells users what to build next</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 2 — TEMPLATE PICKER (ONE CLICK → BUILDER)
══════════════════════ -->
<section class="screen-section" id="s1">
  <div class="screen-label">
    <div class="screen-label-num">Screen 2</div>
    <div>
      <h2>Template Picker → Drops straight into builder</h2>
      <p>Selecting a template is ONE click — user lands directly in the builder with every section already pre-filled. No wizard, no "Step 2 of 3", no naming interstitial. The preview panel on the right shows exactly what each template will load before committing.</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left"><div class="app-logo">agent<span>hub</span></div></div>
      <div class="app-topbar-right">
        <span style="font-size:12px;color:var(--text2);font-style:italic">Choose a starting point</span>
      </div>
    </div>

    <!-- Two-panel: picker + live preview -->
    <div style="display:grid;grid-template-columns:1fr 296px;min-height:480px">

      <!-- LEFT: Template grid -->
      <div style="padding:24px 28px;border-right:1px solid var(--border);background:var(--bg)">
        <h2 style="font-size:18px;font-weight:700;letter-spacing:-0.02em;margin-bottom:4px">Pick a starting point</h2>
        <p style="color:var(--text2);margin-bottom:18px;font-size:12px">One click loads everything into the builder — identity, behaviour, actions, knowledge, channels. Edit anything after.</p>

        <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap" id="tpl-filter-row">
          <button class="btn btn-sm" style="background:var(--accent-light);color:var(--accent-text);border-color:transparent" onclick="filterTpl('all',this)">All</button>
          <button class="btn btn-sm btn-ghost" onclick="filterTpl('support',this)">Support</button>
          <button class="btn btn-sm btn-ghost" onclick="filterTpl('sales',this)">Sales</button>
          <button class="btn btn-sm btn-ghost" onclick="filterTpl('ecomm',this)">E-commerce</button>
          <button class="btn btn-sm btn-ghost" onclick="filterTpl('onboarding',this)">Onboarding</button>
        </div>

        <div class="template-grid" id="template-grid">
          <div class="template-card" data-cat="support" onclick="selectTplAndPreview(this,'Customer Support Bot','💬','#eff6ff','You are a helpful customer support assistant. Answer questions about pricing, features, and technical issues. Escalate to human when needed.','Process Refund · Book Meeting · Create Ticket','Product Docs · FAQ Database · Pricing & Plans')">
            <div class="template-emoji" style="background:#eff6ff">💬</div>
            <h4>Customer Support</h4>
            <p>FAQ, order tracking, and escalation to human agent</p>
            <div class="template-meta">★ Most popular</div>
          </div>
          <div class="template-card" data-cat="sales" onclick="selectTplAndPreview(this,'Lead Qualifier','🎯','#f0fdf4','You qualify and score inbound leads. Ask about company size, budget, and timeline. Route qualified leads to the sales team via CRM.','Book Meeting · Create CRM Lead · Send Email','Product Overview · Pricing & Plans · Case Studies')">
            <div class="template-emoji" style="background:#f0fdf4">🎯</div>
            <h4>Lead Qualifier</h4>
            <p>Qualify, score, and route leads to CRM automatically</p>
            <div class="template-meta">Sales</div>
          </div>
          <div class="template-card" data-cat="ecomm" onclick="selectTplAndPreview(this,'Order Assistant','📦','#fffbeb','You help customers track orders, process returns, and initiate refunds. Always look up the order number before responding.','Process Refund · Track Order · Create Ticket','Order Policy · Returns FAQ · Shipping Info')">
            <div class="template-emoji" style="background:#fffbeb">📦</div>
            <h4>Order Assistant</h4>
            <p>Track, return, and refund workflows for e-commerce</p>
            <div class="template-meta">E-commerce</div>
          </div>
          <div class="template-card" data-cat="onboarding" onclick="selectTplAndPreview(this,'User Onboarding Bot','🚀','#f5f3ff','You guide new users through product setup. Walk them through each activation step and celebrate milestones.','Send Email · Book Onboarding Call','Getting Started Guide · Feature Docs · Video Tutorials')">
            <div class="template-emoji" style="background:#f5f3ff">🚀</div>
            <h4>User Onboarding</h4>
            <p>Guide new users through product setup and activation</p>
            <div class="template-meta">Onboarding</div>
          </div>
          <div class="template-card" data-cat="support" onclick="selectTplAndPreview(this,'IT Help Desk','🔧','#fef2f2','You triage IT support tickets, help reset passwords, and route issues to the right team. Always collect asset ID and issue description first.','Create Ticket · Send Email · Escalate to Team','IT Policy Docs · Known Issues · Password Reset Guide')">
            <div class="template-emoji" style="background:#fef2f2">🔧</div>
            <h4>IT Help Desk</h4>
            <p>Triage tickets, reset passwords, route issues</p>
            <div class="template-meta">Support</div>
          </div>
          <div class="template-card" data-cat="blank" style="border-style:dashed;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:120px" onclick="selectTplAndPreview(this,'Blank Agent','✏️','#f8f7f5','','','')">
            <div style="font-size:22px;color:var(--text3);margin-bottom:8px">+</div>
            <div style="font-size:12px;color:var(--text2);font-weight:500">Start from scratch</div>
            <div class="template-meta">All sections blank</div>
          </div>
        </div>
      </div>

      <!-- RIGHT: Pre-fill preview panel -->
      <div style="padding:20px 18px;background:var(--surface);display:flex;flex-direction:column">
        <div id="tpl-preview-empty" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--text3);gap:10px">
          <div style="font-size:32px">👈</div>
          <div style="font-size:12px;line-height:1.6">Click a template to<br>preview what gets pre-filled</div>
        </div>

        <div id="tpl-preview-content" style="display:none;flex-direction:column;gap:10px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;padding-bottom:14px;border-bottom:1px solid var(--border)">
            <div id="prev-icon" style="width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px">💬</div>
            <div>
              <div id="prev-name" style="font-size:13px;font-weight:600"></div>
              <div style="font-size:11px;color:var(--text2)">Pre-fills all 5 sections</div>
            </div>
          </div>

          <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 12px;background:var(--surface2)">
            <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">👤 Identity</div>
            <div style="font-size:11px;color:var(--text)">Bot name: <strong id="prev-identity-name" style="font-weight:500"></strong></div>
            <div style="font-size:11px;color:var(--text2);margin-top:2px">Welcome message + tone preset</div>
          </div>

          <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 12px;background:var(--surface2)">
            <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">🧠 Behaviour</div>
            <div id="prev-prompt" style="font-size:11px;color:var(--text);font-family:'DM Mono',monospace;line-height:1.5;background:var(--surface);border-radius:4px;padding:6px 8px;border:1px solid var(--border)"></div>
          </div>

          <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 12px;background:var(--surface2)">
            <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">⚡ Actions</div>
            <div id="prev-actions" style="font-size:11px;color:var(--text);line-height:1.6"></div>
          </div>

          <div style="border:1px solid var(--border);border-radius:var(--r-lg);padding:10px 12px;background:var(--surface2)">
            <div style="font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px">📚 Knowledge</div>
            <div id="prev-knowledge" style="font-size:11px;color:var(--text);line-height:1.6"></div>
          </div>

          <button id="tpl-launch-btn" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:2px" onclick="launchBuilder()">Use this template →</button>
          <div style="text-align:center;font-size:10px;color:var(--text3)">No extra steps — lands straight in builder</div>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Key Fix</div><p>One click on a template = straight into the builder. No wizard steps, no "Step 1 of 3", no naming screen.</p></div>
    <div class="annotation"><div class="annotation-label">Preview Panel</div><p>Right panel shows the exact system prompt, actions, and knowledge sources each template loads — no blind commitment</p></div>
    <div class="annotation good"><div class="annotation-label">Free-roam Builder</div><p>All 5 sections are unlocked with ✓ marks on entry — user goes directly to what they want to change</p></div>
    <div class="annotation"><div class="annotation-label">Blank Option</div><p">"Start from scratch" still available for power users — but it's visually de-emphasised vs the rich templates</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 3 — BUILDER: IDENTITY
══════════════════════ -->
<section class="screen-section" id="s2">
  <div class="screen-label">
    <div class="screen-label-num">Screen 3</div>
    <div>
      <h2>Builder — Identity</h2>
      <p>First section of the builder. Sets the bot's name, avatar, welcome message, and tone. The test chat panel is always visible and already shows a live preview.</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/identity</div>
    </div>

    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot</span>
        <span class="badge badge-neutral">Draft</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm">Save Draft</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(7)">Deploy →</button>
      </div>
    </div>

    <div class="builder-layout">
      <!-- Nav — ALL sections unlocked (free-roam after template) -->
      <div class="builder-nav">
        <div class="builder-nav-item active" onclick="showScreen(2)"><span class="nav-icon">👤</span> Identity <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(3)"><span class="nav-icon">🧠</span> Behaviour <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(4)"><span class="nav-icon">⚡</span> Actions <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(5)"><span class="nav-icon">📚</span> Knowledge <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(6)"><span class="nav-icon">📡</span> Channels <span class="nav-check">✓</span></div>
        <div style="margin-top:auto;padding:10px;background:var(--success-light);border-radius:var(--r);border:1px solid rgba(22,163,74,0.2)">
          <div style="font-size:10px;color:var(--success);font-weight:600;margin-bottom:2px">✓ Template loaded</div>
          <div style="font-size:10px;color:var(--success)">All sections pre-filled.<br>Edit anything freely.</div>
        </div>
      </div>

      <!-- Content -->
      <div class="builder-content">

        <!-- Pre-filled banner -->
        <div class="callout callout-success" style="margin-bottom:16px">
          <span class="callout-icon">✓</span>
          <div>
            <strong style="font-weight:600">Pre-filled from "Customer Support" template.</strong> Review and edit anything. All other sections are also ready — use the left nav to jump around.
            <span style="font-size:11px;color:var(--success);margin-left:8px;cursor:pointer;text-decoration:underline">Dismiss</span>
          </div>
        </div>

        <div class="section-head">
          <div class="section-icon" style="background:var(--accent-light)">👤</div>
          <h3>Bot Identity</h3>
        </div>

        <div style="margin-bottom:14px">
          <label class="form-label">Bot name</label>
          <input class="form-input" type="text" value="Support Assistant" style="max-width:360px">
        </div>

        <div style="margin-bottom:14px">
          <label class="form-label">Welcome message</label>
          <input class="form-input" type="text" value="Hi! How can I help you today?" style="max-width:420px">
          <div style="font-size:11px;color:var(--text3);margin-top:4px">This is the first message users see when the chat opens.</div>
        </div>

        <div style="margin-bottom:16px">
          <label class="form-label">Bot avatar</label>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:22px">💬</div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm">Upload image</button>
              <button class="btn btn-sm btn-ghost">Choose emoji</button>
            </div>
          </div>
        </div>

        <div style="margin-bottom:18px">
          <label class="form-label">Tone of voice</label>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm" style="background:var(--accent-light);color:var(--accent-text);border-color:transparent" onclick="selectTone(this)">Professional</button>
            <button class="btn btn-sm btn-ghost" onclick="selectTone(this)">Friendly & warm</button>
            <button class="btn btn-sm btn-ghost" onclick="selectTone(this)">Concise</button>
            <button class="btn btn-sm btn-ghost" onclick="selectTone(this)">Technical</button>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:6px">The AI uses this to shape its response style throughout all conversations.</div>
        </div>

        <div style="margin-bottom:14px">
          <label class="form-label">Language</label>
          <select class="form-input form-select" style="max-width:220px">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);align-items:center">
          <button class="btn btn-primary" onclick="showScreen(7)">Looks good — Deploy →</button>
          <span style="font-size:11px;color:var(--text3)">or keep editing using the left nav</span>
        </div>
      </div>

      <!-- Test Chat -->
      <div class="test-chat-panel">
        <div class="test-chat-header">
          <span><div class="test-chat-live"></div> Test Chat</span>
          <button class="btn btn-sm btn-ghost" style="font-size:11px">Reset</button>
        </div>
        <div class="chat-messages">
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div><div class="chat-bubble">Hi! How can I help you today?</div></div>
          </div>
          <div style="text-align:center;font-size:10px;color:var(--text3);padding:4px 0">Type a message to test your bot live →</div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" placeholder="Type a test message…">
          <button class="chat-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Free-roam Nav</div><p>All 5 sections show ✓ — user can jump to Actions or Knowledge directly, zero forced sequence</p></div>
    <div class="annotation good"><div class="annotation-label">Pre-filled Banner</div><p>Green banner tells users what the template loaded — dismissible, doesn't clutter on repeat visits</p></div>
    <div class="annotation"><div class="annotation-label">Deploy Shortcut</div><p>"Looks good — Deploy →" is available from every section, not just a final wizard step</p></div>
    <div class="annotation good"><div class="annotation-label">Test Chat Live</div><p>Test chat already shows a realistic conversation because the system prompt was pre-filled by the template</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 4 — BUILDER: BEHAVIOUR
══════════════════════ -->
<section class="screen-section" id="s3">
  <div class="screen-label">
    <div class="screen-label-num">Screen 4</div>
    <div>
      <h2>Builder — Behaviour</h2>
      <p>System prompt with AI-assist writing, response style slider, model config hidden behind "Advanced", and fallback behaviour config. Fixes Pain #5 (scary blank textarea) and Pain #7 (AI assistance while building).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/behaviour</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot</span>
        <span class="badge badge-neutral">Draft</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm">Save Draft</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(7)">Deploy →</button>
      </div>
    </div>

    <div class="builder-layout">
      <div class="builder-nav">
        <div class="builder-nav-item" onclick="showScreen(2)"><span class="nav-icon">👤</span> Identity <span class="nav-check">✓</span></div>
        <div class="builder-nav-item active" onclick="showScreen(3)"><span class="nav-icon">🧠</span> Behaviour</div>
        <div class="builder-nav-item" onclick="showScreen(4)"><span class="nav-icon">⚡</span> Actions</div>
        <div class="builder-nav-item" onclick="showScreen(5)"><span class="nav-icon">📚</span> Knowledge</div>
        <div class="builder-nav-item" onclick="showScreen(6)"><span class="nav-icon">📡</span> Channels</div>
        <div style="margin-top:auto;padding:10px;background:var(--surface);border-radius:var(--r);border:1px solid var(--border)">
          <div style="font-size:10px;color:var(--text2);margin-bottom:5px">Setup progress</div>
          <div class="progress-bar"><div class="progress-fill" style="width:40%"></div></div>
          <div style="font-size:10px;color:var(--accent);margin-top:4px">2 of 5 done</div>
        </div>
      </div>

      <div class="builder-content">
        <div class="section-head">
          <div class="section-icon" style="background:#f0fdf4">🧠</div>
          <h3>Behaviour</h3>
        </div>

        <div style="margin-bottom:16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
            <label class="form-label" style="margin:0">System instructions</label>
            <button class="btn btn-sm" style="background:var(--accent-light);color:var(--accent-text);border-color:transparent;gap:4px">✦ Generate with AI</button>
          </div>
          <textarea class="form-input form-textarea" rows="5" style="width:100%">You are a helpful customer support assistant for Acme Corp. Answer questions about pricing, features, and technical issues. Be concise and friendly. Always cite your sources when possible. If you cannot answer, escalate to a human agent.</textarea>
          <div style="display:flex;justify-content:space-between;margin-top:4px">
            <div style="font-size:11px;color:var(--text3)">Defines how your bot thinks and responds</div>
            <div style="font-size:11px;color:var(--text3)">212 / 2000</div>
          </div>
        </div>

        <!-- Prompt tips -->
        <div class="callout callout-info" style="margin-bottom:16px">
          <span class="callout-icon">💡</span>
          <div>
            <strong style="font-weight:600">Tips for a good system prompt:</strong> Be specific about your company name, what topics to cover, what to avoid, and when to hand off to a human. Use "Always cite sources" to improve trust.
          </div>
        </div>

        <div style="margin-bottom:16px">
          <label class="form-label">Response style</label>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:11px;color:var(--text2);width:50px">Precise</span>
            <input type="range" min="0" max="100" value="30" style="flex:1">
            <span style="font-size:11px;color:var(--text2);width:60px;text-align:right">Creative</span>
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:4px">Lower = consistent, factual answers. Higher = more varied, expressive responses.</div>
        </div>

        <div style="margin-bottom:16px">
          <label class="form-label">When the bot can't answer</label>
          <select class="form-input form-select" style="max-width:340px">
            <option>Handoff to human agent</option>
            <option>Say "I don't know" and offer contact options</option>
            <option>Search and suggest related help articles</option>
          </select>
        </div>

        <!-- Advanced model config - collapsed -->
        <details style="border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;margin-bottom:16px">
          <summary style="padding:12px 14px;cursor:pointer;font-size:12px;font-weight:500;background:var(--surface2);list-style:none;display:flex;justify-content:space-between;align-items:center">
            <span>⚙ Advanced model settings</span>
            <span style="font-size:11px;color:var(--text3)">For developers</span>
          </summary>
          <div style="padding:14px 16px;border-top:1px solid var(--border)">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div>
                <label class="form-label">AI model</label>
                <select class="form-input form-select">
                  <option>Claude Sonnet (recommended)</option>
                  <option>Claude Haiku (faster)</option>
                  <option>GPT-4o</option>
                </select>
              </div>
              <div>
                <label class="form-label">Max tokens</label>
                <input class="form-input" type="number" value="1024">
              </div>
            </div>
            <div style="font-size:11px;color:var(--text2)">Model changes affect response quality and cost. Claude Sonnet is recommended for most use cases.</div>
          </div>
        </details>

        <div style="display:flex;gap:10px;padding-top:16px;border-top:1px solid var(--border)">
          <button class="btn btn-primary" onclick="showScreen(4)">Next: Actions →</button>
          <button class="btn" onclick="showScreen(2)">← Back</button>
        </div>
      </div>

      <!-- Test Chat -->
      <div class="test-chat-panel">
        <div class="test-chat-header">
          <span><div class="test-chat-live"></div> Test Chat</span>
          <button class="btn btn-sm btn-ghost" style="font-size:11px">Reset</button>
        </div>
        <div class="chat-messages">
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div><div class="chat-bubble">Hi! How can I help you today?</div></div>
          </div>
          <div class="chat-msg user">
            <div class="chat-avatar user">U</div>
            <div><div class="chat-bubble user">I was charged twice for my subscription</div></div>
          </div>
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div>
              <div class="chat-bubble">I'm sorry about the duplicate charge. I can see two charges from October 15th on your account. Would you like me to process a refund for $29.99?</div>
              <div class="chat-meta"><span class="conf">94% confidence</span> · Billing FAQ · 380ms</div>
              <div class="chat-actions">
                <button class="chat-action-btn">Process Refund</button>
                <button class="chat-action-btn">Create Ticket</button>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" placeholder="Type a test message…">
          <button class="chat-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Pain #7 Fix</div><p>"Generate with AI" button writes the system prompt — removes the blank-textarea fear entirely</p></div>
    <div class="annotation"><div class="annotation-label">Progressive Disclosure</div><p>Advanced model config is collapsed by default — power users get it, non-technical users aren't scared by it</p></div>
    <div class="annotation good"><div class="annotation-label">Test Chat</div><p>Shows a real conversation with confidence score and source attribution — visible impact of system prompt changes</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 5 — BUILDER: ACTIONS
══════════════════════ -->
<section class="screen-section" id="s4">
  <div class="screen-label">
    <div class="screen-label-num">Screen 5</div>
    <div>
      <h2>Builder — Actions</h2>
      <p>Toggle which integrations the bot can perform. "Requires Approval" badge is prominent — users understand the safety boundary before enabling. Fixes Pain #8 (integration depth).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/actions</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot</span>
        <span class="badge badge-neutral">Draft</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm">Save Draft</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(7)">Deploy →</button>
      </div>
    </div>

    <div class="builder-layout">
      <div class="builder-nav">
        <div class="builder-nav-item" onclick="showScreen(2)"><span class="nav-icon">👤</span> Identity <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(3)"><span class="nav-icon">🧠</span> Behaviour <span class="nav-check">✓</span></div>
        <div class="builder-nav-item active" onclick="showScreen(4)"><span class="nav-icon">⚡</span> Actions</div>
        <div class="builder-nav-item" onclick="showScreen(5)"><span class="nav-icon">📚</span> Knowledge</div>
        <div class="builder-nav-item" onclick="showScreen(6)"><span class="nav-icon">📡</span> Channels</div>
        <div style="margin-top:auto;padding:10px;background:var(--surface);border-radius:var(--r);border:1px solid var(--border)">
          <div style="font-size:10px;color:var(--text2);margin-bottom:5px">Setup progress</div>
          <div class="progress-bar"><div class="progress-fill" style="width:60%"></div></div>
          <div style="font-size:10px;color:var(--accent);margin-top:4px">3 of 5 done</div>
        </div>
      </div>

      <div class="builder-content">
        <div class="section-head">
          <div class="section-icon" style="background:#fffbeb">⚡</div>
          <h3>Actions</h3>
        </div>

        <p style="font-size:12px;color:var(--text2);margin-bottom:16px">Enable what your chatbot can do on behalf of users. Actions marked <strong style="font-weight:500">Requires Approval</strong> will ask a human agent before executing.</p>

        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
          <div class="action-item">
            <div class="action-icon" style="background:#f0fdf4">💳</div>
            <div class="action-info">
              <div class="action-name">Process Refund <span class="badge badge-warning" style="font-size:9px">Requires Approval</span></div>
              <div class="action-desc">Issue refunds to customer accounts via Stripe</div>
            </div>
            <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="action-item">
            <div class="action-icon" style="background:#eff6ff">📅</div>
            <div class="action-info">
              <div class="action-name">Book Meeting</div>
              <div class="action-desc">Schedule meetings via Calendly integration</div>
            </div>
            <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="action-item">
            <div class="action-icon" style="background:#fef2f2">🎫</div>
            <div class="action-info">
              <div class="action-name">Create Ticket</div>
              <div class="action-desc">Create support tickets in Zendesk</div>
            </div>
            <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="action-item" style="opacity:0.65">
            <div class="action-icon" style="background:#f5f3ff">❌</div>
            <div class="action-info">
              <div class="action-name">Cancel Subscription <span class="badge badge-warning" style="font-size:9px">Requires Approval</span></div>
              <div class="action-desc">Process subscription cancellations</div>
            </div>
            <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="action-item" style="opacity:0.65">
            <div class="action-icon" style="background:#fef2f2">🔄</div>
            <div class="action-info">
              <div class="action-name">Update Account <span class="badge badge-warning" style="font-size:9px">Requires Approval</span></div>
              <div class="action-desc">Modify customer account details</div>
            </div>
            <label class="toggle"><input type="checkbox"><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
          <div class="action-item">
            <div class="action-icon" style="background:#f0fdf4">📧</div>
            <div class="action-info">
              <div class="action-name">Send Email</div>
              <div class="action-desc">Send follow-up emails to customers</div>
            </div>
            <label class="toggle"><input type="checkbox" checked><div class="toggle-track"></div><div class="toggle-thumb"></div></label>
          </div>
        </div>

        <button class="btn" style="width:100%;justify-content:center;border-style:dashed;color:var(--text2)">+ Connect new integration</button>

        <div style="display:flex;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
          <button class="btn btn-primary" onclick="showScreen(5)">Next: Knowledge →</button>
          <button class="btn" onclick="showScreen(3)">← Back</button>
        </div>
      </div>

      <!-- Test Chat -->
      <div class="test-chat-panel">
        <div class="test-chat-header">
          <span><div class="test-chat-live"></div> Test Chat</span>
          <button class="btn btn-sm btn-ghost" style="font-size:11px">Reset</button>
        </div>
        <div class="chat-messages">
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div><div class="chat-bubble">Hi! How can I help you today?</div></div>
          </div>
          <div class="chat-msg user">
            <div class="chat-avatar user">U</div>
            <div><div class="chat-bubble user">I was charged twice for my subscription</div></div>
          </div>
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div>
              <div class="chat-bubble">I can see two charges from Oct 15th. Would you like me to process a refund for $29.99?</div>
              <div class="chat-meta"><span class="conf">94% conf</span> · Billing FAQ · 380ms</div>
              <div class="chat-actions">
                <button class="chat-action-btn">Process Refund</button>
                <button class="chat-action-btn">Create Ticket</button>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" placeholder="Type a test message…">
          <button class="chat-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Safety UX</div><p>"Requires Approval" badge is highly visible before users enable dangerous actions — sets expectations clearly</p></div>
    <div class="annotation"><div class="annotation-label">Test Chat</div><p>Action buttons ("Process Refund", "Create Ticket") appear in test chat as soon as actions are enabled</p></div>
    <div class="annotation good"><div class="annotation-label">Pain #8 Fix</div><p>All integrations in one place — Stripe, Calendly, Zendesk, email — not buried in separate settings</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 6 — BUILDER: KNOWLEDGE
══════════════════════ -->
<section class="screen-section" id="s5">
  <div class="screen-label">
    <div class="screen-label-num">Screen 6</div>
    <div>
      <h2>Builder — Knowledge Sources</h2>
      <p>Your key differentiator vs competitors. Shows what sources are enabled, article counts, sync status, and a preview button. Explains HOW knowledge is used. Fixes Pain #5 (no guidance) and Pain #8 (shallow integrations).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/knowledge</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot</span>
        <span class="badge badge-neutral">Draft</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm">Save Draft</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(7)">Deploy →</button>
      </div>
    </div>

    <div class="builder-layout">
      <div class="builder-nav">
        <div class="builder-nav-item" onclick="showScreen(2)"><span class="nav-icon">👤</span> Identity <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(3)"><span class="nav-icon">🧠</span> Behaviour <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(4)"><span class="nav-icon">⚡</span> Actions <span class="nav-check">✓</span></div>
        <div class="builder-nav-item active" onclick="showScreen(5)"><span class="nav-icon">📚</span> Knowledge</div>
        <div class="builder-nav-item" onclick="showScreen(6)"><span class="nav-icon">📡</span> Channels</div>
        <div style="margin-top:auto;padding:10px;background:var(--surface);border-radius:var(--r);border:1px solid var(--border)">
          <div style="font-size:10px;color:var(--text2);margin-bottom:5px">Setup progress</div>
          <div class="progress-bar"><div class="progress-fill" style="width:80%"></div></div>
          <div style="font-size:10px;color:var(--accent);margin-top:4px">4 of 5 done</div>
        </div>
      </div>

      <div class="builder-content">
        <div class="section-head">
          <div class="section-icon" style="background:#f0fdf4">📚</div>
          <h3>Knowledge Sources</h3>
        </div>

        <div class="callout callout-info" style="margin-bottom:16px">
          <span class="callout-icon">ℹ</span>
          <div>When a user asks a question, the bot searches enabled sources first, then generates a response grounded in that content. It cites the source and shows a confidence score in every reply.</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
          <div class="knowledge-item">
            <input type="checkbox" checked style="width:16px;height:16px;accent-color:var(--accent);flex-shrink:0">
            <div class="knowledge-icon" style="background:#eff6ff">📄</div>
            <div class="knowledge-info">
              <div class="knowledge-name">Product Documentation</div>
              <div class="knowledge-meta">142 articles · Synced 2h ago</div>
            </div>
            <div class="knowledge-actions">
              <span class="badge badge-success">Active</span>
              <button class="btn btn-sm">Preview</button>
              <button class="btn btn-sm">Sync now</button>
            </div>
          </div>
          <div class="knowledge-item">
            <input type="checkbox" checked style="width:16px;height:16px;accent-color:var(--accent);flex-shrink:0">
            <div class="knowledge-icon" style="background:#fffbeb">❓</div>
            <div class="knowledge-info">
              <div class="knowledge-name">FAQ Database</div>
              <div class="knowledge-meta">89 entries · Synced 1d ago</div>
            </div>
            <div class="knowledge-actions">
              <span class="badge badge-success">Active</span>
              <button class="btn btn-sm">Preview</button>
              <button class="btn btn-sm">Sync now</button>
            </div>
          </div>
          <div class="knowledge-item" style="opacity:0.65">
            <input type="checkbox" style="width:16px;height:16px;accent-color:var(--accent);flex-shrink:0">
            <div class="knowledge-icon" style="background:var(--surface2)">🔗</div>
            <div class="knowledge-info">
              <div class="knowledge-name">API Reference</div>
              <div class="knowledge-meta">56 endpoints · Technical content</div>
            </div>
            <div class="knowledge-actions">
              <span class="badge badge-neutral">Off</span>
              <button class="btn btn-sm">Preview</button>
            </div>
          </div>
          <div class="knowledge-item">
            <input type="checkbox" checked style="width:16px;height:16px;accent-color:var(--accent);flex-shrink:0">
            <div class="knowledge-icon" style="background:#f0fdf4">💰</div>
            <div class="knowledge-info">
              <div class="knowledge-name">Pricing & Plans</div>
              <div class="knowledge-meta">12 pages · Synced 3d ago</div>
            </div>
            <div class="knowledge-actions">
              <span class="badge badge-success">Active</span>
              <button class="btn btn-sm">Preview</button>
              <button class="btn btn-sm btn-ghost" style="color:var(--warning)">⚠ Stale</button>
            </div>
          </div>
        </div>

        <!-- Add source -->
        <div class="card" style="background:var(--surface2);border-style:dashed">
          <div style="font-size:12px;font-weight:600;margin-bottom:10px">Connect a new source</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm">📄 Upload PDF / Doc</button>
            <button class="btn btn-sm">🌐 Scrape website</button>
            <button class="btn btn-sm">📝 Notion</button>
            <button class="btn btn-sm">📘 Confluence</button>
            <button class="btn btn-sm">💬 Intercom articles</button>
            <button class="btn btn-sm btn-ghost">More integrations…</button>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)">
          <button class="btn btn-primary" onclick="showScreen(6)">Next: Channels →</button>
          <button class="btn" onclick="showScreen(4)">← Back</button>
        </div>
      </div>

      <!-- Test Chat with source attribution -->
      <div class="test-chat-panel">
        <div class="test-chat-header">
          <span><div class="test-chat-live"></div> Test Chat</span>
          <button class="btn btn-sm btn-ghost" style="font-size:11px">Reset</button>
        </div>
        <div class="chat-messages">
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div><div class="chat-bubble">Hi! How can I help you today?</div></div>
          </div>
          <div class="chat-msg user">
            <div class="chat-avatar user">U</div>
            <div><div class="chat-bubble user">What's included in the Pro plan?</div></div>
          </div>
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div>
              <div class="chat-bubble">The Pro plan includes unlimited agents, 50k conversations/month, WhatsApp and email channels, and priority support. Annual billing saves 20%.</div>
              <div class="chat-meta"><span class="conf">98% confidence</span> · Pricing &amp; Plans · 290ms</div>
            </div>
          </div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" placeholder="Type a test message…">
          <button class="chat-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Differentiator</div><p>"Preview" button lets users inspect source content before enabling — builds confidence in what the bot knows</p></div>
    <div class="annotation warn"><div class="annotation-label">Staleness Alert</div><p>"Pricing & Plans — ⚠ Stale" warns users when a source hasn't synced recently — prevents outdated answers</p></div>
    <div class="annotation good"><div class="annotation-label">Test Chat</div><p>Test chat shows source attribution live — "98% confidence · Pricing & Plans" — users see exactly which source answered</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 7 — BUILDER: CHANNELS
══════════════════════ -->
<section class="screen-section" id="s6">
  <div class="screen-label">
    <div class="screen-label-num">Screen 7</div>
    <div>
      <h2>Builder — Channels</h2>
      <p>Where the chatbot is deployed. Web chat is the default. WhatsApp, Email, and Slack can be connected. Each channel shows embed code or connection status. Fixes Pain #8 (channel gaps).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/channels</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot</span>
        <span class="badge badge-neutral">Draft</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm">Save Draft</button>
        <button class="btn btn-sm btn-primary" onclick="showScreen(7)">Deploy →</button>
      </div>
    </div>

    <div class="builder-layout">
      <div class="builder-nav">
        <div class="builder-nav-item" onclick="showScreen(2)"><span class="nav-icon">👤</span> Identity <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(3)"><span class="nav-icon">🧠</span> Behaviour <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(4)"><span class="nav-icon">⚡</span> Actions <span class="nav-check">✓</span></div>
        <div class="builder-nav-item" onclick="showScreen(5)"><span class="nav-icon">📚</span> Knowledge <span class="nav-check">✓</span></div>
        <div class="builder-nav-item active" onclick="showScreen(6)"><span class="nav-icon">📡</span> Channels</div>
        <div style="margin-top:auto;padding:10px;background:var(--surface);border-radius:var(--r);border:1px solid var(--border)">
          <div style="font-size:10px;color:var(--text2);margin-bottom:5px">Setup progress</div>
          <div class="progress-bar"><div class="progress-fill" style="width:100%"></div></div>
          <div style="font-size:10px;color:var(--success);margin-top:4px">✓ Ready to deploy</div>
        </div>
      </div>

      <div class="builder-content">
        <div class="section-head">
          <div class="section-icon" style="background:var(--teal-light)">📡</div>
          <h3>Channels</h3>
        </div>

        <p style="font-size:12px;color:var(--text2);margin-bottom:16px">Deploy your chatbot across multiple channels. Each channel shares the same knowledge and behaviour settings.</p>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">

          <!-- Web chat — active -->
          <div class="channel-card" style="border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-light)">
            <div class="channel-icon" style="background:#eff6ff">🌐</div>
            <div class="channel-info">
              <div class="channel-name">Web chat widget</div>
              <div class="channel-desc">Embed on your website with one line of code</div>
            </div>
            <span class="badge badge-success">Live</span>
            <button class="btn btn-sm" style="margin-left:8px">Embed code</button>
          </div>

          <!-- WhatsApp -->
          <div class="channel-card">
            <div class="channel-icon" style="background:#f0fdf4">📱</div>
            <div class="channel-info">
              <div class="channel-name">WhatsApp</div>
              <div class="channel-desc">Requires WhatsApp Business API — takes ~10 min to connect</div>
            </div>
            <span class="badge badge-neutral">Not connected</span>
            <button class="btn btn-sm btn-primary" style="margin-left:8px">Connect</button>
          </div>

          <!-- Email -->
          <div class="channel-card">
            <div class="channel-icon" style="background:#fffbeb">📧</div>
            <div class="channel-info">
              <div class="channel-name">Email</div>
              <div class="channel-desc">Reply to inbound support emails automatically</div>
            </div>
            <span class="badge badge-neutral">Not connected</span>
            <button class="btn btn-sm btn-primary" style="margin-left:8px">Connect</button>
          </div>

          <!-- Slack -->
          <div class="channel-card">
            <div class="channel-icon" style="background:#f5f3ff">💬</div>
            <div class="channel-info">
              <div class="channel-name">Slack</div>
              <div class="channel-desc">Deploy as a Slack bot in your workspace</div>
            </div>
            <span class="badge badge-neutral">Not connected</span>
            <button class="btn btn-sm btn-primary" style="margin-left:8px">Connect</button>
          </div>
        </div>

        <!-- Embed code snippet -->
        <div style="margin-bottom:16px">
          <div style="font-size:12px;font-weight:500;margin-bottom:8px">Web widget embed code</div>
          <div class="code-block">
            <span class="cm">// Paste this before &lt;/body&gt;</span><br>
            <span class="ck">&lt;script</span> <span class="cv">src</span>=<span class="cs">"https://cdn.yourproduct.com/widget.js"</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="cv">data-agent-id</span>=<span class="cs">"agt_8f2k9x"</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="cv">data-theme</span>=<span class="cs">"auto"</span><span class="ck">&gt;&lt;/script&gt;</span>
          </div>
          <button class="btn btn-sm" style="margin-top:8px">Copy code</button>
        </div>

        <div style="display:flex;gap:10px;padding-top:16px;border-top:1px solid var(--border)">
          <button class="btn btn-primary" onclick="showScreen(7)">Review & Deploy →</button>
          <button class="btn" onclick="showScreen(5)">← Back</button>
        </div>
      </div>

      <!-- Test Chat -->
      <div class="test-chat-panel">
        <div class="test-chat-header">
          <span><div class="test-chat-live"></div> Test Chat</span>
          <select style="font-size:11px;border:1px solid var(--border);border-radius:var(--r);padding:2px 6px;background:var(--surface);color:var(--text);cursor:pointer">
            <option>Simulate: Web</option>
            <option>Simulate: WhatsApp</option>
            <option>Simulate: Email</option>
          </select>
        </div>
        <div class="chat-messages">
          <div class="chat-msg">
            <div class="chat-avatar">💬</div>
            <div><div class="chat-bubble">Hi! How can I help you today?</div></div>
          </div>
        </div>
        <div class="chat-input-row">
          <input class="chat-input" placeholder="Simulate a channel message…">
          <button class="chat-send"><svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg></button>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Pain #8 Fix</div><p>WhatsApp, Email, Slack channels available — competitor only shows web chat by default</p></div>
    <div class="annotation"><div class="annotation-label">Embed Code</div><p>One-line embed shown inline — no hunting through docs to find the snippet</p></div>
    <div class="annotation good"><div class="annotation-label">Channel Sim</div><p>Test chat has a channel simulator dropdown — test WhatsApp formatting before deploying there</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 8 — PUBLISH / DEPLOY
══════════════════════ -->
<section class="screen-section" id="s7">
  <div class="screen-label">
    <div class="screen-label-num">Screen 8</div>
    <div>
      <h2>Publish — Pre-deploy Review</h2>
      <p>Final review before going live. Shows a checklist of everything configured, any warnings, and a final test prompt. "Deploy" is never a surprise. Fixes Pain #6 (no guidance on what deploy means).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/new/deploy</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Customer Support Bot — Ready to Deploy</span>
      </div>
    </div>

    <div style="max-width:740px;margin:0 auto;padding:32px 24px;background:var(--bg)">

      <div style="text-align:center;margin-bottom:28px">
        <div style="font-size:36px;margin-bottom:8px">🚀</div>
        <h2 style="font-size:22px;font-weight:700;letter-spacing:-0.03em;margin-bottom:4px">Ready to go live</h2>
        <p style="color:var(--text2);font-size:13px">Review your configuration below, then deploy.</p>
      </div>

      <!-- Checklist -->
      <div class="card" style="margin-bottom:16px">
        <div style="font-size:13px;font-weight:600;margin-bottom:14px">Configuration summary</div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="deploy-step">
            <div class="deploy-step-num done">✓</div>
            <div><h4>Identity</h4><p>Bot name: "Support Assistant" · Tone: Professional · English</p></div>
          </div>
          <div class="deploy-step">
            <div class="deploy-step-num done">✓</div>
            <div><h4>Behaviour</h4><p>System prompt set · Response style: Precise · Fallback: Handoff to human</p></div>
          </div>
          <div class="deploy-step">
            <div class="deploy-step-num done">✓</div>
            <div><h4>Actions</h4><p>3 actions enabled: Process Refund (approval req.), Book Meeting, Create Ticket</p></div>
          </div>
          <div class="deploy-step">
            <div class="deploy-step-num done">✓</div>
            <div><h4>Knowledge</h4><p>3 sources active: Product Docs (142 art.), FAQ Database (89), Pricing (12)</p></div>
          </div>
          <div class="deploy-step">
            <div class="deploy-step-num done">✓</div>
            <div><h4>Channels</h4><p>Web chat widget · Embed code ready</p></div>
          </div>
        </div>
      </div>

      <!-- Warnings -->
      <div class="callout callout-warning" style="margin-bottom:16px">
        <span class="callout-icon">⚠</span>
        <div>
          <strong style="font-weight:600">Pricing & Plans source is stale</strong> (last synced 3 days ago). The bot may give outdated pricing information. <a href="#" style="color:var(--warning);text-decoration:underline">Sync now</a> before deploying.
        </div>
      </div>

      <!-- Final test prompt -->
      <div class="card" style="margin-bottom:20px">
        <div style="font-size:12px;font-weight:600;margin-bottom:10px">Quick test before you deploy</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm">Try: "What's in the Pro plan?"</button>
          <button class="btn btn-sm">Try: "I need a refund"</button>
          <button class="btn btn-sm">Try: "Book a call with sales"</button>
        </div>
      </div>

      <div style="display:flex;gap:10px;justify-content:center">
        <button class="btn btn-primary" style="padding:10px 32px;font-size:14px" onclick="showScreen(8)">🚀 Deploy now</button>
        <button class="btn" onclick="showScreen(5)">← Edit knowledge</button>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Trust</div><p>Checklist shows everything configured before deploying — no surprises, no "what does deploy mean?"</p></div>
    <div class="annotation warn"><div class="annotation-label">Stale Warning</div><p>Stale knowledge source flagged at deploy time — prevents shipping a bot with outdated pricing info</p></div>
    <div class="annotation good"><div class="annotation-label">Quick Test</div><p>One-click test prompts let users do a final sanity check right at the deploy screen</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 9 — ANALYTICS
══════════════════════ -->
<section class="screen-section" id="s8">
  <div class="screen-label">
    <div class="screen-label-num">Screen 9</div>
    <div>
      <h2>Analytics — Agent Performance</h2>
      <p>Post-deploy. Shows conversation volume, resolution rate trend, top intents, unresolved gaps, and CSAT. Every chart links to action. Fixes Pain #9 (shallow analytics).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/agents/support-bot/analytics</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Support Assistant — Analytics</span>
        <span class="badge badge-success">Live</span>
      </div>
      <div class="app-topbar-right">
        <select class="form-input form-select" style="width:auto;font-size:12px;padding:5px 28px 5px 10px">
          <option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
        </select>
        <button class="btn btn-sm" onclick="showScreen(2)">Edit agent</button>
      </div>
    </div>

    <div style="padding:20px 24px;background:var(--bg)">
      <!-- Metric row -->
      <div class="dashboard-grid" style="margin-bottom:16px">
        <div class="metric-card">
          <div class="metric-label">Conversations</div>
          <div class="metric-value">9,420</div>
          <div class="metric-trend up">↑ 14%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Resolution rate</div>
          <div class="metric-value" style="color:var(--success)">82%</div>
          <div class="metric-trend up">↑ 3%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Avg CSAT</div>
          <div class="metric-value">4.6<span style="font-size:14px;color:var(--text2)"> / 5</span></div>
          <div class="metric-trend flat">No change</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Human handoffs</div>
          <div class="metric-value" style="color:var(--warning)">8.2%</div>
          <div class="metric-trend down">↑ 2% — review</div>
        </div>
      </div>

      <div class="analytics-grid">
        <!-- Volume chart -->
        <div class="card">
          <div style="font-size:12px;font-weight:600;margin-bottom:14px">Conversations per day</div>
          <div class="mini-bar-chart">
            <div class="mini-bar" style="height:35%"></div>
            <div class="mini-bar" style="height:50%"></div>
            <div class="mini-bar" style="height:45%"></div>
            <div class="mini-bar" style="height:70%"></div>
            <div class="mini-bar" style="height:60%"></div>
            <div class="mini-bar hi" style="height:85%"></div>
            <div class="mini-bar hi" style="height:90%"></div>
            <div class="mini-bar hi" style="height:75%"></div>
            <div class="mini-bar hi" style="height:95%"></div>
            <div class="mini-bar hi" style="height:80%"></div>
            <div class="mini-bar hi" style="height:100%"></div>
            <div class="mini-bar hi" style="height:88%"></div>
            <div class="mini-bar hi" style="height:92%"></div>
            <div class="mini-bar hi" style="height:78%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-top:6px">
            <span>7 days ago</span><span>Today</span>
          </div>
        </div>

        <!-- Top intents -->
        <div class="card">
          <div style="font-size:12px;font-weight:600;margin-bottom:14px">Top intents</div>
          <div class="intent-row">
            <span class="intent-label">Order tracking</span>
            <div class="intent-bar-wrap"><div class="intent-fill" style="width:82%;background:var(--accent)"></div></div>
            <span class="intent-pct">82%</span>
          </div>
          <div class="intent-row">
            <span class="intent-label">Pricing questions</span>
            <div class="intent-bar-wrap"><div class="intent-fill" style="width:61%;background:var(--accent)"></div></div>
            <span class="intent-pct">61%</span>
          </div>
          <div class="intent-row">
            <span class="intent-label">Refund request</span>
            <div class="intent-bar-wrap"><div class="intent-fill" style="width:48%;background:var(--warning)"></div></div>
            <span class="intent-pct">48%</span>
          </div>
          <div class="intent-row" style="margin-bottom:0">
            <span class="intent-label">Billing question</span>
            <div class="intent-bar-wrap"><div class="intent-fill" style="width:28%;background:var(--warning)"></div></div>
            <span class="intent-pct">28%</span>
          </div>
        </div>

        <!-- Unresolved gaps -->
        <div class="card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
            <div style="font-size:12px;font-weight:600">Knowledge gaps (unresolved)</div>
            <button class="btn btn-sm" onclick="showScreen(5)">Fix →</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--danger-light);border-radius:var(--r);font-size:12px">
              <span>"Cancel my subscription"</span>
              <span style="color:var(--danger);font-weight:500">68 times</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--warning-light);border-radius:var(--r);font-size:12px">
              <span>"How to export data?"</span>
              <span style="color:var(--warning);font-weight:500">41 times</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 10px;background:var(--warning-light);border-radius:var(--r);font-size:12px">
              <span>"Do you have an API?"</span>
              <span style="color:var(--warning);font-weight:500">29 times</span>
            </div>
          </div>
        </div>

        <!-- CSAT -->
        <div class="card">
          <div style="font-size:12px;font-weight:600;margin-bottom:14px">CSAT breakdown</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:16px">★5</span>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="width:60%;height:100%;background:var(--success)"></div></div>
              <span style="color:var(--text2)">60%</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:16px">★4</span>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="width:24%;height:100%;background:var(--success)"></div></div>
              <span style="color:var(--text2)">24%</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:16px">★3</span>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="width:9%;height:100%;background:var(--warning)"></div></div>
              <span style="color:var(--text2)">9%</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:16px">★2</span>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="width:5%;height:100%;background:var(--danger)"></div></div>
              <span style="color:var(--text2)">5%</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;font-size:12px">
              <span style="width:16px">★1</span>
              <div style="flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden"><div style="width:2%;height:100%;background:var(--danger)"></div></div>
              <span style="color:var(--text2)">2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Pain #9 Fix</div><p>"Knowledge gaps" panel shows exact questions the bot failed to answer — actionable data, not just stats</p></div>
    <div class="annotation"><div class="annotation-label">Closed Loop</div><p>Every gap links to "Fix →" which opens the builder's Knowledge section — analytics create action, not reports</p></div>
    <div class="annotation good"><div class="annotation-label">CSAT</div><p>CSAT breakdown is per-rating, not just an average — tells you whether 1-star ratings are a real problem</p></div>
  </div>
</section>

<!-- ══════════════════════
     SCREEN 10 — HUMAN HANDOFF INBOX
══════════════════════ -->
<section class="screen-section" id="s9">
  <div class="screen-label">
    <div class="screen-label-num">Screen 10</div>
    <div>
      <h2>Human Handoff Inbox</h2>
      <p>When the bot escalates, a human agent picks up the conversation here — with full context of what the bot already tried. Fixes Pain #6 (weak live-chat management) and Pain #3 (support quality).</p>
    </div>
  </div>

  <div class="browser-chrome">
    <div class="chrome-bar">
      <div class="chrome-dots"><div class="chrome-dot r"></div><div class="chrome-dot y"></div><div class="chrome-dot g"></div></div>
      <div class="chrome-url">app.yourproduct.com/inbox</div>
    </div>
    <div class="app-topbar">
      <div class="app-topbar-left">
        <div class="app-logo">agent<span>hub</span></div>
        <span style="color:var(--border-strong);font-size:16px">|</span>
        <span style="font-size:13px;font-weight:500">Handoff Inbox</span>
        <span class="badge badge-danger" style="animation:pulse 2s infinite">3 waiting</span>
      </div>
      <div class="app-topbar-right">
        <button class="btn btn-sm btn-ghost">All agents</button>
        <button class="btn btn-sm btn-ghost">My assigned</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:260px 1fr 260px;height:480px">

      <!-- Conversation list -->
      <div style="border-right:1px solid var(--border);overflow-y:auto">
        <div style="padding:10px 14px;border-bottom:1px solid var(--border);background:var(--surface2)">
          <input class="form-input" placeholder="Search conversations…" style="font-size:12px;padding:6px 10px">
        </div>

        <div class="conversation-item" style="background:var(--accent-light)">
          <div class="conv-avatar">SR</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:baseline;gap:6px">
              <span class="conv-name">Sarah R.</span>
              <span class="badge badge-danger" style="font-size:9px">Urgent</span>
            </div>
            <div class="conv-preview">I've been waiting 20 minutes for my refund…</div>
          </div>
          <span class="conv-time">2m</span>
        </div>

        <div class="conversation-item">
          <div class="conv-avatar" style="background:var(--teal-light);color:var(--teal)">MK</div>
          <div style="flex:1;min-width:0">
            <div class="conv-name">Marcus K.</div>
            <div class="conv-preview">The bot couldn't find my order number</div>
          </div>
          <span class="conv-time">8m</span>
        </div>

        <div class="conversation-item">
          <div class="conv-avatar" style="background:var(--purple-light);color:var(--purple)">JL</div>
          <div style="flex:1;min-width:0">
            <div class="conv-name">Julia L.</div>
            <div class="conv-preview">Cancel subscription — needs manager approval</div>
          </div>
          <span class="conv-time">15m</span>
        </div>

        <div class="conversation-item" style="opacity:0.6">
          <div class="conv-avatar" style="background:var(--surface2);color:var(--text2)">AT</div>
          <div style="flex:1;min-width:0">
            <div class="conv-name">Alex T.</div>
            <div class="conv-preview">Resolved — billing question answered</div>
          </div>
          <span class="conv-time">1h</span>
        </div>
      </div>

      <!-- Active conversation -->
      <div style="display:flex;flex-direction:column;background:var(--surface)">
        <div style="padding:12px 16px;border-bottom:1px solid var(--border);background:var(--surface2);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div class="conv-avatar">SR</div>
            <div>
              <div style="font-size:13px;font-weight:500">Sarah R.</div>
              <div style="font-size:11px;color:var(--text2)">Handed off from Support Bot · 2 min ago</div>
            </div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-success">Resolve</button>
            <button class="btn btn-sm">Assign</button>
          </div>
        </div>

        <!-- Bot messages first -->
        <div style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px">
          <div style="text-align:center;font-size:10px;color:var(--text3);padding:6px 0;display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:1px;background:var(--border)"></div>
            <span>Bot conversation — handed off</span>
            <div style="flex:1;height:1px;background:var(--border)"></div>
          </div>

          <div class="chat-msg">
            <div class="chat-avatar" style="background:var(--accent-light);font-size:11px">🤖</div>
            <div>
              <div class="chat-bubble" style="background:var(--accent-light)">Hi! How can I help you today?</div>
              <div class="chat-meta">Bot · 10:41am</div>
            </div>
          </div>
          <div class="chat-msg user">
            <div class="chat-avatar user">SR</div>
            <div><div class="chat-bubble user">I was charged twice and it's been 20 minutes with no response</div></div>
          </div>
          <div class="chat-msg">
            <div class="chat-avatar" style="background:var(--accent-light);font-size:11px">🤖</div>
            <div>
              <div class="chat-bubble" style="background:var(--accent-light)">I can see two charges on your account. I attempted to process a refund but it requires human approval. Connecting you now.</div>
              <div class="chat-meta">Bot · attempted "Process Refund" — approval required</div>
            </div>
          </div>

          <div style="text-align:center;font-size:10px;color:var(--text3);padding:6px 0;display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:1px;background:var(--border)"></div>
            <span style="background:var(--warning-light);color:var(--warning);padding:2px 8px;border-radius:10px">You joined</span>
            <div style="flex:1;height:1px;background:var(--border)"></div>
          </div>

          <div class="chat-msg">
            <div class="chat-avatar" style="background:var(--success-light);color:var(--success);font-size:10px;font-weight:700">ME</div>
            <div><div class="chat-bubble" style="background:var(--success-light)">Hi Sarah, I'm reviewing your account now. I'll approve the refund right away — sorry for the wait.</div></div>
          </div>
        </div>

        <!-- Reply box -->
        <div style="padding:10px 14px;border-top:1px solid var(--border);background:var(--surface2)">
          <textarea class="form-input form-textarea" rows="2" style="width:100%;margin-bottom:8px" placeholder="Reply to Sarah…"></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-success">Approve refund ($29.99)</button>
              <button class="btn btn-sm">Use canned reply</button>
            </div>
            <button class="btn btn-sm btn-primary">Send →</button>
          </div>
        </div>
      </div>

      <!-- Context panel -->
      <div style="border-left:1px solid var(--border);padding:14px;overflow-y:auto;background:var(--surface2)">
        <div style="font-size:12px;font-weight:600;margin-bottom:12px">Context</div>

        <div style="margin-bottom:14px">
          <div class="form-label">Customer</div>
          <div style="font-size:13px;font-weight:500">Sarah Rodriguez</div>
          <div style="font-size:11px;color:var(--text2)">sarah@example.com</div>
          <div style="font-size:11px;color:var(--text2)">Pro plan · Member since Jan 2023</div>
        </div>

        <div class="divider" style="margin:10px 0"></div>

        <div style="margin-bottom:12px">
          <div class="form-label">Bot summary</div>
          <div style="font-size:12px;line-height:1.5;color:var(--text)">User reported a duplicate charge of $29.99 on October 15th. Bot found two charges and attempted to issue a refund but was blocked by the "Requires Approval" guard.</div>
        </div>

        <div class="divider" style="margin:10px 0"></div>

        <div style="margin-bottom:12px">
          <div class="form-label">Suggested actions</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-sm btn-success" style="justify-content:flex-start">✓ Approve refund $29.99</button>
            <button class="btn btn-sm" style="justify-content:flex-start">Create Zendesk ticket</button>
            <button class="btn btn-sm btn-danger" style="justify-content:flex-start">Escalate to manager</button>
          </div>
        </div>

        <div class="divider" style="margin:10px 0"></div>

        <div>
          <div class="form-label">Charge history</div>
          <div style="font-size:11px;color:var(--text);display:flex;flex-direction:column;gap:4px">
            <div style="display:flex;justify-content:space-between"><span>Oct 15 — Pro plan</span><span style="color:var(--danger)">$29.99</span></div>
            <div style="display:flex;justify-content:space-between"><span>Oct 15 — Pro plan</span><span style="color:var(--danger)">$29.99</span></div>
            <div style="display:flex;justify-content:space-between"><span>Sep 15 — Pro plan</span><span style="color:var(--text2)">$29.99</span></div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="annotations">
    <div class="annotation good"><div class="annotation-label">Pain #6 Fix</div><p>Full bot conversation transcript shown to human agent — no context lost at handoff</p></div>
    <div class="annotation good"><div class="annotation-label">Bot Summary</div><p>AI-generated summary of what the bot tried and why it failed — agent doesn't need to re-read everything</p></div>
    <div class="annotation"><div class="annotation-label">Approve Actions</div><p>"Approve refund $29.99" button pre-populated from bot's attempted action — one click, not re-entry</p></div>
    <div class="annotation good"><div class="annotation-label">Pain #3 Fix</div><p>Human agent has charge history in the sidebar — answers Sarah's question before she has to repeat herself</p></div>
  </div>
</section>

</main>

<!-- ══════════════════════
     JS
══════════════════════ -->
<script>
function showScreen(index) {
  document.querySelectorAll('.screen-section').forEach((s,i) => {
    s.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.screen-tab').forEach((t,i) => {
    t.classList.toggle('active', i === index);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Template picker: click to populate preview panel, then launch straight into builder ──
function selectTplAndPreview(el, name, icon, bg, prompt, actions, knowledge) {
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');

  document.getElementById('tpl-preview-empty').style.display = 'none';
  const content = document.getElementById('tpl-preview-content');
  content.style.display = 'flex';

  const iconEl = document.getElementById('prev-icon');
  iconEl.textContent = icon;
  iconEl.style.background = bg;
  document.getElementById('prev-name').textContent = name;
  document.getElementById('prev-identity-name').textContent = name;

  const promptEl = document.getElementById('prev-prompt');
  promptEl.textContent = prompt ? (prompt.length > 95 ? prompt.slice(0,95)+'…' : prompt) : '(blank — you write this)';
  promptEl.style.opacity = prompt ? '1' : '0.5';

  const actionsEl = document.getElementById('prev-actions');
  actionsEl.textContent = actions || 'None pre-enabled';
  actionsEl.style.opacity = actions ? '1' : '0.5';

  const knowledgeEl = document.getElementById('prev-knowledge');
  knowledgeEl.textContent = knowledge || 'No sources connected';
  knowledgeEl.style.opacity = knowledge ? '1' : '0.5';

  document.getElementById('tpl-launch-btn').textContent =
    (name === 'Blank Agent') ? 'Start from scratch →' : 'Use "' + name + '" →';
}

function launchBuilder() {
  showScreen(2); // Drops straight into Identity (builder), which shows pre-filled banner
}

function filterTpl(cat, btn) {
  document.querySelectorAll('#tpl-filter-row button').forEach(b => {
    b.style.background = 'transparent'; b.style.color = 'var(--text2)'; b.style.borderColor = 'transparent';
  });
  btn.style.background = 'var(--accent-light)'; btn.style.color = 'var(--accent-text)'; btn.style.borderColor = 'transparent';
  document.querySelectorAll('.template-card').forEach(card => {
    const c = card.dataset.cat;
    card.style.display = (cat === 'all' || !c || c === cat) ? '' : 'none';
  });
}

// Legacy aliases
function filterTemplates(cat, btn) { filterTpl(cat, btn); }
function selectTemplate(el, name) { selectTplAndPreview(el, name, '💬', '#eff6ff', '', '', ''); }

function selectTone(btn) {
  btn.closest('div').querySelectorAll('button').forEach(b => {
    b.style.background = 'transparent'; b.style.color = 'var(--text)'; b.style.borderColor = 'var(--border-strong)';
  });
  btn.style.background = 'var(--accent-light)'; btn.style.color = 'var(--accent-text)'; btn.style.borderColor = 'transparent';
}
</script>
</body>
</html>
