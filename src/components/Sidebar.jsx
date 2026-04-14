import React, { useState } from 'react'
import { Search, Star, X, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories.js'

// ── Category groups (accordion sections) ─────────────────────────────────────
const GL = (pt, en, es, fr, de, it, nl, ru, zh, ja, ko, ar) => ({ pt, en, es, fr, de, it, nl, ru, zh, ja, ko, ar })

const GROUPS = [
  {
    id: 'search', icon: '🔍',
    label: GL('Busca','Search','Búsqueda','Recherche','Suche','Ricerca','Zoeken','Поиск','搜索','検索','검색','بحث'),
    ids: ['general-search','national-search','meta-search','specialty-search','darkweb-search','visual-search','similar-sites','file-search'],
  },
  {
    id: 'documents', icon: '📄',
    label: GL('Documentos & Código','Documents & Code','Documentos & Código','Documents & Code','Dokumente & Code','Documenti & Codice','Documenten & Code','Документы & код','文档与代码','ドキュメント & コード','문서 & 코드','مستندات و كود'),
    ids: ['document-search','code-search','pastebins'],
  },
  {
    id: 'social', icon: '👥',
    label: GL('Redes Sociais','Social Media','Redes Sociales','Réseaux Sociaux','Soziale Medien','Social Media','Sociale Media','Соцсети','社交媒体','ソーシャルメディア','소셜 미디어','وسائل تواصل اجتماعي'),
    ids: ['social-networks','social-media-tools','twitter','facebook','instagram','pinterest','reddit','vkontakte','tumblr','telegram','steam','linkedin','blog-search','forums','username-check'],
  },
  {
    id: 'security', icon: '🛡',
    label: GL('Segurança & Ameaças','Security & Threats','Seguridad & Amenazas','Sécurité & Menaces','Sicherheit & Bedrohungen','Sicurezza & Minacce','Beveiliging & Bedreigingen','Безопасность','安全与威胁','セキュリティ & 脅威','보안 & 위협','أمن وتهديدات'),
    ids: ['threat-actor','threat-maps','threat-intelligence','privacy-encryption','vpn','malware-analysis'],
  },
  {
    id: 'network', icon: '🖧',
    label: GL('Rede & Infraestrutura','Network & Infra','Red & Infraestructura','Réseau & Infra','Netzwerk & Infra','Rete & Infra','Netwerk & Infra','Сеть & Инфра','网络与基础设施','ネットワーク & インフラ','네트워크 & 인프라','شبكة وبنية تحتية'),
    ids: ['domain-ip','dns','web-monitoring','browsers','offline-browsing','maritime'],
  },
  {
    id: 'people', icon: '🧑',
    label: GL('Pessoas & Contatos','People & Contacts','Personas & Contactos','Personnes & Contacts','Personen & Kontakte','Persone & Contatti','Personen & Contacten','Люди & Контакты','人物与联系','人物 & 連絡先','인물 & 연락처','أشخاص وجهات اتصال'),
    ids: ['people-search','phone-lookup','email-lookup'],
  },
  {
    id: 'geospatial', icon: '🛰',
    label: GL('Geoespacial','Geospatial','Geoespacial','Géospatial','Georäumlich','Geospaziale','Geospatiaal','Геопространственный','地理空间','地理空間','지리공간','جغرافي مكاني'),
    ids: ['geospatial'],
  },
  {
    id: 'media', icon: '🖼',
    label: GL('Mídia & Análise','Media & Analysis','Media & Análisis','Médias & Analyse','Medien & Analyse','Media & Analisi','Media & Analyse','Медиа & Анализ','媒体与分析','メディア & 分析','미디어 & 분석','إعلام وتحليل'),
    ids: ['image-video','infographics','social-network-analysis','osint-videos'],
  },
  {
    id: 'leaks', icon: '💧',
    label: GL('Vazamentos & Cache','Leaks & Cache','Filtraciones & Caché','Fuites & Cache','Leaks & Cache','Fughe & Cache','Lekken & Cache','Утечки & Кэш','泄露与缓存','漏洎 & キャッシュ','유침 & 캐시','تسريبات وذاكرة تخزين'),
    ids: ['leaks-breaches','archives','digital-footprint'],
  },
  {
    id: 'news', icon: '📰',
    label: GL('Notícias & Mídia','News & Media','Noticias & Medios','Actualités & Médias','Nachrichten & Medien','Notizie & Media','Nieuws & Media','Новости & СМИ','新闻与媒体','ニュース & メディア','뉴스 & 미디어','أخبار وإعلام'),
    ids: ['news-media'],
  },
  {
    id: 'business', icon: '🏢',
    label: GL('Empresas & Negócios','Business','Empresas & Negocios','Entreprises & Business','Unternehmen & Business','Aziende & Business','Bedrijven & Business','Бизнес','企业与商业','ビジネス','비즈니스','أعمال وشركات'),
    ids: ['company-business','financial-intel'],
  },
  {
    id: 'resources', icon: '🧰',
    label: GL('Recursos & Ferramentas','Resources & Tools','Recursos & Herramientas','Ressources & Outils','Ressourcen & Tools','Risorse & Strumenti','Bronnen & Tools','Ресурсы & Инструменты','资源与工具','リソース & ツール','리소스 & 도구','موارد وأدوات'),
    ids: ['other-tools','other-resources','awesome-lists','osint-blogs','osint-frameworks','ai-ml'],
  },
]

// Items not assigned to any group fall into a catch-all
const ASSIGNED_IDS = new Set(GROUPS.flatMap(g => g.ids))

export default function Sidebar() {
  const {
    t, language,
    selectedCategory, setSelectedCategory,
    showFavoritesOnly, setShowFavoritesOnly,
    sidebarOpen, setSidebarOpen,
    categoryStats, stats,
  } = useApp()

  const [catSearch,    setCatSearch]    = useState('')
  const [openGroups,   setOpenGroups]   = useState(() => new Set([...GROUPS.map(g => g.id), '_misc']))

  const toggleGroup = (gid) => {
    setOpenGroups(prev => {
      const next = new Set(prev)
      next.has(gid) ? next.delete(gid) : next.add(gid)
      return next
    })
  }

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId === selectedCategory ? null : catId)
    setShowFavoritesOnly(false)
  }

  const handleFavoritesClick = () => {
    setShowFavoritesOnly(!showFavoritesOnly)
    setSelectedCategory(null)
  }

  // Build the flat list when user is searching (bypass groups)
  const isSearching = catSearch.trim().length > 0
  const allCatsWithTools = CATEGORIES.filter(c => (categoryStats[c.id] || 0) > 0)
  const catName = (c) => c.name[language] ?? c.name.en ?? c.name.pt

  const searchResults = isSearching
    ? allCatsWithTools.filter(c => catName(c).toLowerCase().includes(catSearch.toLowerCase()))
    : []

  // Helper: render one category button
  const CatButton = ({ cat }) => {
    const colors   = CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.slate
    const isActive = selectedCategory === cat.id
    const count    = categoryStats[cat.id] || 0
    return (
      <button
        key={cat.id}
        onClick={() => handleCategoryClick(cat.id)}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`${catName(cat)} — ${count} ${t('toolsVerified')}`}
        className={`sidebar-item w-full ${isActive ? 'active' : 'text-gray-400'}`}
      >
        <span className="text-base leading-none" aria-hidden="true">{cat.icon}</span>
        <span className={`flex-1 text-left text-sm truncate ${isActive ? colors.text : ''}`}>
          {catName(cat)}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            isActive ? `${colors.bg} ${colors.text}` : 'bg-gray-800 text-gray-500'
          }`}
          aria-hidden="true"
        >
          {count}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Mobile overlay — hidden on desktop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar-nav"
        role="navigation"
        aria-label={t('categories')}
        aria-hidden={undefined}
        className={`
          fixed top-0 left-0 z-30 h-full
          lg:static lg:top-auto lg:left-auto lg:z-auto
          w-72 flex-shrink-0 bg-gray-950 border-r border-gray-800
          flex flex-col overflow-hidden
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <span className="font-semibold text-sm text-gray-200">{t('categories')}</span>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label={t('close')}
            className="btn btn-ghost p-1.5 lg:hidden"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">

          {/* All tools */}
          <button
            onClick={() => { setSelectedCategory(null); setShowFavoritesOnly(false) }}
            aria-current={!selectedCategory && !showFavoritesOnly ? 'page' : undefined}
            className={`sidebar-item w-full ${!selectedCategory && !showFavoritesOnly ? 'active' : 'text-gray-400'}`}
          >
            <span aria-hidden="true">🔭</span>
            <span className="flex-1 text-left">{t('allTools')}</span>
            <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full" aria-label={`${stats.total} ${t('toolsVerified')}`}>
              {stats.total}
            </span>
          </button>

          {/* Favorites */}
          <button
            onClick={handleFavoritesClick}
            aria-pressed={showFavoritesOnly}
            aria-current={showFavoritesOnly ? 'page' : undefined}
            className={`sidebar-item w-full ${showFavoritesOnly ? 'active' : 'text-gray-400'}`}
          >
            <Star size={14} className={showFavoritesOnly ? 'text-yellow-400 fill-current' : ''} aria-hidden="true" />
            <span className="flex-1 text-left">{t('favorites')}</span>
            <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full" aria-hidden="true">
              {stats.favorites}
            </span>
          </button>

          {/* Category search */}
          <div className="pt-3 pb-1">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 mb-2" aria-hidden="true">
              {t('categories')}
            </p>
            <div className="relative">
              <label htmlFor="cat-search" className="sr-only">{t('searchShort')} {t('categories')}</label>
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                id="cat-search"
                type="search"
                className="w-full bg-gray-800/60 border border-gray-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                placeholder={t('searchShort')}
                value={catSearch}
                onChange={e => setCatSearch(e.target.value)}
                aria-label={`${t('searchShort')} ${t('categories')}`}
              />
            </div>
          </div>

          {/* ── Search mode: flat list ── */}
          {isSearching && (
            <ul role="list" aria-label={`${t('categories')} — ${searchResults.length} ${t('results')}`}>
              {searchResults.map(cat => (
                <li key={cat.id}><CatButton cat={cat} /></li>
              ))}
              {searchResults.length === 0 && (
                <li>
                  <p className="text-xs text-gray-600 text-center py-4">
                    {t('noToolsFound')}
                  </p>
                </li>
              )}
            </ul>
          )}

          {/* ── Browse mode: accordion groups ── */}
          {!isSearching && GROUPS.map(group => {
            const groupCats = group.ids
              .map(id => CATEGORIES.find(c => c.id === id))
              .filter(c => c && (categoryStats[c.id] || 0) > 0)

            if (groupCats.length === 0) return null

            const isOpen     = openGroups.has(group.id)
            const groupTotal = groupCats.reduce((sum, c) => sum + (categoryStats[c.id] || 0), 0)
            const hasActive  = groupCats.some(c => c.id === selectedCategory)
            const groupLabel = group.label[language] ?? group.label.en ?? group.label.pt

            return (
              <div key={group.id}>
                {/* Group header button */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isOpen}
                  aria-controls={`group-${group.id}`}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors
                    ${hasActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <span aria-hidden="true">{group.icon}</span>
                  <span className="flex-1 text-left">{groupLabel}</span>
                  <span className="text-gray-600 font-normal normal-case tracking-normal" aria-hidden="true">
                    {groupTotal}
                  </span>
                  <ChevronRight
                    size={12}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Group items */}
                {isOpen && (
                  <ul
                    id={`group-${group.id}`}
                    role="list"
                    aria-label={groupLabel}
                    className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-800 pl-2"
                  >
                    {groupCats.map(cat => (
                      <li key={cat.id}><CatButton cat={cat} /></li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}

          {/* ── Uncategorised (anything not in a group) ── */}
          {!isSearching && (() => {
            const loose = allCatsWithTools.filter(c => !ASSIGNED_IDS.has(c.id))
            if (loose.length === 0) return null
            const isOpen = openGroups.has('_misc')
            return (
              <div>
                <button
                  onClick={() => toggleGroup('_misc')}
                  aria-expanded={isOpen}
                  aria-controls="group-misc"
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <span aria-hidden="true">🧩</span>
                  <span className="flex-1 text-left">
                    {t('others')}
                  </span>
                  <ChevronRight size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
                </button>
                {isOpen && (
                  <ul id="group-misc" role="list" className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-800 pl-2">
                    {loose.map(cat => <li key={cat.id}><CatButton cat={cat} /></li>)}
                  </ul>
                )}
              </div>
            )
          })()}

        </div>
      </aside>
    </>
  )
}
