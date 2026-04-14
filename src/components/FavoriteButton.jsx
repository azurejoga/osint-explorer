import React from 'react'
import { Star } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function FavoriteButton({ toolId, className = '' }) {
  const { favorites, toggleFavorite, t } = useApp()
  const isFav = favorites.has(toolId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(toolId)
  }

  return (
    <button
      onClick={handleClick}
      title={t('toggleFavorite')}
      className={`p-1.5 rounded-lg transition-all duration-150 ${
        isFav
          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-500/15'
          : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10'
      } ${className}`}
    >
      <Star size={14} className={isFav ? 'fill-current' : ''} />
    </button>
  )
}
