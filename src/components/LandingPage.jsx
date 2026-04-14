import { useApp } from '../context/AppContext'
import { Shield, Zap, Globe, Laptop, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function StatCard({ value, label, color = 'text-indigo-400' }) {
  return (
    <div className="flex flex-col items-center bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 min-w-[130px]">
      <span className={`text-3xl font-extrabold tabular-nums ${color}`}>{value}</span>
      <span className="text-xs text-gray-500 mt-1 text-center">{label}</span>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="flex flex-col gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-700 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-gray-100 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-200 hover:bg-gray-800/50 transition-colors"
      >
        {q}
        {open ? <ChevronUp size={16} className="text-indigo-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-gray-800 pt-3">{a}</div>}
    </div>
  )
}

export default function LandingPage({ onEnter }) {
  const { t, stats } = useApp()

  const features = [
    { icon: Zap,    title: t('landingAutoUpdate'),     desc: t('landingAutoUpdateDesc'),     color: 'bg-yellow-500/20 text-yellow-400' },
    { icon: Globe,  title: t('landingMultiLang'),       desc: t('landingMultiLangDesc'),       color: 'bg-blue-500/20 text-blue-400'   },
    { icon: Star,   title: t('landingFree'),            desc: t('landingFreeDesc'),            color: 'bg-green-500/20 text-green-400' },
    { icon: Laptop, title: t('landingMultiPlatform'),   desc: t('landingMultiPlatformDesc'),   color: 'bg-purple-500/20 text-purple-400' },
  ]

  const faqs = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
  ]

  return (
    <main className="flex-1 overflow-y-auto bg-gray-950 text-gray-100">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-700/10 blur-3xl rounded-full" />
        </div>
        <div className="text-6xl mb-4" aria-hidden>🕵️</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-3xl mb-4">
          {t('landingHero')}
        </h1>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mb-8 leading-relaxed">
          {t('landingSubhero')}
        </p>
        <button
          onClick={onEnter}
          className="btn btn-primary text-base px-8 py-3 rounded-xl shadow-lg shadow-indigo-900/40 hover:scale-105 transition-transform"
        >
          {t('landingCTA')} →
        </button>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <StatCard value={`+${(stats.total || 1377).toLocaleString()}`} label={t('toolsVerified')} color="text-indigo-400" />
          <StatCard value="+30"  label={t('landingMultiLang')}    color="text-blue-400"   />
          <StatCard value="100%" label={t('landingFree')}          color="text-green-400"  />
          <StatCard value="3"    label={t('landingMultiPlatform')} color="text-purple-400" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-gray-300 text-center mb-8">{t('landingStats')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        <h2 className="text-lg font-bold text-gray-300 text-center mb-6">{t('landingFaq')}</h2>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
        </div>
      </section>
    </main>
  )
}
