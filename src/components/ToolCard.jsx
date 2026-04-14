import React, { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories.js'
import { getFaviconUrl } from '../utils/favicon.js'
import StatusBadge from './StatusBadge.jsx'
import FavoriteButton from './FavoriteButton.jsx'

// ISO 3166-1 alpha-2 → emoji flag
const flag = (code) => {
  if (!code) return null
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
  )
}

export default function ToolCard({ tool }) {
  const { language, t } = useApp()
  const [imgError, setImgError] = useState(false)

  const cat = CATEGORIES.find(c => c.id === tool.category)
  const colors = cat ? CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.slate : CATEGORY_COLORS.slate
  const desc = tool.description?.[language] || tool.description?.en || tool.description?.pt || ''
  const faviconUrl = getFaviconUrl(tool.url)

  const flagEmoji = flag(tool.countryCode)

  return (
    <article
      aria-label={tool.name}
      className="relative group bg-gray-900 border border-gray-800 rounded-xl p-4 card-hover flex flex-col gap-3 animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {faviconUrl && !imgError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-5 h-5 rounded flex-shrink-0 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-5 h-5 rounded bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs">
              {tool.name.charAt(0)}
            </div>
          )}
          <h3 className="font-semibold text-sm text-gray-100 truncate leading-tight">
            {flagEmoji && <span aria-label={tool.countryCode} className="mr-1">{flagEmoji}</span>}
            {tool.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <FavoriteButton toolId={tool.id} />
        </div>
      </div>

      {/* Category + Status */}
      <div className="flex items-center gap-2 flex-wrap">
        {cat && (
          <span className={`badge ${colors.bg} ${colors.text} ${colors.border}`}>
            <span>{cat.icon}</span>
            <span className="truncate max-w-[120px]">{cat.name[language] || cat.name.pt}</span>
          </span>
        )}
        <StatusBadge status={tool.status} />
      </div>

      {/* Description */}
      {desc && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 flex-1">{desc}</p>
      )}

      {/* Tags */}
      {tool.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 4).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 bg-gray-800 text-gray-500 text-xs rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Link */}
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('openTool')}: ${tool.name}`}
        className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-auto pt-2 border-t border-gray-800/80 truncate"
      >
        <ExternalLink size={11} className="flex-shrink-0" aria-hidden="true" />
        <span className="truncate">{tool.url.replace(/^https?:\/\//, '')}</span>
      </a>
    </article>
  )
}
