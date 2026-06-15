# Changelog

All notable changes to this project are documented here.

This format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-04-18

### Added

- **1,050 OSINT-Framework tools** — merged from [lockfale/osint-framework](https://github.com/lockfale/osint-framework)
- **Rich metadata** — OPSEC considerations, pricing (free/freemium), input/output types, best-for use cases
- **2,369 total tools** (was: 1,300+)
- **Merge scripts** — `merge-osint-framework.js` and `verify-merge.js`
- **Bundled OSINT-Framework data** in `osint-framework-data/`

### Changed

- **README.md** updated with new counts and data sources
- Credit [@moscovium-mc](https://github.com/moscovium-mc) in acknowledgments

---

## [1.0.0] — 2026-04-14

### Added

- **1,300+ OSINT tools** in 53 categories
- **30 languages** with automatic detection and English/Portuguese fallback
- **Responsive sidebar** — static on desktop, drawer on mobile
- **5 view modes** — Grid, List, Table, Tree, Compact
- **Real-time search** with global search support
- **Favorites system** with localStorage persistence
- **Dark/light theme** persisted in localStorage
- **Multilingual landing page** with hero, stats, features and FAQ
- **Home/Tools navigation** in header
- **Electron build** for Windows (installer + portable), macOS and Linux
- **Android build** via Capacitor
- **Full SEO** — meta tags, Open Graph, Twitter Cards, hreflang for 30 languages
- **Auto-update** — fetches data from GitHub on launch
- **Offline fallback** — bundled tools.json for offline use
- **RTL support** — Arabic and Persian with automatic `dir="rtl"`
- **Accessibility** — ARIA labels, skip links, semantic roles
- **Custom tools** — add your own tools

### Fixed

- All category groups expanded by default
- Sidebar always visible on desktop (no toggle needed)
- Relative asset paths (`base: './'`) for Electron/Android
- App fully closes on window close in Windows
- Translation of all view mode labels in 30 languages
- Translation of aria-labels in footer
- Category name fallback to English before Portuguese