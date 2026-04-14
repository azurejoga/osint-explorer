import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Search, Menu, Sun, Moon, Star, X, ChevronDown,
  LayoutGrid, List, Table2, GitBranch, AlignJustify,
  Globe, Filter, Home, Wrench,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const VIEW_MODES = [
  { id: 'grid',    icon: LayoutGrid,   labelKey: 'viewGrid' },
  { id: 'list',    icon: List,         labelKey: 'viewList' },
  { id: 'table',   icon: Table2,       labelKey: 'viewTable' },
  { id: 'tree',    icon: GitBranch,    labelKey: 'viewTree' },
  { id: 'compact', icon: AlignJustify, labelKey: 'viewCompact' },
]

const LANGS = [
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'bn', flag: '🇧🇩', label: 'বাংলা' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  { code: 'sv', flag: '🇸🇪', label: 'Svenska' },
  { code: 'no', flag: '🇳🇴', label: 'Norsk' },
  { code: 'da', flag: '🇩🇰', label: 'Dansk' },
  { code: 'fi', flag: '🇫🇮', label: 'Suomi' },
  { code: 'cs', flag: '🇨🇿', label: 'Čeština' },
  { code: 'ro', flag: '🇷🇴', label: 'Română' },
  { code: 'hu', flag: '🇭🇺', label: 'Magyar' },
  { code: 'el', flag: '🇬🇷', label: 'Ελληνικά' },
  { code: 'uk', flag: '🇺🇦', label: 'Українська' },
  { code: 'th', flag: '🇹🇭', label: 'ภาษาไทย' },
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
  { code: 'id', flag: '🇮🇩', label: 'Bahasa Indonesia' },
  { code: 'ms', flag: '🇲🇾', label: 'Bahasa Melayu' },
  { code: 'fa', flag: '🇮🇷', label: 'فارسی' },
]

