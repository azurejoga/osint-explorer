<div align="center">

# 🇧🇷 OSINT Brasil — Tools Explorer

**The world's largest free OSINT tools directory**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tools](https://img.shields.io/badge/Tools-2%2C369-blue)](https://osint.juanmathewsrebellosantos.com)
[![Categories](https://img.shields.io/badge/Categories-53-green)](https://osint.juanmathewsrebellosantos.com)
[![Languages](https://img.shields.io/badge/Languages-30-orange)](https://osint.juanmathewsrebellosantos.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[🌐 Live Demo](https://osint.juanmathewsrebellosantos.com) · [📱 Android](#android) · [💻 Desktop](#desktop-electron) · [🐛 Report Bug](https://github.com/azurejoga/osint-explorer/issues) · [💡 Request Feature](https://github.com/azurejoga/osint-explorer/issues)

**Read this in other languages:**
[🇧🇷 Português](README.pt.md) · [🇪🇸 Español](README.es.md) · [🇨🇳 中文](README.zh.md) · [🇯🇵 日本語](README.ja.md)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Desktop (Electron)](#desktop-electron)
- [Android](#android)
- [Build](#build)
- [Project Structure](#project-structure)
- [Internationalization](#internationalization)
- [SEO](#seo)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Author](#author)

---

## 🔍 About

**OSINT Brasil** is a complete open-source platform for intelligence professionals, investigators, journalists, and cybersecurity researchers. It aggregates **2,369 Open Source Intelligence (OSINT) tools** organized in **53 categories**, with support for **30 languages**, available as a **web app, Windows desktop app, and Android app**.

Tools are automatically merged from two sources:
- [OSINT-Framework](https://github.com/lockfale/osint-framework) (1,050 tools)
- [awesome-osint](https://github.com/jivoi/awesome-osint) (1,319 tools)

### 🎯 Who is it for?

| Profile | Use Case |
|---|---|
| 🕵️ Private investigators | People search, public records, social media |
| 📰 Journalists | Fact-checking, source tracking |
| 🔐 Cybersecurity professionals | Threat intelligence, malware analysis, technical OSINT |
| 🎓 Academic researchers | Data collection, social network analysis |
| 🏛️ Law enforcement | Digital investigation, geolocation |

---

## ✨ Features

- **🔄 Auto-update** — Merges from OSINT-Framework and awesome-osint on every launch
- **🌍 30 languages** — Portuguese, English, Spanish, French, German, Russian, Chinese, Japanese, Arabic and more
- **📱 Cross-platform** — Web, Windows and Android
- **🔍 Real-time search** — Search by name, description and tags across 2,369 tools
- **📂 53 categories** — Organized in thematic groups with expandable accordion sidebar
- **⭐ Favorites** — Save favorite tools with local persistence
- **🎨 5 view modes** — Grid, List, Table, Tree, Compact
- **🌙 Dark / light theme** — Persisted in localStorage
- **♿ Accessibility** — ARIA labels, skip links, full RTL support (Arabic, Persian)
- **🔎 Aggressive SEO** — Meta tags, Open Graph, Twitter Cards, hreflang for 30 languages
- **📊 Real-time stats** — Total tools, online/offline status, favorites count
- **🔒 Rich metadata** — OPSEC considerations, pricing (free/freemium), input/output types, best-for use cases

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Desktop | Electron 41 |
| Mobile | Capacitor 8 (Android) |
| Build | electron-builder |
| Data | GitHub API + local parseMD |
| State | React Context API |
| Persistence | localStorage |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Local development

```bash
# 1. Clone the repository
git clone https://github.com/azurejoga/osint-explorer.git
cd osint-explorer

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173`

---

## 💾 Installation

### 🌐 Web

Access directly at [osint.juanmathewsrebellosantos.com](https://osint.juanmathewsrebellosantos.com) — no installation required.

### 💻 Desktop (Electron)

Download the Windows executable from the [releases page](https://github.com/azurejoga/osint-explorer/releases):

| Platform | File | Type |
|---|---|---|
| Windows | `OSINT Tools Explorer Setup X.X.X.exe` | Installer |
| Windows | `OSINT Tools Explorer X.X.X.exe` | Portable (no install needed) |

### 📱 Android

Download the APK from the [releases page](https://github.com/azurejoga/osint-explorer/releases) and install it directly on your Android device (enable "Unknown sources" in Settings → Security).

---

## 🔧 Build

### Full build (Electron + Android sync)

```bash
npm run build
```

### Windows only (Electron)

```bash
npm run build:electron
```

Outputs to `dist-electron/`:
- `OSINT Tools Explorer Setup X.X.X.exe` — NSIS installer
- `OSINT Tools Explorer X.X.X.exe` — portable executable

### Android

```bash
# Sync web assets to Android project
npm run build:android

# Open in Android Studio to generate APK/AAB
npm run android:open
```

> **Prerequisites for Android:** Android Studio with SDK installed. Run `npx cap add android` once before the first build.

### Web only

```bash
npm run build:web
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Full build (web + Electron + Android sync) |
| `npm run build:web` | Web frontend only |
| `npm run build:electron` | Web + Electron packaging |
| `npm run build:android` | Web + Capacitor Android sync |
| `npm run generate` | Generate tools.json from GitHub |
| `npm run electron:dev` | Run Electron in dev mode |
| `npm run android:open` | Open Android project in Android Studio |
| `npm run preview` | Preview the web build |

---

## 📁 Project Structure

```
osint-explorer/
├── electron/
│   └── main.js              # Electron main process
├── public/
│   └── data/
│       └── tools.json       # Auto-generated tool cache
├── scripts/
│   └── fetch-osint-md.js    # tools.json generator script
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation bar and controls
│   │   ├── Sidebar.jsx      # Categories and filters
│   │   ├── MainContent.jsx  # Tool listing
│   │   ├── LandingPage.jsx  # Landing page
│   │   └── Toast.jsx        # Notifications
│   ├── context/
│   │   └── AppContext.jsx   # Global application state
│   ├── data/
│   │   ├── categories.js    # 53 categories with i18n
│   │   └── i18n.js          # Translations for 30 languages
│   ├── hooks/
│   │   ├── useToolsLoader.js  # Tools data loader
│   │   └── useSEO.js          # Meta tag management
│   ├── utils/
│   │   └── parseMd.js       # awesome-osint README parser
│   └── App.jsx              # Root component
├── android/                 # Capacitor Android project
├── capacitor.config.json    # Capacitor configuration
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

---

## 🌍 Internationalization

**30 languages** supported with automatic fallback (English → Portuguese):

| Code | Language | Code | Language |
|---|---|---|---|
| `pt` | Português 🇧🇷 | `ko` | 한국어 🇰🇷 |
| `en` | English 🇺🇸 | `ar` | العربية 🇸🇦 |
| `es` | Español 🇪🇸 | `hi` | हिन्दी 🇮🇳 |
| `fr` | Français 🇫🇷 | `bn` | বাংলা 🇧🇩 |
| `de` | Deutsch 🇩🇪 | `tr` | Türkçe 🇹🇷 |
| `it` | Italiano 🇮🇹 | `pl` | Polski 🇵🇱 |
| `nl` | Nederlands 🇳🇱 | `sv` | Svenska 🇸🇪 |
| `ru` | Русский 🇷🇺 | `no` | Norsk 🇳🇴 |
| `zh` | 中文 🇨🇳 | `da` | Dansk 🇩🇰 |
| `ja` | 日本語 🇯🇵 | `fi` | Suomi 🇫🇮 |
| `uk` | Українська 🇺🇦 | `cs` | Čeština 🇨🇿 |
| `el` | Ελληνικά 🇬🇷 | `ro` | Română 🇷🇴 |
| `hu` | Magyar 🇭🇺 | `th` | ภาษาไทย 🇹🇭 |
| `vi` | Tiếng Việt 🇻🇳 | `id` | Bahasa Indonesia 🇮🇩 |
| `ms` | Bahasa Melayu 🇲🇾 | `fa` | فارسی 🇮🇷 |

Language is auto-detected from the browser and can be changed by the user. RTL languages (Arabic, Persian) have full `dir="rtl"` support.

---

## 🔎 SEO

- Per-language dynamic meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Cards
- `hreflang` alternate links for all 30 languages
- JSON-LD structured data (WebApplication schema)
- Canonical URL

---

## 🤝 Contributing

Contributions are welcome! Read [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 🔒 Security

Found a vulnerability? Read our [Security Policy](SECURITY.md).

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 👤 Author

**Juan Mathews Rebello Santos**

- 🌐 Website: [juanmathewsrebellosantos.com](https://juanmathewsrebellosantos.com)
- 🔍 OSINT Tool: [osint.juanmathewsrebellosantos.com](https://osint.juanmathewsrebellosantos.com)
- 💼 LinkedIn: [linkedin.com/in/juanmathews](https://linkedin.com/in/juanmathews)
- 🐙 GitHub: [@azurejoga](https://github.com/azurejoga)

### 🙏 Acknowledgments

Thanks to [moscovium-mc](https://github.com/moscovium-mc) for the major expansion from ~1,300 to 2,369 tools by merging OSINT-Framework data.

---

<div align="center">

Made with ❤️ in Brazil 🇧🇷 for the world 🌍

⭐ If this project helped you, please give it a star!

</div>
