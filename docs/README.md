...existing code...
# Docs

This folder contains project specifications, todos, and other human-readable knowledge used by developers and agents (e.g., Claude). Keep files small, focused, and machine-friendly (YAML frontmatter + plain headings).

## Purpose
- Central source for specs, design notes, and project TODOs.
- Machine-consumable format for code/agents: use consistent frontmatter and clear summaries.

## Folder layout
- docs/
  - specs/        — detailed design specs (one topic per file)
  - todos.md      — project-level task list
  - README.md     — this file

## Conventions
- Filename: kebab-case.md (e.g., agent-auth.md)
- Frontmatter (required for specs):