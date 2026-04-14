import React, { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories.js'
import { getFaviconUrl } from '../utils/favicon.js'
import StatusBadge from './StatusBadge.jsx'
import FavoriteButton from './FavoriteButton.jsx'

export default function ToolListItem({ tool }) {
  const { language, t } = useApp()
  const [imgError, setImgError] = useState(false)

  const cat = CATEGORIES.find(c => c.id === tool.category)
  const colors = cat ? CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.slate : CATEGORY_COLORS.slate
  const desc = tool.description?.[language] || tool.description?.en || tool.description?.pt || ''
  const faviconUrl = getFaviconUrl(tool.url)

  return (
    <article
      className="flex items-center gap-3 px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 transition-all group animate-fade-in"
      aria-label={`${tool.name}${desc ? ` — ${desc.slice(0, 80)}` : ''}`}
    >
      {/* Favicon */}
      <div className="flex-shrink-0">
        {faviconUrl && !imgError ? (
          <img src={faviconUrl} alt="" className="w-5 h-5 rounded object-contain" onError={() => setImgError(true)} />
        ) : (
          <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-400">
            {tool.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-100 truncate">{tool.name}</span>
        </div>
        {desc && <p className="text-xs text-gray-500 truncate mt-0.5">{desc}</p>}
      </div>

      {/* Category */}
      {cat && (
        <span className={`badge ${colors.bg} ${colors.text} hidden md:inline-flex flex-shrink-0`}>
          {cat.icon} <span className="hidden lg:inline">{cat.name[language] || cat.name.pt}</span>
        </span>
      )}

      {/* Status */}
      <div className="flex-shrink-0">
        <StatusBadge status={tool.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <FavoriteButton toolId={tool.id} />
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          aria-label={`${t('openTool')}: ${tool.name}`}
          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
          <ExternalLink size={13} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
