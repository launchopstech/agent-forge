# AG-UI Protocol Integration Spec

**Status:** Research / Decision Record
**Date:** 2026-04-28
**Scope:** agent-forge, forge-core, forge-core-ai

---

## 1. Overview & Motivation

The 2025-2026 agentic AI landscape has converged on a set of open protocols for agent communication. This spec evaluates CopilotKit, the AG-UI Protocol, and related technologies, and decides what agent-forge should adopt, defer, or skip.

Today, `@forge/ai-ui` components are wired to **Vercel AI SDK types** (`UIMessage`, `ToolUIPart`, `FileUIPart`). This works for simple chat but has no standardized way to handle:

- Real-time tool call streaming with lifecycle events
- Shared state between agent and frontend
- Human-in-the-loop approval flows
- Sub-agent composition and reasoning visibility

The AG-UI Protocol solves exactly this. Adopting it positions agent-forge as compatible with the emerging standard across all major agent frameworks.

---

## 2. Technology Landscape

### 2.1 AG-UI Protocol

**What it is:** An open, event-based streaming protocol that standardizes bi-directional communication between AI agent backends and frontend applications.

- **MIT License** — open standard
- Created by CopilotKit + LangGraph + CrewAI; adopted by Google (ADK), AWS (Bedrock AgentCore, Strands), Microsoft Agent Framework, AG2, LlamaIndex, Mastra, Pydantic AI
- SDKs available in: Python, TypeScript, Go, Rust, Kotlin, Dart, Java, Ruby
- **This is the pipe** — not a UI framework

**Transport:** SSE (primary) or WebSocket

**Event categories (~17 events total):**

| Category     | Events                                                                      |
| ------------ | --------------------------------------------------------------------------- |
| Lifecycle    | `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`, `STEP_STARTED`, `STEP_FINISHED` |
| Text message | `TEXT_MESSAGE_START`, `TEXT_MESSAGE_CONTENT`, `TEXT_MESSAGE_END`            |
| Tool call    | `TOOL_CALL_START`, `TOOL_CALL_ARGS`, `TOOL_CALL_END`, `TOOL_CALL_RESULT`    |
| State        | `STATE_SNAPSHOT`, `STATE_DELTA` (RFC 6902 JSON Patch)                       |
| Reasoning    | Streaming chain-of-thought, optionally encrypted                            |
| Custom       | `CUSTOM` — extensibility escape hatch                                       |

**Example event shape:**

```json
{
  "type": "TEXT_MESSAGE_CONTENT",
  "timestamp": "2026-04-28T12:00:00Z",
  "messageId": "msg-123",
  "content": "Here is what I found..."
}
```

### 2.2 CopilotKit

**What it is:** A React/Next.js SDK (MIT, ~30.5k GitHub stars) that implements AG-UI on the frontend, plus a server-side runtime that bridges to agent backends.

**Key pieces:**

| Package                  | Role                                                             |
| ------------------------ | ---------------------------------------------------------------- |
| `@copilotkit/react-core` | `useAgent` (v2) hook — consumes AG-UI event streams              |
| `@copilotkit/runtime`    | Server-side bridge: NestJS/FastAPI → LangGraph → AG-UI events    |
| CopilotKit UI components | `CopilotChat`, `CopilotPopup`, `CopilotSidebar` — opinionated UI |

**Key hooks (v2 API):**

- `useAgent` — connects to any AG-UI endpoint; exposes messages, state, tool calls, streaming tokens
- `useComponent` — renders a named tool call with Zod-typed args
- `useCopilotAction` — registers executable actions the agent can invoke
- `useCopilotReadable` — pushes readable context from components into the agent

**Risk:** CopilotKit's UI components (`CopilotChat`, etc.) directly duplicate `@forge/ai-ui`. Installing them wholesale would create a conflict.

### 2.3 AG2UI

**What it is:** AG2's (formerly AutoGen) backend adapter for the AG-UI protocol.

```python
from ag2 import ConversableAgent, AGUIStream

agent = ConversableAgent(name="MyAgent", ...)
ag_ui_stream = AGUIStream(agent)  # wraps agent → emits AG-UI events over SSE
```

**Verdict for agent-forge:** **Not relevant.** forge-core-ai uses LangGraph, not AG2/AutoGen. If the agent framework ever switches to AG2, this becomes the relevant integration layer.

### 2.4 A2UI (Google)

**What it is:** A **declarative JSON UI specification** protocol — agents output JSON describing what UI components to render, rather than raw HTML/JS.

