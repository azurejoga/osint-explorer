#!/usr/bin/env node
/**
 * merge-osint-framework.js
 * Merges tools from BOTH OSINT-Framework (arf.json) AND awesome-osint.
 * Run: node scripts/merge-osint-framework.js
 */

import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ARF_PATH = path.resolve(__dirname, '../../OSINT-Framework/public/arf.json')
const OUT_PATH = path.resolve(__dirname, '../public/data/tools.json')
const AWESOME_URL = 'https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md'

const ARF_TO_OSINT_MAP = {
  'Username': 'username-check',
  'Email Address': 'email-lookup',
  'Domain Name': 'domain-ip',
  'Cloud Infrastructure': 'other-tools',
  'IP & MAC Address': 'domain-ip',
  'Images / Videos / Docs': 'image-video',
  'Social Networks': 'social-networks',
  'Instant Messaging': 'social-media-tools',
  'People Search Engines': 'people-search',
  'Dating': 'other-tools',
  'Telephone Numbers': 'phone-lookup',
  'Public Records': 'other-resources',
  'Compliance & Risk Intelligence': 'other-resources',
  'Business Records': 'company-business',
  'Transportation': 'transport',
  'Geolocation Tools / Maps': 'maps',
  'Search Engines': 'general-search',
  'Online Communities': 'forums',
  'Archives': 'archives',
  'Language Translation': 'other-tools',
  'Mobile OSINT': 'mobile-analysis',
  'Dark Web': 'darkweb-search',
  'Disinformation & Media Verification': 'other-resources',
  'Blockchain & Cryptocurrency': 'crypto-blockchain',
  'Classifieds': 'other-tools',
  'Encoding / Decoding': 'other-tools',
  'Tools': 'other-tools',
  'AI Tools': 'ai-ml',
  'Malicious File Analysis': 'malware-analysis',
  'Cyber Threat Intelligence': 'threat-intelligence',
  'OpSec': 'privacy-encryption',
  'Documentation / Evidence Capture': 'other-tools',
  'Training': 'other-resources',
}

const AWESOME_SECTION_MAP = {
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

function makeId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'tool'
}

function resolveCategory(heading, sectionMap) {
  const clean = heading
    .replace(/\[↑\]\([^)]*\)\s*/gi, '')
    .replace(/^\[.*?\]\s*/, '')
    .trim()
    .toLowerCase()

  if (sectionMap[clean]) return sectionMap[clean]

  for (const [key, cat] of Object.entries(sectionMap)) {
    if (clean.includes(key)) return cat
  }
  return 'other-tools'
}

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

function flattenArf(node, categoryPath = [], result = []) {
  if (node.type === 'url' && node.url) {
    result.push({ ...node, arfCategory: categoryPath.join(' > ') })
    return result
  }
  if (node.type === 'folder' && node.children) {
    const newPath = [...categoryPath, node.name]
    for (const child of node.children) {
      flattenArf(child, newPath, result)
    }
  }
  return result
}

function mapStatus(status) {
  switch (status) {
    case 'live': return 'online'
    case 'degraded': return 'unknown'
    case 'down': return 'offline'
    case 'deprecated': return 'offline'
    default: return 'unknown'
  }
}

function cleanName(name) {
  return name
    .replace(/\s*\(T\)\s*/g, '')
    .replace(/\s*\(D\)\s*/g, '')
    .replace(/\s*\(R\)\s*/g, '')
    .replace(/\s*\(M\)\s*/g, '')
    .replace(/\s*\(R\$\)\s*/g, '')
    .trim()
}

function convertArfTool(arfTool, idCount, seenUrls) {
  const url = arfTool.url
  if (!url || seenUrls.has(url)) return null
  seenUrls.add(url)

  const name = cleanName(arfTool.name)
  const base = makeId(name)
  const n = idCount.get(base) || 0
  idCount.set(base, n + 1)
  const id = n === 0 ? base : `${base}-${n + 1}`

  let category = 'other-tools'
  for (const [arfCategory, osintCategory] of Object.entries(ARF_TO_OSINT_MAP)) {
    if (arfTool.arfCategory && arfTool.arfCategory.startsWith(arfCategory)) {
      category = osintCategory
      break
    }
  }

  const description = arfTool.description || name
  const tags = []
  if (arfTool.localInstall) tags.push('local')
  if (arfTool.googleDork) tags.push('dork')
  if (arfTool.registration) tags.push('registration')
  if (arfTool.api) tags.push('api')
  if (arfTool.editUrl) tags.push('manual-input')
  if (arfTool.pricing === 'free') tags.push('free')
  if (arfTool.pricing === 'freemium') tags.push('freemium')
  if (arfTool.pricing === 'paid') tags.push('paid')

  return {
    id,
    name,
    url,
    category,
    status: mapStatus(arfTool.status),
    description: { pt: description, en: description, es: description },
    tags,
    source: 'osint-framework',
    arfMetadata: {
      bestFor: arfTool.bestFor,
      input: arfTool.input,
      output: arfTool.output,
      opsec: arfTool.opsec,
      opsecNote: arfTool.opsecNote,
      pricing: arfTool.pricing,
      localInstall: arfTool.localInstall,
      googleDork: arfTool.googleDork,
      registration: arfTool.registration,
      api: arfTool.api,
    }
  }
}

