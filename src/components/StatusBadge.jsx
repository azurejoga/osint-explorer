import React from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function StatusBadge({ status, small = false }) {
  const { t } = useApp()
  const map = {
    online:  { cls: 'badge-online',   dot: 'bg-green-400',  label: t('statusOnline') },
    offline: { cls: 'badge-offline',  dot: 'bg-red-400',    label: t('statusOffline') },
    unknown: { cls: 'badge-unknown',  dot: 'bg-yellow-400', label: t('statusUnknown') },
  }
  const { cls, dot, label } = map[status] || map.unknown

  if (small) {
    return (
      <span title={label} className={`inline-block w-2 h-2 rounded-full ${dot}`} />
    )
  }

  return (
    <span className={`badge ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  )
}
