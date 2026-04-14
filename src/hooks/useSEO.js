import { useEffect } from 'react'

const SITE_URL = 'https://osint.juanmathewsrebellosantos.com'

const LOCALE_MAP = {
  pt: 'pt_BR', en: 'en_US', es: 'es_ES', fr: 'fr_FR', de: 'de_DE',
  it: 'it_IT', nl: 'nl_NL', ru: 'ru_RU', zh: 'zh_CN', ja: 'ja_JP',
  ko: 'ko_KR', ar: 'ar_SA', hi: 'hi_IN', bn: 'bn_BD', tr: 'tr_TR',
  pl: 'pl_PL', sv: 'sv_SE', no: 'no_NO', da: 'da_DK', fi: 'fi_FI',
  cs: 'cs_CZ', ro: 'ro_RO', hu: 'hu_HU', el: 'el_GR', uk: 'uk_UA',
  th: 'th_TH', vi: 'vi_VN', id: 'id_ID', ms: 'ms_MY', fa: 'fa_IR',
}

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

export function useSEO({ title, description, keywords, language }) {
  useEffect(() => {
    if (!title) return

    // Title
    document.title = title

    // Primary meta
    setMeta('description', description)
    setMeta('keywords', keywords)
    setMeta('language', language?.toUpperCase() || 'PT')

    // OG tags
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', `${SITE_URL}/?lang=${language}`, 'property')
    setMeta('og:locale', LOCALE_MAP[language] || 'pt_BR', 'property')

    // Twitter
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    // html lang + dir already managed by AppContext
  }, [title, description, keywords, language])
}