function parseAwesomeMd(md, idCount, seenUrls) {
  const tools = []
  const TOOL_RE = /^\*+\s*\[([^\]]+)\]\(([^)\s]+)\)(.*)?$/
  let currentCategory = 'other-tools'

  for (const line of md.split('\n')) {
    const trimmed = line.trim()

    if (/^##\s/.test(trimmed)) {
      const cat = resolveCategory(trimmed.replace(/^##\s+/, ''), AWESOME_SECTION_MAP)
      if (cat) currentCategory = cat
      continue
    }

    if (/^###\s/.test(trimmed)) {
      const cat = resolveCategory(trimmed.replace(/^###\s+/, ''), AWESOME_SECTION_MAP)
      if (cat) currentCategory = cat
      continue
    }

    const m = trimmed.match(TOOL_RE)
    if (!m) continue

    const [, rawName, url, rest] = m
    if (!url.startsWith('http') || seenUrls.has(url)) continue
    seenUrls.add(url)

    const name = rawName.replace(/\*\*/g, '').trim()
    const base = makeId(name)
    const n = idCount.get(base) || 0
    idCount.set(base, n + 1)
    const id = n === 0 ? base : `${base}-${n + 1}`

    const description = (rest || '')
      .replace(/^\s*[-—–]\s*/, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim() || name

    tools.push({
      id,
      name,
      url,
      category: currentCategory,
      status: 'unknown',
      description: { pt: description, en: description, es: description },
      tags: [],
      source: 'awesome-osint',
    })
  }

  return tools
}

async function main() {
  console.log('=== MERGING OSINT TOOLS ===\n')

  const idCount = new Map()
  const seenUrls = new Set()
  const allTools = []

  // 1. Load OSINT-Framework arf.json
  console.log('1. Loading OSINT-Framework...')
  let arfData
  try {
    arfData = JSON.parse(fs.readFileSync(ARF_PATH, 'utf8'))
    console.log('   Found arf.json')
  } catch (err) {
    console.error('   Failed:', err.message)
  }

  if (arfData) {
    const flatTools = []
    for (const category of arfData.children || []) {
      flattenArf(category, [category.name], flatTools)
    }
    console.log(`   Found ${flatTools.length} tools`)

    for (const arfTool of flatTools) {
      const tool = convertArfTool(arfTool, idCount, seenUrls)
      if (tool) allTools.push(tool)
    }
    console.log(`   Added ${allTools.length} unique tools`)
  }

  // 2. Fetch awesome-osint
  console.log('\n2. Fetching awesome-osint...')
  let awesomeMd
  try {
    awesomeMd = await fetchText(AWESOME_URL)
    console.log(`   Fetched ${(awesomeMd.length / 1024).toFixed(0)} KB`)
  } catch (err) {
    console.error('   Failed:', err.message)
  }

  if (awesomeMd) {
    const awesomeTools = parseAwesomeMd(awesomeMd, idCount, seenUrls)
    console.log(`   Found ${awesomeTools.length} tools from awesome-osint`)
    allTools.push(...awesomeTools)
  }

  // 3. Summary
  console.log('\n=== SUMMARY ===')
  console.log(`Total unique tools: ${allTools.length}`)
  console.log(`Unique URLs: ${seenUrls.size}`)

  const categories = {}
  allTools.forEach(t => { categories[t.category] = (categories[t.category] || 0) + 1 })

  const sources = { 'osint-framework': 0, 'awesome-osint': 0 }
  allTools.forEach(t => { sources[t.source] = (sources[t.source] || 0) + 1 })

  console.log('\nBy source:')
  Object.entries(sources).forEach(([src, count]) => console.log(`  ${src}: ${count}`))

  console.log('\nTop 10 categories:')
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`))

  // 4. Write output
  const output = {
    version: '3.0.0',
    updated: new Date().toISOString().split('T')[0],
    sources: [
      'https://github.com/lockfale/osint-framework',
      'https://github.com/jivoi/awesome-osint',
    ],
    total: allTools.length,
    categories,
    tools: allTools,
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2))
  console.log(`\nWritten to: ${OUT_PATH}`)
}

main().catch(console.error)
