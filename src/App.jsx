import React, { useRef, useEffect, useState, useCallback } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import ToolCard from './components/ToolCard.jsx'
import ToolListItem from './components/ToolListItem.jsx'
import ToolTable from './components/ToolTable.jsx'
import ToolTree from './components/ToolTree.jsx'
import ToolCompact from './components/ToolCompact.jsx'
import LandingPage from './components/LandingPage.jsx'
import { useSEO } from './hooks/useSEO.js'
import { RefreshCw, AlertCircle, Star, Loader2, FolderOpen } from 'lucide-react'
import { CATEGORIES } from './data/categories.js'

const PAGE_SIZE = 48 // tools rendered per "page"

// ── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const { stats, t } = useApp()
  const items = [
    { label: t('totalTools'),     value: stats.total,     color: 'text-indigo-400' },
    { label: t('onlineTools'),    value: stats.online,    color: 'text-green-400'  },
    { label: t('offlineTools'),   value: stats.offline,   color: 'text-red-400'   },
    { label: t('unknownTools'),   value: stats.unknown,   color: 'text-yellow-400' },
    { label: t('favoritesCount'), value: stats.favorites, color: 'text-yellow-300' },
  ]
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-2.5 bg-gray-900/60 border-b border-gray-800"
    >
      {items.map(({ label, value, color }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className={`text-base font-bold tabular-nums ${color}`}>{value.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
  const { t } = useApp()
  return (
    <div
      role="status"
      aria-label={t('loading')}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 h-44 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="w-5 h-5 bg-gray-800 rounded" />
            <div className="flex-1 h-4 bg-gray-800 rounded" />
          </div>
          <div className="flex gap-2 mb-3">
            <div className="w-20 h-5 bg-gray-800 rounded-full" />
            <div className="w-14 h-5 bg-gray-800 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 bg-gray-800 rounded" />
            <div className="h-3 bg-gray-800 rounded w-4/5" />
          </div>
        </div>
      ))}
      <span className="sr-only">{t('loading')}</span>
    </div>
  )
}

// ── Welcome / no-category state ─────────────────────────────────────────────
function WelcomeState() {
  const { t, stats } = useApp()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4 select-none">
      <div className="text-6xl mb-5" aria-hidden="true">🕵️</div>
      <h2 className="text-xl font-bold text-gray-300 mb-2">
        {stats.total.toLocaleString()} {t('toolsVerified')}
      </h2>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        {t('welcomeDesc')}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
        <FolderOpen size={14} className="text-indigo-500" />
        <span>{t('welcomeHint')}</span>
      </div>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  const { t, setSearchQuery, setSelectedCategory, setShowFavoritesOnly, setStatusFilter, showFavoritesOnly, stats } = useApp()

  if (showFavoritesOnly && stats.favorites === 0) {
    return (
      <div role="status" className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Star size={48} className="text-gray-700 mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-400 mb-2">{t('noFavorites')}</h2>
        <p className="text-sm text-gray-600 max-w-sm">{t('noFavoritesDesc')}</p>
      </div>
    )
  }

  return (
    <div role="status" className="flex flex-col items-center justify-center py-20 text-center px-4">
      <AlertCircle size={48} className="text-gray-700 mb-4" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-gray-400 mb-2">{t('noToolsFound')}</h2>
      <p className="text-sm text-gray-600 mb-5 max-w-sm">{t('noToolsFoundDesc')}</p>
      <button
        className="btn btn-primary"
        onClick={() => { setSearchQuery(''); setSelectedCategory(null); setShowFavoritesOnly(false); setStatusFilter('all') }}
      >
        <RefreshCw size={14} aria-hidden="true" />
        {t('clearFilters')}
      </button>
    </div>
  )
}

// ── Category heading ─────────────────────────────────────────────────────────
function CategoryHeader() {
  const { selectedCategory, language, t, categoryStats } = useApp()
  if (!selectedCategory) return null
  const cat = CATEGORIES.find(c => c.id === selectedCategory)
  if (!cat) return null
  return (
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-800">
      <span className="text-3xl" aria-hidden="true">{cat.icon}</span>
      <div>
        <h1 className="text-xl font-bold text-gray-100">{cat.name[language] || cat.name.pt}</h1>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-300">{categoryStats[cat.id] || 0}</span>{' '}
          {t('toolsVerified')}
        </p>
      </div>
    </div>
  )
}

