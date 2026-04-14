import React, { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories.js'
import StatusBadge from './StatusBadge.jsx'
import FavoriteButton from './FavoriteButton.jsx'

function ToolNode({ tool }) {
  const { language } = useApp()
  const desc = tool.description?.[language] || tool.description?.en || ''
  return (
    <div className="flex items-center gap-2 pl-8 py-1.5 hover:bg-gray-800/40 rounded-lg group transition-colors">
      <StatusBadge status={tool.status} small />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1 truncate">{tool.name}</span>
      {desc && <span className="text-xs text-gray-600 truncate max-w-xs hidden lg:block">{desc}</span>}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton toolId={tool.id} />
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          className="p-1 rounded text-gray-500 hover:text-indigo-400 transition-colors">
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

function CategoryNode({ category, tools }) {
  const { language, t } = useApp()
  const [open, setOpen] = useState(true)
  const colors = CATEGORY_COLORS[category.color] || CATEGORY_COLORS.slate

  return (
    <div className="mb-1 animate-fade-in">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-all text-left group`}
      >
        {open ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
        <span className="text-lg leading-none">{category.icon}</span>
        <span className={`font-medium text-sm ${colors.text}`}>{category.name[language] || category.name.pt}</span>
        <span className="ml-auto text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{tools.length}</span>
      </button>
      {open && (
        <div className="ml-2 border-l border-gray-800 pl-2 py-1">
          {tools.map(tool => <ToolNode key={tool.id} tool={tool} />)}
        </div>
      )}
    </div>
  )
}

export default function ToolTree({ tools }) {
  const { t } = useApp()

  const grouped = useMemo(() => {
    const groups = {}
    tools.forEach(tool => {
      if (!groups[tool.category]) groups[tool.category] = []
      groups[tool.category].push(tool)
    })
    return groups
  }, [tools])

  const [allOpen, setAllOpen] = useState(true)

  return (
    <div>
      <div className="flex justify-end mb-3 gap-2">
        <button onClick={() => setAllOpen(true)} className="btn btn-ghost text-xs">{t('expandAll')}</button>
        <button onClick={() => setAllOpen(false)} className="btn btn-ghost text-xs">{t('collapseAll')}</button>
      </div>
      <div className="space-y-1">
        {CATEGORIES.filter(cat => grouped[cat.id]).map(cat => (
          <CategoryNode
            key={cat.id}
            category={cat}
            tools={grouped[cat.id]}
          />
        ))}
        {/* Custom categories not in CATEGORIES list */}
        {Object.entries(grouped)
          .filter(([catId]) => !CATEGORIES.find(c => c.id === catId))
          .map(([catId, catTools]) => (
            <CategoryNode
              key={catId}
              category={{ id: catId, icon: '🔧', color: 'slate', name: { pt: catId, en: catId, es: catId } }}
              tools={catTools}
            />
          ))
        }
      </div>
    </div>
  )
}
