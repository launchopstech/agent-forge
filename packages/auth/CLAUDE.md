# @forge/auth

Pluggable auth adapter layer. Active provider: `NEXT_PUBLIC_AUTH_PROVIDER=clerk|next-auth|okta` (default: `clerk`).

## Import rules

- `adapters/clerk/server.ts` — only file that may import from `@clerk/nextjs/server`
- `adapters/clerk/client.ts` — only file that may import from `@clerk/nextjs` (hooks)
- App code imports from `@/lib/auth` or `@/hooks/use-user` — **never** directly from `@clerk/nextjs`
- Provider UI (`<UserButton />`, `<SignIn />`, `<SignUp />`) allowed at route/page level only, marked `// PROVIDER-SPECIFIC`

## Adding a new provider

1. Create `adapters/<provider>/` with `server.ts`, `client.ts`, `provider.tsx`, `middleware.ts`
2. Add key to `AuthProviderKey` in `contracts.ts` — TypeScript flags every missing switch case
3. Add `import * as <provider>Adapter` + `case '<provider>'` to each registry file
4. Set `NEXT_PUBLIC_AUTH_PROVIDER=<provider>` in `.env.local`, Vercel, and GitHub Variables

Stubs for next-auth and okta throw `NotImplementedError` — expected.
