// Shared Web Crypto API helpers used across tool components

const enc = new TextEncoder()

// ─── Encoding ────────────────────────────────────────────────────

export function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export function toBase64url(buf: ArrayBuffer): string {
  return toBase64(buf).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function base64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + (4 - s.length % 4) % 4, '=')
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export function base32ToBytes(secret: string): Uint8Array {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const s = secret.toUpperCase().replace(/=+$/, '')
  let bits = 0, value = 0
  const output: number[] = []
  for (const ch of s) {
    const idx = ALPHABET.indexOf(ch)
    if (idx < 0) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return new Uint8Array(output)
}

// ─── HMAC ────────────────────────────────────────────────────────

const ALG_MAP: Record<string, string> = {
  'HS256': 'SHA-256', 'HS384': 'SHA-384', 'HS512': 'SHA-512',
  'SHA-256': 'SHA-256', 'SHA-384': 'SHA-384', 'SHA-512': 'SHA-512', 'SHA-1': 'SHA-1',
}

export async function hmacSign(
  alg: string,
  secret: string | Uint8Array,
  message: string,
  encoding: 'hex' | 'base64' | 'base64url' = 'hex'
): Promise<string> {
  const keyData = typeof secret === 'string' ? enc.encode(secret) : secret
  const hashAlg = ALG_MAP[alg] || 'SHA-256'
  const key = await crypto.subtle.importKey('raw', keyData.buffer as ArrayBuffer, { name: 'HMAC', hash: hashAlg }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message).buffer as ArrayBuffer)
  if (encoding === 'base64') return toBase64(sig)
  if (encoding === 'base64url') return toBase64url(sig)
  return toHex(sig)
}

export async function hmacVerify(
  alg: string,
  secret: string,
  message: string,
  expected: string
): Promise<boolean> {
  const computed = await hmacSign(alg, secret, message, 'hex')
  const normalized = expected.replace(/^sha256=/i, '').toLowerCase()
  return computed === normalized || computed === expected.toLowerCase()
}

export async function hmacSignRaw(
  alg: string,
  keyBytes: Uint8Array,
  messageBytes: Uint8Array
): Promise<ArrayBuffer> {
  const hashAlg = ALG_MAP[alg] || 'SHA-256'
  const key = await crypto.subtle.importKey('raw', keyBytes.buffer as ArrayBuffer, { name: 'HMAC', hash: hashAlg }, false, ['sign'])
  return crypto.subtle.sign('HMAC', key, messageBytes.buffer as ArrayBuffer)
}

// ─── PKCE ────────────────────────────────────────────────────────

export async function pkceChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(verifier).buffer as ArrayBuffer)
  return toBase64url(hash)
}

export function pkceVerifier(byteLen = 64): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLen))
  return toBase64url(bytes.buffer)
}

// ─── PBKDF2 ──────────────────────────────────────────────────────

export async function pbkdf2Hash(
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<ArrayBuffer> {
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(password).buffer as ArrayBuffer, 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: salt.buffer as ArrayBuffer, iterations },
    baseKey,
    256
  )
}

// ─── Key Generation ──────────────────────────────────────────────

export type EcCurve = 'P-256' | 'P-384'
export type RsaSize = 2048 | 4096

export async function generateECKeyPair(curve: EcCurve = 'P-256') {
  return crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: curve }, true, ['sign', 'verify'])
}

export async function generateRSAKeyPair(size: RsaSize = 2048) {
  return crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: size, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']
  )
}

export async function exportPublicJwk(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey('jwk', key)
}

export async function exportPrivateJwk(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey('jwk', key)
}

export async function exportSpkiPem(key: CryptoKey): Promise<string> {
  const buf = await crypto.subtle.exportKey('spki', key)
  return `-----BEGIN PUBLIC KEY-----\n${toBase64(buf).match(/.{1,64}/g)!.join('\n')}\n-----END PUBLIC KEY-----`
}

export async function exportPkcs8Pem(key: CryptoKey): Promise<string> {
  const buf = await crypto.subtle.exportKey('pkcs8', key)
  return `-----BEGIN PRIVATE KEY-----\n${toBase64(buf).match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----`
}

// ─── DPoP / ECDSA ────────────────────────────────────────────────

export async function ecdsaSign(privateKey: CryptoKey, data: string): Promise<ArrayBuffer> {
  return crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, enc.encode(data).buffer as ArrayBuffer)
}

export function derToRawEcdsa(der: ArrayBuffer): ArrayBuffer {
  // Convert DER-encoded ECDSA signature to raw R||S (64 bytes for P-256)
  const d = new Uint8Array(der)
  let offset = 2
  const rLen = d[offset + 1]
  const rStart = offset + 2 + (d[offset + 2] === 0 ? 1 : 0)
  const r = d.slice(rStart, offset + 2 + rLen)
  offset += 2 + rLen
  const sLen = d[offset + 1]
  const sStart = offset + 2 + (d[offset + 2] === 0 ? 1 : 0)
  const s = d.slice(sStart, offset + 2 + sLen)
  const out = new Uint8Array(64)
  out.set(r.slice(-32), 32 - Math.min(r.length, 32))
  out.set(s.slice(-32), 64 - Math.min(s.length, 32))
  return out.buffer
}

// ─── Misc ────────────────────────────────────────────────────────

export function randomHex(bytes: number): string {
  return toHex(crypto.getRandomValues(new Uint8Array(bytes)).buffer)
}

export async function sha256(data: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(data).buffer as ArrayBuffer)
  return toHex(hash)
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  })
}
