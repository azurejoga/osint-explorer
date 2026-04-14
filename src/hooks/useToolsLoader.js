/**
 * Loads tools — always fetches fresh data from GitHub on every app open.
 * Strategy:
 *   1. Serve stale cache instantly (localStorage) → zero FOUC
 *   2. Fetch GitHub README in the background, parse it client-side
 *   3. If GitHub is unreachable → fall back to bundled /data/tools.json
 *   4. If version/etag changed → update cache and re-render
 */

import { useState, useEffect, useMemo } from 'react'
import { parseMD } from '../utils/parseMd.js'

const LS_TOOLS   = 'osint_tools_cache'
const LS_VERSION = 'osint_tools_version'
const MD_URL     = 'https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md'
const LOCAL_JSON = `${import.meta.env.BASE_URL}data/tools.json`

function readLocalCache() {
  try {
    const raw = localStorage.getItem(LS_TOOLS)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function writeLocalCache(version, tools) {
  try {
    localStorage.setItem(LS_VERSION, version)
    localStorage.setItem(LS_TOOLS, JSON.stringify(tools))
  } catch {}
}

export function useToolsLoader() {
  const [tools, setTools]     = useState(() => readLocalCache() || [])
  const [loading, setLoading] = useState(tools.length === 0)
  const [version, setVersion] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTools() {
      let freshTools = null
      let newVersion = null

      // ── 1. Try GitHub README (live, always up-to-date) ───────────────────
      try {
        const res = await fetch(MD_URL, { cache: 'no-cache' })
        if (res.ok) {
          const md  = await res.text()
          const etag = res.headers.get('etag') || res.headers.get('last-modified') || new Date().toDateString()
          freshTools = parseMD(md)
          newVersion = etag
        }
      } catch {
        // network unavailable — try local fallback
      }

      // ── 2. Fallback to bundled tools.json if GitHub unreachable ──────────
      if (!freshTools) {
        try {
          const res  = await fetch(LOCAL_JSON, { cache: 'no-cache' })
          if (res.ok) {
            const data = await res.json()
            freshTools = data.tools
            newVersion = data.version
          }
        } catch (err) {
          console.warn('[useToolsLoader] Both GitHub and local JSON failed:', err.message)
        }
      }

      if (cancelled || !freshTools) { setLoading(false); return }

      const cachedVersion = localStorage.getItem(LS_VERSION)
      if (cachedVersion !== newVersion || tools.length === 0) {
        writeLocalCache(newVersion, freshTools)
        setTools(freshTools)
      }
      setVersion(newVersion)
      setLoading(false)
    }

    fetchTools()
    return () => { cancelled = true }
  }, [])

  // Build category index once for O(1) category lookups
  const categoryIndex = useMemo(() => {
    const idx = {}
    tools.forEach(tool => {
      if (!idx[tool.category]) idx[tool.category] = []
      idx[tool.category].push(tool)
    })
    return idx
  }, [tools])

  // Live category counts derived from the full dataset
  const categoryStats = useMemo(() => {
    const counts = {}
    tools.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
    return counts
  }, [tools])

  return { tools, loading, version, categoryIndex, categoryStats }
}
