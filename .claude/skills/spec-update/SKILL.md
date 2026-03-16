---
name: spec-update
description: Audit a spec file against the actual codebase and mark completed tasks with [x]. Use when the user says "mark spec done", "update spec", "tick off completed", or "mark what's done in spec".
argument-hint: '<spec-file-path>'
---

Audit the spec file and mark completed tasks. Target: `$ARGUMENTS`

## Step 1 — Read the spec

Read the target spec file (or all files in `docs/specs/` if no argument given).
Identify every `- [ ]` checkbox item and group them by phase/section.

## Step 2 — Verify each task against the codebase

For each unchecked task, verify completion by checking the actual files:

| Task type                  | How to verify                                  |
| -------------------------- | ---------------------------------------------- |
| "Create file X"            | Check if file exists                           |
| "Move X to Y"              | Check Y exists, X is gone (or re-exports)      |
| "Update import in X"       | Grep for the old import in X                   |
| "Delete file X"            | Check X does not exist                         |
| "Add config/setting"       | Read the relevant config file                  |
| "Run command / gate check" | Infer from whether dependent files are correct |

Use `Glob` and `Grep` aggressively — do not guess.

## Step 3 — Mark completed tasks

For every task confirmed done, change `- [ ]` → `- [x]`.

Add a `✅` suffix to the phase heading when **all** tasks in that phase are complete:

```
## Phase A — Scaffolding ✅
```

If a task was completed differently than described, update the task text to reflect what was actually done (keep it accurate, not aspirational).

## Step 4 — Report

Output a summary table:

| Phase   | Tasks | Done | Pending |
| ------- | ----- | ---- | ------- |
| Phase A | 7     | 7    | 0 ✅    |
| Phase B | 5     | 3    | 2       |

List any pending tasks explicitly so the user knows what's left.

## Notes

- Never mark a task done without verifying — false positives are worse than false negatives
- If a task is genuinely ambiguous (e.g. "verify X"), use your best judgement from the surrounding code
- Do not delete or reorder tasks — only change `[ ]` to `[x]` and update text if needed
- If `$ARGUMENTS` is empty, process all files in `docs/specs/`
