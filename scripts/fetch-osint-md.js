#!/usr/bin/env node
/**
 * fetch-osint-md.js
 * Fetches https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md,
 * parses its Markdown structure and writes public/data/tools.json.
 * Re-run any time to pull fresh tools from the upstream awesome-osint list.
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MD_URL  = 'https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md'
const OUT_PATH = path.resolve(__dirname, '../public/data/tools.json')

// ── Section heading → category ID mapping ─────────────────────────────────────
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
  // Strip Markdown anchor prefix like "[↑](#-table-of-contents) "
  const clean = heading
    .replace(/\[↑\]\([^)]*\)\s*/gi, '')
    .replace(/^\[.*?\]\s*/, '')
    .trim()
    .toLowerCase()

  if (SECTION_MAP[clean]) return SECTION_MAP[clean]

  // Fuzzy fallback: first key that the heading contains
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

// ── HTTP(S) fetch with redirect following ─────────────────────────────────────
function fetchText(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    const req = lib.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
        return resolve(fetchText(res.headers.location, maxRedirects - 1))
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(chunks.join('')))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.setTimeout(30_000, () => { req.destroy(); reject(new Error('Request timed out')) })
  })
}

// ── Markdown parser ────────────────────────────────────────────────────────────
function parseMD(md) {
  const tools   = []
  const idCount = new Map()
  const seenUrls = new Set()

  let currentCategory = 'other-tools'

  // Matches: * [Name](URL) optionally followed by space-dash/em-dash-space description
  const TOOL_RE = /^\*+\s*\[([^\]]+)\]\(([^)\s]+)\)(.*)?$/

  for (const raw of md.split('\n')) {
    const line = raw.trim()

    // ## Top-level section header
    if (/^##\s/.test(line)) {
      const heading = line.replace(/^##\s+/, '')
      const cat = resolveCategory(heading)
      if (cat) currentCategory = cat
      continue
    }

    // ### Sub-section header (Twitter, Facebook, etc.)
    if (/^###\s/.test(line)) {
      const heading = line.replace(/^###\s+/, '')
      const cat = resolveCategory(heading)
      if (cat) currentCategory = cat
      continue
    }

    const m = line.match(TOOL_RE)
    if (!m) continue

    const [, rawName, url, rest] = m
    if (!url.startsWith('http')) continue
    if (seenUrls.has(url)) continue
    seenUrls.add(url)

    const name = rawName.replace(/\*\*/g, '').trim()

    const description = (rest || '')
      .replace(/^\s*[-—–]\s*/, '')               // strip leading dash/em-dash
      .replace(/\*\*([^*]+)\*\*/g, '$1')          // un-bold
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // flatten nested links
      .trim()

    // Unique ID
    const base = makeId(name)
    const n    = idCount.get(base) || 0
    idCount.set(base, n + 1)
    const id   = n === 0 ? base : `${base}-${n + 1}`

    const desc = description || name
    tools.push({
      id,
      name,
      url,
      category: currentCategory,
      status: 'unknown',
      description: { pt: desc, en: desc, es: desc },
      tags: [],
    })
  }

  return tools
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('⏳ Fetching awesome-osint README from GitHub…')

  let md
  try {
    md = await fetchText(MD_URL)
    console.log(`   Received ${(md.length / 1024).toFixed(0)} KB`)
  } catch (err) {
    if (fs.existsSync(OUT_PATH)) {
      console.warn(`⚠️  Fetch failed (${err.message}) — keeping existing tools.json`)
      return
    }
    console.error('❌  Fetch failed and no cached tools.json:', err.message)
    process.exit(1)
  }

  const tools = parseMD(md)

  const categories = {}
  tools.forEach(t => { categories[t.category] = (categories[t.category] || 0) + 1 })

  const output = {
    version: '2.0.0',
    updated: new Date().toISOString().split('T')[0],
    source: 'https://github.com/jivoi/awesome-osint',
    total: tools.length,
    categories,
    tools,
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))

  console.log('✅  tools.json generated')
  console.log(`    → ${tools.length} tools | ${Object.keys(categories).length} categories`)
  console.log(`    → ${path.dirname(OUT_PATH)}`)
}

main()
