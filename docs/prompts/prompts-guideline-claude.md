---
title: Claude Code Workflow Guide
status: final
updated: 2026-03-07
tags: [ai, workflow, development]
---

# Claude Code Workflow Guide

**Goal:** Execute spec tasks incrementally with Claude Code — plan → execute → review → commit → repeat.

---

## Core Principle

Never ask Claude to "implement the whole spec." Break every task into **single-file changes** or **small logical units** that can be reviewed in one diff.

---

## The Loop (Repeat for Every Task)

### 1. Plan the Next Chunk

Ask Claude to **read the spec** and propose the **smallest next step**.

**Prompt template:**

```
Read docs/specs/[spec-name].md.
I want to work on Phase [X], Task [Y].
What's the smallest executable unit I should tackle first?
List files I'll need to create or modify.
```

**Example:**

```
Read docs/specs/nextjs-frontend-specs.md.
I want to work on Phase 1.1 (TypeScript & ESLint Hardening).
What's the smallest executable unit I should tackle first?
```

**Claude should respond with:**

- 1–3 files to touch
- Exact config changes needed
- Acceptance criteria for this chunk

---

### 2. Execute One Chunk

Once you agree on the chunk, give Claude **execution permission** with constraints.

**Prompt template:**

```
Proceed with [task name].
Create/modify only the files you listed.
Show me the full diff before I apply.
```

**Example:**

```
Proceed with enabling strict mode in tsconfig.json.
Show me the full diff before I apply.
```

**Claude will:**

- Generate code blocks with `// filepath:` comments
- Show before/after if modifying existing files
- Include inline explanations

---

### 3. Review the Diff

Before accepting, **ask Claude to explain** the change.

**Prompt template:**

```
Explain why you made [specific change].
What breaks if I skip [specific line]?
Are there any side effects I should test?
```

**Example:**

```
Explain why you added noUncheckedIndexedAccess: true.
What breaks if I skip this line?
```

---

### 4. Verify Locally

Run the **gate check** for that phase or a quick verification command.

**Prompt template:**

```
What command should I run to verify this change worked?
```

**Example:**

```
What command should I run to verify strict mode is enforced?
```

**Claude will respond:**

```bash
npx tsc --noEmit
```

---

### 5. Commit with Context

Once verified, commit **immediately** with a descriptive message.

**Prompt template:**

```
Write a conventional commit message for this change.
```

**Example response from Claude:**

```bash
git add tsconfig.json
git commit -m "build(typescript): enable strict mode and noUncheckedIndexedAccess"
```

---

### 6. Mark Progress & Loop

Update the spec checklist.

**Prompt:**

```
Mark task 1.1 as complete in the spec file.
What's the next smallest chunk in Phase 1?
```

---

## Anti-Patterns (What NOT to Do)

| ❌ Bad Prompt       | ✅ Good Prompt                                                                        |
| ------------------- | ------------------------------------------------------------------------------------- |
| "Implement Phase 3" | "Implement the Button component from Phase 3.2, variants only, no story yet"          |
| "Set up testing"    | "Install Vitest and create vitest.config.ts with jsdom environment"                   |
| "Add dark mode"     | "Create tokens.css with CSS variables for light theme only, no dark overrides yet"    |
| "Make it look good" | "Apply the brand-50 to brand-900 color scale from tokens.css to the Button component" |

---

## Prompt Templates by Task Type

### Creating a New Component

```
Create [ComponentName] in src/components/ui/[component-name].tsx.
Requirements:
- Accept className prop
- Use cva for variants: [list variants]
- forwardRef
- TypeScript props interface
Do NOT create the story file yet.
Show me the full code.
```

### Modifying Existing Config

```
Update [filename] to add [specific setting].
Show me only the changed lines with before/after context.
Explain why this change is needed.
```

### Writing Tests

```
Write a Vitest unit test for src/lib/[filename].ts.
Cover these cases:
- [case 1]
- [case 2]
- [case 3]
Place in src/lib/__tests__/[filename].test.ts.
```

### Debugging a Failure

```
The command [command] failed with this error:
[paste error]

Files involved:
[list files]

What's the root cause? Propose the smallest fix.
```

---

## Checkpoints (When to Pause and Review)

Stop and review with a human when:

- [ ] A phase gate check fails
- [ ] Claude suggests a major architectural change
- [ ] A new dependency is added
- [ ] You see a diff larger than 100 lines
- [ ] Claude says "this might break X"

**Prompt for checkpoint review:**

```
Pause. Summarize what we just did in this phase.
List any assumptions you made.
What could go wrong if I merge this now?
```

---

## End of Phase Review

Before moving to the next phase:

**Prompt:**

```
We finished Phase [X].
Run through the Phase Gate Check from the spec.
List the commands I should run and what the expected output is.
```

**Then:**

```
All checks passed. Summarize what we built in Phase [X].
What's the first task in Phase [X+1]?
```

---

## Example Full Session (Phase 1, Task 1.1)

```
👤 Read docs/specs/nextjs-frontend-specs.md. I want to work on Phase 1.1. What's the smallest chunk?

🤖 Smallest chunk: Enable strict: true in tsconfig.json.
   Files to modify: tsconfig.json
   Acceptance: npx tsc --noEmit passes with zero errors.

👤 Proceed. Show me the diff.

🤖 [shows code block with changes]

👤 Explain why strict: true is needed.

🤖 [explains]

👤 What command verifies this?

🤖 npx tsc --noEmit

👤 [runs command, passes] Write a commit message.

🤖 git commit -m "build(typescript): enable strict mode"

👤 Mark 1.1 complete. What's next?

🤖 Next: Add noUncheckedIndexedAccess: true...
```

---

## Tips for Best Results

1. **Always reference the spec file** — Claude has the full context.
2. **Ask for verification commands** — don't guess.
3. **Commit after every green check** — small commits = easy rollback.
4. **Use conventional commits** — ask Claude to generate them.
5. **If stuck, ask Claude to re-read the spec** — it will re-calibrate.

---

## Quick Commands Reference

```bash
# Before starting a chunk
git status                 # ensure clean state

# After Claude generates code
npx tsc --noEmit          # type check
npx eslint src/           # lint check
npm run test              # unit tests (if applicable)

# After verification passes
git add [files]
git commit -m "[message from Claude]"

# Mark progress
# Edit the spec file, change [ ] to [x], commit:
git add docs/specs/nextjs-frontend-specs.md
git commit -m "docs: mark Phase X.Y complete"
```

---

## Recovery from Errors

If a chunk fails:

**Prompt:**

```
The change failed. Error: [paste error]
Revert to the previous working state.
What's a smaller chunk that would avoid this error?
```

**Then:**

```bash
git checkout [failed-files]  # or git reset --hard if not committed
```

---

## Final Checklist Before Opening a PR

**Prompt:**

```
We finished Phase [X]. Run through the final PR checklist:
- All gate checks pass
- No hardcoded copy
- All tests pass
- Types pass
- ESLint passes
- Conventional commits used
Confirm each item.
```

---

## Contact

For workflow questions, open an issue or update this doc
