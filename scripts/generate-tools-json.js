/**
 * OSINT Tools Brasil – JSON Generator
 * Run: node scripts/generate-tools-json.js
 *
 * Reads all tool data from src/data/tools-part*.js and writes
 * public/data/tools.json  (easy to edit, version-stamped)
 */

import { TOOLS_PART1 } from '../src/data/tools-part1.js'
import { TOOLS_PART2 } from '../src/data/tools-part2.js'
import { TOOLS_PART3 } from '../src/data/tools-part3.js'
import { TOOLS_PART4 } from '../src/data/tools-part4.js'
import { TOOLS_PART5 } from '../src/data/tools-part5.js'
import { TOOLS_PART6 } from '../src/data/tools-part6.js'
import { TOOLS_PART7 } from '../src/data/tools-part7.js'
import { TOOLS_PART8 } from '../src/data/tools-part8.js'
import { TOOLS_PART9 } from '../src/data/tools-part9.js'
import { TOOLS_PART10 } from '../src/data/tools-part10.js'
import { TOOLS_PART11 } from '../src/data/tools-part11.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const allTools = [
  ...TOOLS_PART1,
  ...TOOLS_PART2,
  ...TOOLS_PART3,
  ...TOOLS_PART4,
  ...TOOLS_PART5,
  ...TOOLS_PART6,
  ...TOOLS_PART7,
  ...TOOLS_PART8,
  ...TOOLS_PART9,
  ...TOOLS_PART10,
  ...TOOLS_PART11,
]

// Deduplicate by id (keep last occurrence)
const deduped = Object.values(
  Object.fromEntries(allTools.map(t => [t.id, t]))
)

// Build category index for stats
const categoryCount = {}
deduped.forEach(t => {
  categoryCount[t.category] = (categoryCount[t.category] || 0) + 1
})

const data = {
  version: '1.0.0',
  updated: new Date().toISOString().split('T')[0],
  total: deduped.length,
  categories: categoryCount,
  tools: deduped,
}

const outDir = path.join(__dirname, '../public/data')
fs.mkdirSync(outDir, { recursive: true })

const outPath = path.join(outDir, 'tools.json')
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8')

console.log(`✅  tools.json generated`)
console.log(`    → ${deduped.length} tools | ${Object.keys(categoryCount).length} categories`)
console.log(`    → ${outPath}`)