// ── Virtual page loader (Intersection Observer) ──────────────────────────────
function usePagedTools(tools) {
  const [page, setPage] = useState(1)
  const sentinelRef = useRef(null)

  // Reset pagination whenever the tool list changes
  useEffect(() => { setPage(1) }, [tools])

  const loadMore = useCallback(() => {
    setPage(p => {
      if (p * PAGE_SIZE >= tools.length) return p
      return p + 1
    })
  }, [tools.length])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore()
    }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  const visible = tools.slice(0, page * PAGE_SIZE)
  const hasMore  = visible.length < tools.length

  return { visible, hasMore, sentinelRef }
}

// ── Main tool list renderer ───────────────────────────────────────────────────
function ToolList() {
  const { filteredTools, viewMode, loading, t } = useApp()
  const { visible, hasMore, sentinelRef } = usePagedTools(filteredTools)

  const { selectedCategory, searchQuery, showFavoritesOnly } = useApp()
  const isIdle = !selectedCategory && !searchQuery.trim() && !showFavoritesOnly

  if (loading && filteredTools.length === 0) return <LoadingSkeleton />
  if (isIdle) return <WelcomeState />
  if (filteredTools.length === 0) return <EmptyState />

  const renderGrid = () => (
    <div
      role="list"
      aria-label={t('allTools')}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {visible.map(tool => (
        <div key={tool.id} role="listitem">
          <ToolCard tool={tool} />
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div role="list" aria-label={t('allTools')} className="space-y-2">
      {visible.map(tool => (
        <div key={tool.id} role="listitem">
          <ToolListItem tool={tool} />
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {viewMode === 'grid'    && renderGrid()}
      {viewMode === 'list'    && renderList()}
      {viewMode === 'table'   && <ToolTable tools={filteredTools} />}
      {viewMode === 'tree'    && <ToolTree  tools={filteredTools} />}
      {viewMode === 'compact' && <ToolCompact tools={filteredTools} />}

      {/* Infinite scroll sentinel */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <div ref={sentinelRef} aria-hidden="true" className="h-8 mt-4 flex items-center justify-center">
          {hasMore && (
            <Loader2 size={18} className="text-gray-600 animate-spin" />
          )}
        </div>
      )}

      {/* Screen-reader result count */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredTools.length} {t('results')}
      </div>
    </div>
  )
}

// ── Main content area ────────────────────────────────────────────────────────
function MainContent() {
  return (
    <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
      <StatsBar />
      <div className="p-4 md:p-5">
        <CategoryHeader />
        <ToolList />
      </div>
    </main>
  )
}

// ── Toast notification ───────────────────────────────────────────────────────
function Toast() {
  const { toast } = useApp()
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
    >
      {toast && (
        <div className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl animate-fade-in ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── Copyright footer ────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useApp()
  return (
    <footer className="flex-shrink-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 bg-gray-950 border-t border-gray-800/60 text-xs text-gray-500">
      <span>© {new Date().getFullYear()} Juan Mathews Rebello Santos</span>
      <a
        href="https://juanmathewsrebellosantos.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-indigo-400 transition-colors underline underline-offset-2"
        aria-label={`${t('footerSite')} — Juan Mathews Rebello Santos`}
      >
        juanmathewsrebellosantos.com
      </a>
      <a
        href="https://www.linkedin.com/in/juan-mathews-rebello-santos-/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-indigo-400 transition-colors underline underline-offset-2"
        aria-label="LinkedIn — Juan Mathews Rebello Santos"
      >
        LinkedIn
      </a>
    </footer>
  )
}

// ── App shell ────────────────────────────────────────────────────────────────
function AppInner() {
  const { t, language } = useApp()
  const [page, setPage] = useState('home')

  useSEO({
    title: t('seoTitle'),
    description: t('seoDesc'),
    keywords: t('seoKeywords'),
    language,
  })

  return (
    <>
      {page === 'tools' && <a href="#main-content" className="skip-link">{t('skipToContent')}</a>}

      <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
        <Header page={page} onNavigate={setPage} />

        {page === 'home' ? (
          <LandingPage onEnter={() => setPage('tools')} />
        ) : (
          <div id="main-content" className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MainContent />
          </div>
        )}

        <Footer />
      </div>

      {page === 'tools' && <Toast />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
