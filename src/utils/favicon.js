/**
 * Returns a Google favicon URL for the given tool URL, or null on failure.
 */
export function getFaviconUrl(url) {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return null
  }
}