- **AG-UI = the pipe** (how agent and frontend communicate)
- **A2UI = the content** (what the agent says to render inside that pipe)

They are complementary. A2UI payloads travel as `CUSTOM` events over AG-UI. CopilotKit is a Google launch partner and has first-class A2UI support.

**Verdict for agent-forge:** **Defer to Phase 2.** Useful when agents need to dynamically generate rich UIs (forms, dashboards, cards), but not needed for Phase 1 chat + tool streaming.

---

## 3. Architecture Fit

```
┌────────────────────────────────────────────────────────┐
│  agent-forge  (Next.js 16 / React 19)                  │
│                                                        │
│  @forge/ai-ui components (Conversation, Message,       │
│  Tool, Reasoning, Plan, Confirmation, ...)             │
│       ↑ consume AG-UI events                           │
│  useAgent hook (@copilotkit/react-core v2)             │
└───────────────────────┬────────────────────────────────┘
                        │  SSE / AG-UI protocol
                        │  (Content-Type: text/event-stream)
┌───────────────────────▼────────────────────────────────┐
│  forge-core  (NestJS 10)                               │
│                                                        │
│  /agents/:id/stream  endpoint                          │
│  @copilotkit/runtime  ← bridges auth, multi-tenancy    │
│  SSE passthrough with PlatformContext injected         │
└───────────────────────┬────────────────────────────────┘
                        │  internal HTTP/SSE
┌───────────────────────▼────────────────────────────────┐
│  forge-core-ai  (FastAPI + LangGraph)                  │
│                                                        │
│  LangGraph graph → LangGraph AG-UI adapter             │
│  (copilotkit_langgraph or ag-ui Python SDK)            │
│  emits AG-UI events per run                            │
└────────────────────────────────────────────────────────┘
```

**Multi-tenancy:** `PlatformContext` (tenant + workspace IDs) is injected at forge-core and forwarded as headers to forge-core-ai. AG-UI event streams are scoped per agent run.

---

## 4. Adopt / Defer / Skip Decisions

| Item                                               | Decision | Rationale                                                                 |
| -------------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| **AG-UI Protocol** (event types + SSE transport)   | ✅ Adopt | Industry standard; LangGraph and FastAPI have first-class support         |
| **`@copilotkit/runtime`** (NestJS/FastAPI bridge)  | ✅ Adopt | Gets LangGraph→AG-UI plumbing for free; saves ~2 weeks of custom SSE work |
| **`useAgent` hook** (`@copilotkit/react-core` v2)  | ✅ Adopt | Protocol-level hook only; does not bring UI components                    |
| **CopilotKit UI components** (`CopilotChat`, etc.) | ❌ Skip  | Duplicates `@forge/ai-ui`; would create dependency conflicts              |
| **AG2UI** (AG2/AutoGen adapter)                    | ❌ Skip  | forge-core-ai uses LangGraph, not AG2                                     |
| **A2UI declarative UI spec**                       | ⏳ Defer | Valuable for dynamic agent-generated UIs; not needed in Phase 1           |

---

## 5. Implementation Phases

### Phase 1 — forge-core-ai: LangGraph AG-UI Emitter

**Goal:** forge-core-ai emits standard AG-UI events for every agent run.

**Steps:**

1. Install `copilotkit` Python package in forge-core-ai (`uv add copilotkit`)
2. Wrap LangGraph graph with `LangGraphAdapter` from `copilotkit.langchain`
3. Add `/agents/{agent_id}/stream` FastAPI endpoint that returns `StreamingResponse` over SSE
4. Emit: `RUN_STARTED`, `TEXT_MESSAGE_*`, `TOOL_CALL_*`, `STATE_SNAPSHOT`, `RUN_FINISHED`

```python
# forge-core-ai/src/forge_core/routes/agent_stream.py
from copilotkit.langchain import LangGraphAdapter
from fastapi.responses import StreamingResponse

adapter = LangGraphAdapter(graph=my_langgraph_graph)

@router.post("/agents/{agent_id}/stream")
async def stream_agent(agent_id: str, request: RunRequest):
    return StreamingResponse(
        adapter.astream(request),
        media_type="text/event-stream",
    )
```

**No changes to existing endpoints** — this is an additive endpoint.

---

### Phase 2 — forge-core: SSE Passthrough + CopilotKit Runtime

**Goal:** forge-core proxies AG-UI SSE stream from forge-core-ai with auth and PlatformContext injected.

