#!/usr/bin/env node
/**
 * verify-merge.js
 * Verifies that all tools from OSINT-Framework are properly imported.
 */

import fs from 'fs'
import https from 'https'
import http from 'http'

const ARF_PATH = 'C:/Users/hybri/Desktop/OSINT-Framework/public/arf.json'
const TOOLS_JSON = 'C:/Users/hybri/Desktop/osint-explorer/public/data/tools.json'
const AWESOME_URL = 'https://raw.githubusercontent.com/jivoi/awesome-osint/master/README.md'

function flattenArf(node, categoryPath = [], result = []) {
  if (node.type === 'url' && node.url) {
    result.push(node.url)
  }
  if (node.type === 'folder' && node.children) {
    for (const child of node.children) {
      flattenArf(child, [...categoryPath, node.name], result)
    }
  }
  return result
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http
    lib.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location))
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(chunks.join('')))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function parseAwesomeMd(md) {
  const urls = new Set()
  const TOOL_RE = /^\*+\s*\[([^\]]+)\]\(([^)\s]+)\)(.*)?$/
  
  for (const line of md.split('\n')) {
    const m = line.match(TOOL_RE)
    if (m) {
      const url = m[2]
      if (url.startsWith('http')) {
        urls.add(url)
      }
    }
  }
  return urls
}

async function main() {
  console.log('=== OSINT TOOLS MERGE VERIFICATION ===\n')

  // Load arf.json
  console.log('1. Loading OSINT-Framework arf.json...')
  const arfData = JSON.parse(fs.readFileSync(ARF_PATH, 'utf8'))
  const arfUrls = new Set(flattenArf(arfData))
  console.log(`   Found ${arfUrls.size} URLs in OSINT-Framework\n`)

  // Load tools.json
  console.log('2. Loading osint-explorer tools.json...')
  const toolsData = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'))
  const toolsUrls = new Set(toolsData.tools.map(t => t.url))
  console.log(`   Found ${toolsUrls.size} tools in tools.json\n`)

  // Fetch awesome-osint
  console.log('3. Fetching awesome-osint README...')
  let awesomeUrls
  try {
    const md = await fetchText(AWESOME_URL)
    awesomeUrls = parseAwesomeMd(md)
    console.log(`   Found ${awesomeUrls.size} URLs in awesome-osint\n`)
  } catch (err) {
    console.log(`   Warning: Could not fetch awesome-osint: ${err.message}\n`)
    awesomeUrls = new Set()
  }

  // Analysis
  console.log('=== ANALYSIS ===\n')

  // URLs in ARF but not in tools.json
  const arfNotInTools = [...arfUrls].filter(url => !toolsUrls.has(url))
  console.log(`4. OSINT-Framework URLs missing from tools.json: ${arfNotInTools.length}`)
  if (arfNotInTools.length > 0 && arfNotInTools.length <= 20) {
    console.log('   Missing URLs:')
    arfNotInTools.forEach(url => console.log(`   - ${url}`))
  } else if (arfNotInTools.length > 20) {
    console.log(`   First 10 missing URLs:`)
    arfNotInTools.slice(0, 10).forEach(url => console.log(`   - ${url}`))
  }
  console.log()

  // URLs in tools.json but in ARF
  const inBoth = [...arfUrls].filter(url => toolsUrls.has(url))
  console.log(`5. OSINT-Framework URLs present in tools.json: ${inBoth.length}`)
  console.log(`   Coverage: ${((inBoth.length / arfUrls.size) * 100).toFixed(1)}%`)
  console.log()

  // Tools from awesome-osint vs ARF
  console.log('6. Source breakdown of tools.json:')
  const fromArf = toolsData.tools.filter(t => t.source === 'osint-framework' || t.arfMetadata)
  const fromAwesome = toolsData.tools.filter(t => t.source === 'awesome-osint')
  console.log(`   - From OSINT-Framework: ${fromArf.length}`)
  console.log(`   - From awesome-osint: ${fromAwesome.length}`)
  console.log(`   - Total: ${toolsData.tools.length}`)
  console.log()

  // Unique to awesome-osint (not in ARF)
  const awesomeOnly = [...awesomeUrls].filter(url => !arfUrls.has(url))
  console.log(`7. URLs unique to awesome-osint (not in OSINT-Framework): ${awesomeOnly.length}`)
  if (awesomeOnly.length > 0 && awesomeOnly.length <= 10) {
    console.log('   (These will be merged separately)')
    awesomeOnly.forEach(url => console.log(`   - ${url}`))
  } else if (awesomeOnly.length > 10) {
    console.log(`   First 10 unique URLs:`)
    awesomeOnly.slice(0, 10).forEach(url => console.log(`   - ${url}`))
  }
  console.log()

  // Summary
  console.log('=== SUMMARY ===')
  console.log(`OSINT-Framework has ${arfUrls.size} tools`)
  console.log(`tools.json has ${toolsUrls.size} tools`)
  console.log(`Overlap: ${inBoth.length} (${((inBoth.length / arfUrls.size) * 100).toFixed(1)}% of ARF)`)
  
  if (arfNotInTools.length === 0) {
    console.log('\n✅ ALL OSINT-Framework tools are properly imported!')
  } else {
    console.log(`\n⚠️  ${arfNotInTools.length} OSINT-Framework tools are missing from tools.json`)
  }
}

main().catch(console.error)
