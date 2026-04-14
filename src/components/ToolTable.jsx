import React, { useState } from 'react'
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories.js'
import { getFaviconUrl } from '../utils/favicon.js'
import StatusBadge from './StatusBadge.jsx'
import FavoriteButton from './FavoriteButton.jsx'

function Row({ tool }) {
  const { language, t } = useApp()
  const [imgError, setImgError] = useState(false)
  const cat = CATEGORIES.find(c => c.id === tool.category)
  const colors = cat ? CATEGORY_COLORS[cat.color] || CATEGORY_COLORS.slate : CATEGORY_COLORS.slate
  const desc = tool.description?.[language] || tool.description?.en || tool.description?.pt || ''
  const faviconUrl = getFaviconUrl(tool.url)

  return (
    <tr className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {faviconUrl && !imgError
            ? <img src={faviconUrl} alt="" className="w-4 h-4 rounded object-contain flex-shrink-0" onError={() => setImgError(true)} />
            : <div className="w-4 h-4 rounded bg-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">{tool.name.charAt(0)}</div>
          }
          <span className="font-medium text-sm text-gray-100 whitespace-nowrap">{tool.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-xs text-gray-400 max-w-xs truncate">{desc}</p>
      </td>
      <td className="px-4 py-3">
        {cat && (
          <span className={`badge ${colors.bg} ${colors.text} whitespace-nowrap`}>
            {cat.icon} <span className="hidden xl:inline">{cat.name[language] || cat.name.pt}</span>
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={tool.status} />
      </td>
      <td className="px-4 py-3">
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 truncate max-w-[150px] inline-block">
          {tool.url.replace(/^https?:\/\//, '')}
        </a>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <FavoriteButton toolId={tool.id} />
          <a href={tool.url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all">
            <ExternalLink size={12} />
          </a>
        </div>
      </td>
    </tr>
  )
}

export default function ToolTable({ tools }) {
  const { t, language, sortBy, setSortBy } = useApp()
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortDir('asc') }
  }

  const sorted = [...tools].sort((a, b) => {
    let av, bv
    if (sortBy === 'name') { av = a.name; bv = b.name }
    else if (sortBy === 'status') { av = a.status; bv = b.status }
    else if (sortBy === 'category') { av = a.category; bv = b.category }
    else { return 0 }
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const Th = ({ field, label, className = '' }) => {
    const active = sortBy === field
    return (
      <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-200 transition-colors ${className}`}
        onClick={() => handleSort(field)}>
        <div className="flex items-center gap-1">
          {label}
          {active ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
        </div>
      </th>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900/80">
          <tr>
            <Th field="name" label={t('name')} />
            <Th field="name" label={t('description')} className="hidden lg:table-cell" />
            <Th field="category" label={t('category')} />
            <Th field="status" label={t('status')} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">URL</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="bg-gray-900/50">
          {sorted.map(tool => <Row key={tool.id} tool={tool} />)}
        </tbody>
      </table>
    </div>
  )
}
