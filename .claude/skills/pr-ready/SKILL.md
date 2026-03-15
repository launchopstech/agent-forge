---
name: pr-ready
description: Check if the current branch is ready for a PR — run gate checks, summarize changes, and draft a PR description. Use when the user says "ready for PR", "is this PR ready", "create PR", or "prepare PR".
argument-hint: '[base-branch, defaults to main]'
---

Check PR readiness for the current branch and draft a PR description. Base branch: `$ARGUMENTS` (default: `main`)

## Step 1 — Gate checks

Run the fast gate checks first:

```bash
pnpm typecheck && pnpm lint && pnpm build && pnpm test:coverage
```

Report pass/fail for each. If any fail, stop and list what needs to be fixed before the PR is ready.

## Step 2 — Change summary

```bash
git log main..HEAD --oneline
git diff main...HEAD --stat
```

Summarize:

- How many commits, which files changed
- What type of change: feature / bugfix / refactor / docs / infra
- Any breaking changes (API changes, deleted exports, config changes)

## Step 3 — Storybook check (if UI components changed)

If any `.stories.tsx` files are in the diff, run:

```bash
pnpm storybook:build
```

## Step 4 — Draft PR description

Output a ready-to-use PR description in this format:

```markdown
## Summary

- <bullet 1>
- <bullet 2>
- <bullet 3>

## Changes

- <file or area>: <what changed and why>

## Test plan

- [ ] Gate checks green (typecheck, lint, build, test:coverage)
- [ ] Storybook stories render correctly (if UI changed)
- [ ] Tested locally at localhost:3000
- [ ] i18n keys added to all locales (if i18n changed)

## Notes

<any context reviewers need to know>
```

## Step 5 — PR creation (if user confirms)

Only create the PR if the user explicitly says "yes, create it" or "go ahead". Use:

```bash
gh pr create --title "<title>" --body "<body>" --base main
```

Return the PR URL.
