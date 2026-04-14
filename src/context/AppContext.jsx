import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useToolsLoader } from '../hooks/useToolsLoader.js'
import { getT, RTL_LANGS } from '../data/i18n.js'

const AppContext = createContext(null)

const LS = {
  get: (key, fallback) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback } catch { return fallback } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} },
}

export function AppProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const stored = LS.get('osint_lang', null)
    if (stored) return stored
    const SUPPORTED = new Set(['pt','en','es','fr','de','it','nl','ru','zh','ja','ko','ar','hi','bn','tr','pl','sv','no','da','fi','cs','ro','hu','el','uk','th','vi','id','ms','fa'])
    const nav = (navigator.language || navigator.userLanguage || 'pt').substring(0, 2).toLowerCase()
    return SUPPORTED.has(nav) ? nav : 'pt'
  })
  const [theme, setThemeState]       = useState(() => LS.get('osint_theme', 'dark'))
  const [viewMode, setViewModeState] = useState(() => LS.get('osint_view', 'grid'))
  const [searchQuery, setSearchQuery]           = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sidebarOpen, setSidebarOpen]   = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy]             = useState('name')
  const [favorites, setFavorites]       = useState(() => new Set(LS.get('osint_favorites', [])))
  const [toast, setToast]               = useState(null)

  // ── JSON-backed tool loader (version-aware cache) ──────────────────────────
  const { tools: jsonTools, loading, version, categoryIndex: jsonCatIndex } = useToolsLoader()

  const t = useMemo(() => getT(language), [language])

  // Sync theme + lang dir to <html>
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') { html.classList.add('dark'); html.classList.remove('light') }
    else { html.classList.add('light'); html.classList.remove('dark') }
    html.lang = language
    html.dir = RTL_LANGS.has(language) ? 'rtl' : 'ltr'
  }, [theme, language])

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    LS.set('osint_lang', lang)
    document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState(prev => { const n = prev === 'dark' ? 'light' : 'dark'; LS.set('osint_theme', n); return n })
  }, [])

  const setViewMode = useCallback((mode) => { setViewModeState(mode); LS.set('osint_view', mode) }, [])

  const toggleFavorite = useCallback((toolId) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(toolId) ? next.delete(toolId) : next.add(toolId)
      LS.set('osint_favorites', [...next])
      return next
    })
  }, [])

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // ── All tools from JSON loader ────────────────────────────────────────────
  const allTools = jsonTools
  const categoryIndex = jsonCatIndex

  // ── Lazy pool: only tools from the selected category (or favorites) ─────────
  const categoryPool = useMemo(() => {
    if (showFavoritesOnly) return allTools.filter(t => favorites.has(t.id))
    if (selectedCategory)  return categoryIndex[selectedCategory] || []
    return [] // no category selected → empty until user picks one
  }, [showFavoritesOnly, selectedCategory, allTools, categoryIndex, favorites])

  // ── Apply search + status filter ──────────────────────────────────────────
  const filteredTools = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0

    // When searching with no category/favorites active, search the full dataset
    let result = (hasSearch && !selectedCategory && !showFavoritesOnly)
      ? allTools
      : categoryPool

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }

    if (hasSearch) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => {
        const desc = t.description?.[language] || t.description?.en || t.description?.pt || ''
        return (
          t.name.toLowerCase().includes(q) ||
          t.url.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q) ||
          (t.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
        )
      })
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'name')     return a.name.localeCompare(b.name)
      if (sortBy === 'status')   return a.status.localeCompare(b.status)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })
  }, [categoryPool, allTools, statusFilter, searchQuery, language, sortBy, selectedCategory, showFavoritesOnly])

  // ── Stats always reflect the full dataset ──────────────────────────────────
  const stats = useMemo(() => ({
    total:     allTools.length,
    online:    allTools.filter(t => t.status === 'online').length,
    offline:   allTools.filter(t => t.status === 'offline').length,
    unknown:   allTools.filter(t => t.status === 'unknown').length,
    favorites: favorites.size,
    filtered:  filteredTools.length,
  }), [allTools, favorites, filteredTools])

  // ── Category counts from the full dataset ──────────────────────────────────
  const categoryStats = useMemo(() => {
    const counts = {}
    allTools.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1 })
    return counts
  }, [allTools])

  return (
    <AppContext.Provider value={{
      language, setLanguage, t,
      theme, toggleTheme,
      viewMode, setViewMode,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      showFavoritesOnly, setShowFavoritesOnly,
      sidebarOpen, setSidebarOpen,
      statusFilter, setStatusFilter,
      sortBy, setSortBy,
      favorites, toggleFavorite,
      allTools, filteredTools, categoryIndex,
      stats, categoryStats,
      loading, version,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