export default function Header({ page = 'tools', onNavigate }) {
  const {
    t, language, setLanguage,
    theme, toggleTheme,
    viewMode, setViewMode,
    searchQuery, setSearchQuery,
    showFavoritesOnly, setShowFavoritesOnly,
    sidebarOpen, setSidebarOpen,
    stats, statusFilter, setStatusFilter,
    filteredTools, setSelectedCategory,
  } = useApp()

  const [langOpen, setLangOpen]   = useState(false)
  const langRef                   = useRef(null)
  const searchRef                 = useRef(null)
  const debounceRef               = useRef(null)
  const [searchRaw, setSearchRaw] = useState('')

  const currentLang = LANGS.find(l => l.code === language) || LANGS[0]

  // Keep local raw value in sync when query is cleared externally
  useEffect(() => { setSearchRaw(searchQuery) }, [searchQuery])

  // Debounced search — 300 ms
  const handleSearch = useCallback((e) => {
    const val = e.target.value
    setSearchRaw(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setSearchQuery(val), 300)
  }, [setSearchQuery])

  const clearSearch = useCallback(() => {
    setSearchRaw('')
    setSearchQuery('')
    searchRef.current?.focus()
  }, [setSearchQuery])

  // Close language dropdown on outside click
  useEffect(() => {
    if (!langOpen) return
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen])

  // Keyboard shortcut: press / to focus search
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header role="banner" className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-md border-b border-gray-800">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-3">

        {/* Sidebar toggle — visible on ALL screen sizes */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={t('sidebarToggle')}
          aria-expanded={sidebarOpen}
          aria-controls="sidebar-nav"
          title={t('sidebarToggle')}
          className="btn btn-ghost p-2 flex-shrink-0"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl" aria-hidden="true">🕵️</span>
          <h1 className="font-bold text-sm sm:text-base text-gray-100 leading-tight hidden sm:block">
            {t('appTitle')}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 flex-shrink-0" aria-label="Navigation">
          <button
            onClick={() => onNavigate?.('home')}
            aria-current={page === 'home' ? 'page' : undefined}
            title={t('navHome')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              page === 'home' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Home size={13} aria-hidden="true" />
            <span className="hidden md:inline">{t('navHome')}</span>
          </button>
          <button
            onClick={() => onNavigate?.('tools')}
            aria-current={page === 'tools' ? 'page' : undefined}
            title={t('navTools')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              page === 'tools' ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Wrench size={13} aria-hidden="true" />
            <span className="hidden md:inline">{t('navTools')}</span>
          </button>
        </nav>

        {/* Search — only on tools page */}
        {page === 'tools' && <div role="search" className="flex-1 max-w-2xl relative mx-2">
          <label htmlFor="main-search" className="sr-only">{t('search')}</label>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden="true" />
          <input
            ref={searchRef}
            id="main-search"
            type="search"
            className="w-full input pl-9 pr-8"
            placeholder={`${t('search')} (/)`}
            value={searchRaw}
            onChange={handleSearch}
            aria-describedby="search-results-live"
            autoComplete="off"
            spellCheck="false"
          />
          {searchRaw && (
            <button
              onClick={clearSearch}
              aria-label={t('clearFilters')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 p-0.5 rounded"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>}
        {page === 'home' && <div className="flex-1" />}

        {/* Right actions */}
        <div role="toolbar" aria-label={t('actions')} className="flex items-center gap-1.5 flex-shrink-0">

          {/* Favorites toggle */}
          <button
            onClick={() => { setShowFavoritesOnly(o => !o); setSelectedCategory(null) }}
            aria-label={t('onlyFavorites')}
            aria-pressed={showFavoritesOnly}
            title={t('onlyFavorites')}
            className={`btn p-2 ${showFavoritesOnly ? 'text-yellow-400 bg-yellow-500/15' : 'btn-ghost'}`}
          >
            <Star size={15} className={showFavoritesOnly ? 'fill-current' : ''} aria-hidden="true" />
          </button>

          {/* Language selector */}
          <div className="relative" ref={langRef}>
            <button
              id="lang-btn"
              onClick={() => setLangOpen(o => !o)}
              aria-label={`${t('language')}: ${currentLang.label}`}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              title={t('language')}
              className="btn btn-ghost p-2 gap-1 flex items-center"
            >
              <Globe size={15} aria-hidden="true" />
              <span className="text-xs font-medium">{currentLang.label.slice(0, 2).toUpperCase()}</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {langOpen && (
              <ul
                role="listbox"
                aria-labelledby="lang-btn"
                className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 min-w-[160px] max-h-80 overflow-y-auto"
              >
                {LANGS.map(l => (
                  <li key={l.code} role="option" aria-selected={language === l.code}>
                    <button
                      onClick={() => { setLanguage(l.code); setLangOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-gray-800 transition-colors ${
                        language === l.code ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-300'
                      }`}
                    >
                      <span aria-hidden="true">{l.flag}</span>
                      <span>{l.label}</span>
                      {language === l.code && <span className="ml-auto text-indigo-400 text-xs" aria-hidden="true">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
            aria-pressed={theme === 'light'}
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            className="btn btn-ghost p-2"
          >
            {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ── Toolbar — only on tools page ── */}
      {page === 'tools' && <div role="toolbar" aria-label={t('filterByStatus')} className="flex items-center gap-2 px-4 py-2 border-t border-gray-800/60 overflow-x-auto">

        {/* Live results count — announced by screen readers */}
        <div
          id="search-results-live"
          className="flex items-center gap-2 text-xs text-gray-500 mr-3 flex-shrink-0"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="font-semibold text-gray-300">{filteredTools.length}</span>
          <span className="hidden sm:inline">{t('results')}</span>
          <span className="w-px h-3 bg-gray-700 mx-1" aria-hidden="true" />
          <span className="text-green-400" title={`${stats.online} online`}>{stats.online} ●</span>
          <span className="text-red-400"  title={`${stats.offline} offline`}>{stats.offline} ●</span>
          <span className="text-yellow-400" title={`${stats.unknown} ${t('statusUnknown')}`}>{stats.unknown} ●</span>
        </div>

        <div className="flex-1" />

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Filter size={12} className="text-gray-500" aria-hidden="true" />
          <label htmlFor="status-filter" className="sr-only">{t('filterByStatus')}</label>
          <select
            id="status-filter"
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label={t('filterByStatus')}
          >
            <option value="all">{t('allStatuses')}</option>
            <option value="online">{t('statusOnline')}</option>
            <option value="offline">{t('statusOffline')}</option>
            <option value="unknown">{t('statusUnknown')}</option>
          </select>
        </div>

        {/* View mode buttons */}
        <div
          role="group"
          aria-label={t('viewMode')}
          className="flex items-center bg-gray-800/80 rounded-lg p-0.5 flex-shrink-0"
        >
          {VIEW_MODES.map(({ id, icon: Icon, labelKey }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              aria-label={t(labelKey)}
              aria-pressed={viewMode === id}
              title={t(labelKey)}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === id ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={14} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>}
    </header>
  )
}
