const MINIMAL_CHROME_PREFIXES = ['/resume', '/settings', '/cv'] as const

export function usesMinimalChrome(pathname: string | null | undefined): boolean {
  if (!pathname) return false

  return MINIMAL_CHROME_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}
