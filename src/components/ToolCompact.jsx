import React from 'react'
import { ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import StatusBadge from './StatusBadge.jsx'
import FavoriteButton from './FavoriteButton.jsx'

export default function ToolCompact({ tools }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
      {tools.map(tool => <CompactItem key={tool.id} tool={tool} />)}
    </div>
  )
}

function CompactItem({ tool }) {
  const { language } = useApp()
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/60 group transition-colors">
      <StatusBadge status={tool.status} small />
      <span className="text-sm text-gray-300 truncate flex-1 group-hover:text-white transition-colors">{tool.name}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton toolId={tool.id} />
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          className="p-1 rounded text-gray-500 hover:text-indigo-400 transition-colors">
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}
