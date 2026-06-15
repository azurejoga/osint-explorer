/**
 * Loads tools from OSINT-Framework and optionally merges with awesome-osint.
 * Strategy:
 *   1. Serve stale cache instantly (localStorage) → zero FOUC
 *   2. Load local bundled tools.json (OSINT-Framework tools) as primary source
 *   3. Optionally fetch awesome-osint from GitHub to merge additional tools
 *   4. Deduplicate by URL and merge metadata
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

function mergeTools(localTools, awesomeTools) {
  const seenUrls = new Set(localTools.map(t => t.url))
  const merged = [...localTools]

  for (const tool of awesomeTools) {
    if (!seenUrls.has(tool.url)) {
      merged.push({ ...tool, source: 'awesome-osint' })
      seenUrls.add(tool.url)
    }
  }

  return merged
}

export function useToolsLoader() {
  const [tools, setTools]     = useState(() => readLocalCache() || [])
  const [loading, setLoading] = useState(tools.length === 0)
  const [version, setVersion] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchTools() {
      let localTools = []
      let newVersion = null

      // ── 1. Load local tools.json (OSINT-Framework) ───────────────────────
      try {
        const res = await fetch(LOCAL_JSON, { cache: 'no-cache' })
        if (res.ok) {
          const data = await res.json()
          localTools = data.tools || []
          newVersion = data.version
        }
      } catch (err) {
        console.warn('[useToolsLoader] Local tools.json not available:', err.message)
      }

      // ── 2. Try to merge with awesome-osint from GitHub ───────────────────
      try {
        const res = await fetch(MD_URL, { cache: 'no-cache' })
        if (res.ok) {
          const md    = await res.text()
          const etag  = res.headers.get('etag') || res.headers.get('last-modified') || new Date().toDateString()
          const awesomeTools = parseMD(md)
          localTools = mergeTools(localTools, awesomeTools)
          newVersion = `merged-${etag}`
        }
      } catch {
        // awesome-osint unavailable — use local tools only
      }

      if (cancelled) return

      if (localTools.length === 0) {
        setLoading(false)
        return
      }

      const cachedVersion = localStorage.getItem(LS_VERSION)
      if (cachedVersion !== newVersion || tools.length === 0) {
        writeLocalCache(newVersion, localTools)
        setTools(localTools)
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
