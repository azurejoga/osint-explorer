import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES } from '../data/categories.js'

export default function AddToolModal() {
  const { setShowAddModal, addCustomTool, t, language, allTools, showToast } = useApp()

  const [form, setForm] = useState({
    name: '', url: '', category: 'other-tools', status: 'unknown',
    descPt: '', descEn: '', descEs: '', tags: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = t('required')
    if (!form.url.trim()) errs.url = t('required')
    else {
      try { new URL(form.url) }
      catch { errs.url = t('invalidUrl') }
    }
    if (allTools.some(t => t.url === form.url.trim())) errs.url = t('toolExists')
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const tags = form.tags.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
    addCustomTool({
      name: form.name.trim(),
      url: form.url.trim(),
      category: form.category,
      status: form.status,
      description: {
        pt: form.descPt.trim() || form.descEn.trim() || form.descEs.trim(),
        en: form.descEn.trim() || form.descPt.trim() || form.descEs.trim(),
        es: form.descEs.trim() || form.descPt.trim() || form.descEn.trim(),
      },
      tags,
    })
    showToast(t('toolAdded'))
    setShowAddModal(false)
  }

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: undefined })) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="font-semibold text-lg text-gray-100 flex items-center gap-2">
            <Plus size={18} className="text-indigo-400" />
            {t('addCustomTool')}
          </h2>
          <button onClick={() => setShowAddModal(false)} className="btn btn-ghost p-1.5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-4 space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{t('toolName')} *</label>
              <input className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder={t('toolNamePlaceholder')} value={form.name} onChange={set('name')} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">URL *</label>
              <input className={`input w-full ${errors.url ? 'border-red-500' : ''}`}
                placeholder={t('toolUrlPlaceholder')} value={form.url} onChange={set('url')} />
              {errors.url && <p className="text-xs text-red-400 mt-1">{errors.url}</p>}
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t('toolCategory')}</label>
                <select className="input w-full" value={form.category} onChange={set('category')}>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name[language] || cat.name.pt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{t('toolStatus')}</label>
                <select className="input w-full" value={form.status} onChange={set('status')}>
                  <option value="online">{t('statusOnline')}</option>
                  <option value="offline">{t('statusOffline')}</option>
                  <option value="unknown">{t('statusUnknown')}</option>
                </select>
              </div>
            </div>

            {/* Description PT */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {t('toolDescription')} 🇧🇷 PT
              </label>
              <textarea className="input w-full resize-none" rows={2}
                placeholder={t('toolDescPlaceholder')} value={form.descPt} onChange={set('descPt')} />
            </div>

            {/* Description EN */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {t('toolDescription')} 🇺🇸 EN
              </label>
              <textarea className="input w-full resize-none" rows={2}
                placeholder="Briefly describe the tool..." value={form.descEn} onChange={set('descEn')} />
            </div>

            {/* Description ES */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {t('toolDescription')} 🇪🇸 ES
              </label>
              <textarea className="input w-full resize-none" rows={2}
                placeholder="Describe brevemente la herramienta..." value={form.descEs} onChange={set('descEs')} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">{t('toolTags')}</label>
              <input className="input w-full"
                placeholder={t('toolTagsPlaceholder')} value={form.tags} onChange={set('tags')} />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-ghost">
            {t('cancel')}
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            <Plus size={14} />
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
