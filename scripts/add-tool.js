/**
 * OSINT Tools Brasil – CLI Tool Adder
 *
 * Usage:
 *   node scripts/add-tool.js
 *
 * Interactive prompt to add a new tool to public/data/tools.json.
 * The app auto-detects the new version on next load.
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const toolsPath = path.join(__dirname, '../public/data/tools.json')

const CATEGORIES = [
  'general-search', 'national-search', 'meta-search', 'specialty-search',
  'darkweb-search', 'visual-search', 'similar-sites', 'document-search',
  'digital-footprint', 'threat-actor', 'threat-maps', 'file-search',
  'pastebins', 'code-search', 'social-networks', 'social-media-tools',
  'twitter', 'facebook', 'instagram', 'pinterest', 'reddit', 'vkontakte',
  'tumblr', 'telegram', 'steam', 'blog-search', 'forums', 'username-check',
  'web-monitoring', 'browsers', 'offline-browsing', 'vpn', 'infographics',
  'social-network-analysis', 'privacy-encryption', 'dns', 'maritime',
  'other-tools', 'threat-intelligence', 'osint-videos', 'osint-blogs',
  'other-resources', 'awesome-lists', 'ai-ml', 'advanced-threat-intel',
  'crypto-blockchain', 'darkweb-intelligence', 'mobile-analysis',
  'iot-intelligence', 'advanced-social-media', 'geospatial',
  'financial-intel', 'email-communication', 'malware-analysis',
  'image-video', 'domain-ip', 'phone-lookup', 'email-lookup',
  'people-search', 'geolocation', 'maps', 'archives', 'leaks-breaches',
  'transport', 'osint-frameworks', 'vuln-exploit', 'whois-records',
  'news-media', 'linkedin', 'company-business', 'aviation',
]

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(resolve => rl.question(q, resolve))

async function main() {
  if (!fs.existsSync(toolsPath)) {
    console.error('❌  public/data/tools.json not found. Run: npm run generate')
    process.exit(1)
  }

  console.log('\n🕵️  OSINT Tools Brasil – Add New Tool\n')

  const data = JSON.parse(fs.readFileSync(toolsPath, 'utf8'))

  const name = (await ask('Tool name: ')).trim()
  const url  = (await ask('URL (https://...): ')).trim()

  console.log('\nAvailable categories:')
  CATEGORIES.forEach((c, i) => console.log(`  ${String(i + 1).padStart(2, ' ')}. ${c}`))
  const catIdx = parseInt(await ask('\nCategory number: '), 10) - 1
  const category = CATEGORIES[catIdx] || 'other-tools'

  const statusInput = (await ask('Status [online/offline/unknown] (default: unknown): ')).trim()
  const status = ['online', 'offline', 'unknown'].includes(statusInput) ? statusInput : 'unknown'

  const descPt = (await ask('Description PT (optional): ')).trim()
  const descEn = (await ask('Description EN (optional): ')).trim()
  const descEs = (await ask('Description ES (optional): ')).trim()

  const tagsRaw = (await ask('Tags (comma-separated, optional): ')).trim()
  const tags = tagsRaw ? tagsRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : []

  const countryCode = (await ask('Country code (optional, e.g. BR, US): ')).trim().toUpperCase() || undefined

  rl.close()

  // Generate a safe id from name
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  if (data.tools.find(t => t.id === id || t.url === url)) {
    console.log('\n⚠️   A tool with the same id or URL already exists.')
    process.exit(0)
  }

  const newTool = {
    id,
    name,
    url,
    category,
    status,
    description: {
      pt: descPt || descEn || descEs || '',
      en: descEn || descPt || descEs || '',
      es: descEs || descPt || descEn || '',
    },
    tags,
    ...(countryCode ? { countryCode } : {}),
  }

  data.tools.push(newTool)
  data.total = data.tools.length

  // Bump patch version to trigger cache invalidation
  const [major, minor, patch] = data.version.split('.').map(Number)
  data.version = `${major}.${minor}.${patch + 1}`
  data.updated = new Date().toISOString().split('T')[0]
  data.categories[category] = (data.categories[category] || 0) + 1

  fs.writeFileSync(toolsPath, JSON.stringify(data, null, 2), 'utf8')

  console.log(`\n✅  "${name}" added to "${category}"`)
  console.log(`    Total tools: ${data.total} | Version: ${data.version}`)
  console.log(`    Reload the app to see the update.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