**Steps:**

1. Install `@copilotkit/runtime` in forge-core (`pnpm add @copilotkit/runtime`)
2. Add `AgentStreamModule` with `POST /agents/:id/stream` endpoint
3. Validate Bearer token via existing `LambdaAuthorizer`
4. Forward `X-Platform-Context` header to forge-core-ai
5. Pipe SSE response through with correct `Content-Type: text/event-stream` headers

**Key constraint:** Respect `PlatformContext` — every stream is scoped to a tenant/workspace. Never mix streams across tenants.

---

### Phase 3 — agent-forge: AG-UI Consumer in `@forge/ai-ui`

**Goal:** `@forge/ai-ui` components consume AG-UI event streams natively via `useAgent`.

**Steps:**

1. Install `@copilotkit/react-core` in `packages/ai-ui` (`pnpm add @copilotkit/react-core`)
2. Create `useAgentStream` hook in `packages/ai-ui/src/hooks/use-agent-stream.ts`
   - Wraps `useAgent` (v2 API)
   - Maps AG-UI event types to existing `@forge/ai-ui` component props
3. Update `Conversation` + `Message` to accept AG-UI `messages` array alongside existing Vercel AI SDK types
4. Update `Tool` component to handle `TOOL_CALL_START/ARGS/END/RESULT` lifecycle
5. Update `Reasoning` to handle streaming reasoning events
6. Update `Confirmation` to wire to human-in-the-loop interrupt events

**Migration:** Keep Vercel AI SDK type support as-is (backwards compatible). AG-UI becomes the new preferred path. Existing consumers do not break.

---

### Phase 4 (Deferred) — A2UI Declarative UI Rendering

**Goal:** Agents can emit JSON-described UI components that render as rich cards, forms, and dashboards inside the chat.

**Trigger:** When product needs agent-generated dynamic UI (e.g., an agent presenting a booking form, a data dashboard, or a structured approval card).

**Implementation:** Handle `CUSTOM` AG-UI events with `type: "A2UI"` payload; render via a new `@forge/ai-ui` `<AgentUI>` component that maps A2UI component specs to `@forge/ui` primitives.

---

## 6. Migration Path (Vercel AI SDK → AG-UI)

The existing Vercel AI SDK types remain valid for the simple chat use case. AG-UI is the upgrade path for agentic (multi-step, tool-using) flows.

| Feature           | Today (Vercel AI SDK)    | After (AG-UI)                                 |
| ----------------- | ------------------------ | --------------------------------------------- |
| Text streaming    | `useChat` / `UIMessage`  | `TEXT_MESSAGE_CONTENT` events via `useAgent`  |
| Tool calls        | `ToolUIPart` from AI SDK | `TOOL_CALL_START/ARGS/END/RESULT` events      |
| Agent state       | Not standardized         | `STATE_SNAPSHOT` / `STATE_DELTA` events       |
| Human-in-the-loop | Not standardized         | Interrupt events → `<Confirmation>` component |
| Reasoning         | Not standardized         | Reasoning events → `<Reasoning>` component    |
| File attachments  | `FileUIPart`             | `CUSTOM` event or Vercel AI SDK layer kept    |

**No big bang migration.** Phase 3 makes `@forge/ai-ui` accept both. Features currently using Vercel AI SDK stay on it; new agentic features use AG-UI.

---

## 7. Open Questions

1. **CopilotKit runtime vs custom NestJS SSE proxy** — `@copilotkit/runtime` handles retry, backpressure, and reconnection. Is there any reason to build a custom SSE proxy instead? (Recommendation: use the runtime unless NestJS constraints prevent it)

2. **WebSocket vs SSE** — SSE is simpler and works over HTTP/2. WebSocket needed for bidirectional flow (e.g., agent asking user a question mid-run). Assess in Phase 2 whether NestJS → forge-core-ai needs WebSocket for human-in-the-loop.

3. **`useAgent` v2 API stability** — CopilotKit's v2 hooks API is labeled stable but newer than v1. Monitor for breaking changes before Phase 3.

4. **A2UI timing** — Should Phase 4 be scoped into the agent builder's output configuration? An agent that knows how to render a "booking card" vs raw text is a meaningful product differentiator.

5. **Multi-tenant stream isolation** — AG-UI streams are per-run. Confirm forge-core's SSE proxy correctly isolates streams when two tenants run agents concurrently (no event bleed-through).
