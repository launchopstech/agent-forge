/**
 * All supported auth provider keys.
 * Add a new value here when adding a new provider — TypeScript will flag
 * every registry switch that needs a new case.
 */
export type AuthProviderKey = 'clerk' | 'next-auth' | 'okta' | 'auth-handler'

/**
 * Application properties — tenant/client-configurable values.
 *
 * These are distinct from infrastructure env vars (src/config/env.ts).
 * In the agency model, these will eventually be resolved per client from
 * a metadata store (DB, config service, CMS) rather than from env vars.
 *
 * SWAP POINT: replace the `process.env` reads below with a metadata lookup
 * (e.g. `await getClientConfig(tenantId)`) when moving to per-client config.
 */

/**
 * The active auth provider for this deployment/tenant.
 * Controls which adapter is used across server, client, middleware, and provider.
 */
export const activeAuthProvider: AuthProviderKey =
  (process.env.NEXT_PUBLIC_AUTH_PROVIDER as AuthProviderKey) ?? 'clerk'
