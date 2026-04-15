---
name: start
description: Start local dev servers for agent-forge, forge-core API, and forge-core auth-handler. Use when the user says "start servers", "run locally", "start all", "run frontend", "run backend", or "start dev".
argument-hint: '[frontend|backend|auth-handler|all] — defaults to all'
---

Start the requested dev servers as background processes. Working directories are under `/Users/bomatra/Developement/agentic-ai/`.

## Server definitions (from projects.json)

| Label | Dir | Command | Port | URL |
|-------|-----|---------|------|-----|
| frontend | `agent-forge` | `pnpm dev` | 3000 | http://localhost:3000 |
| backend | `forge-core` | `pnpm dev` | 3001 | http://localhost:3001 |
| auth-handler | `forge-core` | `pnpm dev:auth-handler` | 3002 | http://localhost:3002 |

## Argument handling

- No argument / `all` → start all three servers
- `frontend` → start frontend only
- `backend` → start forge-core API only
- `auth-handler` → start forge-core auth-handler only
- Multiple tokens (e.g. `frontend backend`) → start each named server

## Steps

1. **Kill any processes on the ports used by the selected servers** (run synchronously, before starting anything):
   ```bash
   lsof -ti tcp:3000 -ti tcp:3001 -ti tcp:3002 | xargs kill -9 2>/dev/null || true
   ```
   If only a subset of servers is selected, kill only those ports (e.g. `lsof -ti tcp:3000 | xargs kill -9 2>/dev/null || true` for frontend only).
   Note: macOS `lsof` requires `-ti tcp:<port>` per flag — comma-separated ports are not supported.
   Wait for this step to complete before proceeding.

2. For each server to start, run its command **in the background** using `run_in_background: true` in the Bash tool from its directory:
   - frontend: `cd /Users/bomatra/Developement/agentic-ai/agent-forge && pnpm dev`
   - backend: `cd /Users/bomatra/Developement/agentic-ai/forge-core && pnpm dev`
   - auth-handler: `cd /Users/bomatra/Developement/agentic-ai/forge-core && pnpm dev:auth-handler`

3. Launch all selected servers **in parallel** (single message, multiple Bash tool calls with `run_in_background: true`).

3. After launching, report clearly which servers were started:

```
Started dev servers:

| Server | URL | Status |
|--------|-----|--------|
| frontend (agent-forge) | http://localhost:3000 | starting… |
| backend (forge-core) | http://localhost:3001 | starting… |
| auth-handler | http://localhost:3002 | starting… |

Tip: first-time startup may take 10–20 s for Next.js compilation and NestJS bootstrap.
```

4. Do NOT wait for the servers to be ready before responding — they run in the background.
5. Do NOT run `pnpm install` — assume deps are already installed. If a server fails to start due to missing deps, tell the user to run `pnpm install` in the relevant directory.
6. Also kill the Next.js dev lock if present before starting the frontend:
   ```bash
   rm -f /Users/bomatra/Developement/agentic-ai/agent-forge/apps/web/.next/dev/lock
   ```
