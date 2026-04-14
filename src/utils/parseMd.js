const SECTION_MAP = {
  'general search': 'general-search',
  'google dorks tools': 'specialty-search',
  'google dorks': 'specialty-search',
  'main national search engines': 'national-search',
  'meta search': 'meta-search',
  'privacy focused search engines': 'general-search',
  'data breach search engines': 'leaks-breaches',
  'databreach search engines': 'leaks-breaches',
  'speciality search engines': 'specialty-search',
  'specialty search engines': 'specialty-search',
  'dark web search engines': 'darkweb-search',
  'visual search and clustering search engines': 'visual-search',
  'similar sites search': 'similar-sites',
  'document and slides search': 'document-search',
  'threat actor search': 'threat-actor',
  'live cyber threat maps': 'threat-maps',
  'file search': 'file-search',
  'pastebins': 'pastebins',
  'code search': 'code-search',
  'major social networks': 'social-networks',
  'real-time search, social media search, and general social media tools': 'social-media-tools',
  'social media tools': 'social-media-tools',
  'twitter': 'twitter',
  'facebook': 'facebook',
  'instagram': 'instagram',
  'pinterest': 'pinterest',
  'reddit': 'reddit',
  'vkontakte': 'vkontakte',
  'tumblr': 'tumblr',
  'linkedin': 'linkedin',
  'telegram': 'telegram',
  'steam': 'steam',
  'github': 'code-search',
  'whatsapp': 'social-networks',
  'blog search': 'blog-search',
  'forums and discussion boards search': 'forums',
  'username check': 'username-check',
  'people investigations': 'people-search',
  'email search / email check': 'email-lookup',
  'email search': 'email-lookup',
  'phone number research': 'phone-lookup',
  'vehicle / automobile research': 'other-tools',
  'expert search': 'people-search',
  'company research': 'company-business',
  'job search resources': 'company-business',
  'q&a sites': 'forums',
  'domain and ip research': 'domain-ip',
  'keywords discovery and research': 'specialty-search',
  'web history and website capture': 'archives',
  'language tools': 'other-tools',
  'image search': 'visual-search',
  'image analysis': 'image-video',
  'video search and other video tools': 'image-video',
  'academic resources and grey literature': 'document-search',
  'geospatial research and mapping tools': 'geospatial',
  'news': 'news-media',
  'news digest and discovery tools': 'news-media',
  'fact checking': 'news-media',
  'data and statistics': 'specialty-search',
  'web monitoring': 'web-monitoring',
  'browsers': 'browsers',
  'offline browsing': 'offline-browsing',
  'vpn services': 'vpn',
  'infographics and data visualization': 'infographics',
  'social network analysis': 'social-network-analysis',
  'privacy and encryption tools': 'privacy-encryption',
  'dns': 'dns',
  'maritime': 'maritime',
  'other tools': 'other-tools',
  'threat intelligence': 'threat-intelligence',
  'gaming platforms': 'other-tools',
  'music streaming services': 'other-tools',
  'osint videos': 'osint-videos',
  'osint blogs': 'osint-blogs',
  'osint rss feeds': 'osint-blogs',
  'other resources': 'other-resources',
  'related awesome lists': 'awesome-lists',
}

function resolveCategory(heading) {
  const clean = heading
    .replace(/\[↑\]\([^)]*\)\s*/gi, '')
    .replace(/^\[.*?\]\s*/, '')
    .trim()
    .toLowerCase()
  if (SECTION_MAP[clean]) return SECTION_MAP[clean]
  for (const [key, cat] of Object.entries(SECTION_MAP)) {
    if (clean.includes(key)) return cat
  }
  return null
}

function makeId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'tool'
}

export function parseMD(md) {
  const tools    = []
  const idCount  = new Map()
  const seenUrls = new Set()
  const TOOL_RE  = /^\*+\s*\[([^\]]+)\]\(([^)\s]+)\)(.*)?$/
  let currentCategory = 'other-tools'

  for (const raw of md.split('\n')) {
    const line = raw.trim()

    if (/^##\s/.test(line)) {
      const cat = resolveCategory(line.replace(/^##\s+/, ''))
      if (cat) currentCategory = cat
      continue
    }
    if (/^###\s/.test(line)) {
      const cat = resolveCategory(line.replace(/^###\s+/, ''))
      if (cat) currentCategory = cat
      continue
    }

    const m = line.match(TOOL_RE)
    if (!m) continue

    const [, rawName, url, rest] = m
    if (!url.startsWith('http') || seenUrls.has(url)) continue
    seenUrls.add(url)

    const name = rawName.replace(/\*\*/g, '').trim()
    const description = (rest || '')
      .replace(/^\s*[-—–]\s*/, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()

    const base = makeId(name)
    const n    = idCount.get(base) || 0
    idCount.set(base, n + 1)
    const id   = n === 0 ? base : `${base}-${n + 1}`

    const desc = description || name
    tools.push({
      id, name, url,
      category: currentCategory,
      status: 'unknown',
      description: { pt: desc, en: desc, es: desc },
      tags: [],
    })
  }
  return tools
}
