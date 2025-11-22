/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate short code format (6-8 alphanumeric)
 */
export function validateCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code)
}

/**
 * Generate random alphanumeric code (6 characters)
 */
export function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
