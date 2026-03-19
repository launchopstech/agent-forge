---
name: story-fix
description: Fix a Storybook story file — apply correct layout, noLayoutWrapper, and ReactFlow container patterns. Use when the user says "fix story", "story not rendering", "storybook background", or "ReactFlow warning".
argument-hint: '<story-file-path>'
---

Fix a Storybook story file. Target file: `$ARGUMENTS`

Read the story file first, then apply whichever of these fixes are needed:

## Fix 1 — `noLayoutWrapper` (most common)

If the story renders a full-viewport component (canvas, toolbar, panel, etc.), the preview decorator's `p-6` padding will break it.

Add to `meta.parameters`:

```tsx
parameters: { layout: 'fullscreen', noLayoutWrapper: true }
```

`noLayoutWrapper: true` is a custom parameter consumed by `.storybook/preview.tsx` to skip the padding wrapper.

## Fix 2 — ReactFlow container dimensions

**Symptom**: `[React Flow]: The React Flow parent container needs a width and a height to render the graph.`

**Cause**: Tailwind classes like `h-screen` or `min-h-screen` aren't computed before ReactFlow mounts.

**Fix**: Wrap the render in an inline-styled div:

```tsx
render: () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <Demo />
  </div>
)
```

Do NOT use `className="h-screen w-screen"` — use `style={{ width: '100vw', height: '100vh' }}` instead.

## Fix 3 — Background grid appearing

If a graph-paper grid background appears behind the story, it means `@storybook/addon-backgrounds` is enabled.

In `.storybook/preview.tsx`, add to global parameters:

```tsx
parameters: {
  backgrounds: { disable: true },
  // ...existing params
}
```

## Fix 4 — Missing Dark story

All components should have a Dark story for visual regression:

```tsx
export const Dark: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Demo />
    </div>
  ),
  parameters: { themes: { themeOverride: 'dark' } },
}
```

## After fixing

Run `pnpm storybook:build` to verify the story compiles without errors.
