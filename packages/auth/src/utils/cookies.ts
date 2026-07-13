/**
 * Secure cookie sealing/unsealing utilities using AES-256-GCM.
 * Mirrors the pattern from forge-core auth-handler (apps/auth-handler/src/cookies.ts).
 *
 * Provides confidentiality (encryption) + authenticity (MAC tag) for sensitive
 * cookie data. Prevents tampering and eavesdropping.
 *
 * Cookie format: {nonce}.{tag}.{ciphertext} (all base64url-encoded)
 */

/**
 * Seals (encrypts + authenticates) a data object into a tamper-proof string.
 * Uses AES-256-GCM with a random nonce per seal operation.
 *
 * @param data - Object to seal (will be JSON-stringified)
 * @param secret - Secret key string (will be hashed to 256-bit key)
 * @returns Base64URL-encoded sealed string: {nonce}.{tag}.{ciphertext}
 */
export async function sealCookie<T>(data: T, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const nonce = crypto.getRandomValues(new Uint8Array(12)) // 96 bits recommended for GCM
  const plaintext = new TextEncoder().encode(JSON.stringify(data))

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, plaintext)

  // AES-GCM output includes the authentication tag at the end (last 16 bytes)
  const ciphertextArray = new Uint8Array(ciphertext)
  const tag = ciphertextArray.slice(-16)
  const encrypted = ciphertextArray.slice(0, -16)

  return [base64urlEncode(nonce), base64urlEncode(tag), base64urlEncode(encrypted)].join('.')
}

/**
 * Unseals (decrypts + verifies) a sealed cookie string back to the original data.
 * Throws if the cookie is tampered with or invalid.
 *
 * @param sealed - Sealed string from sealCookie (format: {nonce}.{tag}.{ciphertext})
 * @param secret - Secret key string (must match the one used to seal)
 * @returns Decrypted and parsed data object
 * @throws {Error} If sealed string is malformed or authentication fails
 */
export async function unsealCookie<T>(sealed: string, secret: string): Promise<T> {
  const parts = sealed.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid sealed cookie format')
  }

  const nonceB64 = parts[0]
  const tagB64 = parts[1]
  const ciphertextB64 = parts[2]

  if (!nonceB64 || !tagB64 || !ciphertextB64) {
    throw new Error('Invalid sealed cookie format - missing parts')
  }

  const nonce = base64urlDecode(nonceB64)
  const tag = base64urlDecode(tagB64)
  const encrypted = base64urlDecode(ciphertextB64)

  // Recombine ciphertext + tag (AES-GCM expects tag at the end)
  const combined = new Uint8Array(encrypted.length + tag.length)
  combined.set(encrypted, 0)
  combined.set(tag, encrypted.length)

  const key = await deriveKey(secret)

  try {
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: nonce }, key, combined)

    const json = new TextDecoder().decode(plaintext)
    return JSON.parse(json) as T
  } catch (err) {
    throw new Error('Failed to unseal cookie — tampered or invalid')
  }
}

/**
 * Derives a 256-bit AES key from a secret string using SHA-256.
 * Ensures consistent key derivation from human-readable secrets.
 *
 * @param secret - Secret key string
 * @returns CryptoKey suitable for AES-GCM operations
 */
async function deriveKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const secretBytes = encoder.encode(secret)
  const hash = await crypto.subtle.digest('SHA-256', secretBytes)

  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM', length: 256 }, false, [
    'encrypt',
    'decrypt',
  ])
}

/**
 * Base64URL encodes a byte array (no padding, URL-safe alphabet).
 *
 * @param buffer - Byte array to encode
 * @returns Base64URL-encoded string
 */
function base64urlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Base64URL decodes a string back to a byte array.
 *
 * @param str - Base64URL-encoded string
 * @returns Decoded byte array
 */
function base64urlDecode(str: string): Uint8Array {
  // Restore standard base64 (replace - with +, _ with /)
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding back
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}
