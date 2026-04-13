/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0 flows.
 * Implements RFC 7636 — ensures authorization codes cannot be intercepted.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7636
 */

/**
 * Generates a cryptographically random code verifier.
 * Per RFC 7636:
 * - Length: 43-128 characters
 * - Character set: [A-Z] [a-z] [0-9] - . _ ~ (unreserved URI characters)
 *
 * @returns Base64URL-encoded random string (43-128 chars)
 */
export function generateCodeVerifier(): string {
  // Generate 32 random bytes → base64url → 43 chars (meets minimum)
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

/**
 * Generates the code challenge from a verifier.
 * Uses S256 method: BASE64URL(SHA256(ASCII(code_verifier)))
 *
 * @param verifier - The code verifier string
 * @returns Base64URL-encoded SHA-256 hash of the verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return base64urlEncode(new Uint8Array(hashBuffer))
}

/**
 * Generates a cryptographically random state parameter for CSRF protection.
 * State is an opaque string that prevents authorization injection attacks.
 *
 * @returns Base64URL-encoded random string (32 bytes → 43 chars)
 */
export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

/**
 * Base64URL encodes a byte array (no padding, URL-safe alphabet).
 * - Replaces + with - (hyphen)
 * - Replaces / with _ (underscore)
 * - Removes trailing = padding
 *
 * @param buffer - Byte array to encode
 * @returns Base64URL-encoded string
 */
function base64urlEncode(buffer: Uint8Array): string {
  // Convert to base64
  const base64 = btoa(String.fromCharCode(...buffer))
  // Make URL-safe and remove padding
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
