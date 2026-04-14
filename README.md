<div align="center">

# 🇧🇷 OSINT Brasil — Explorador de Ferramentas

**O maior diretório gratuito de ferramentas OSINT do mundo**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Ferramentas](https://img.shields.io/badge/Ferramentas-1.300%2B-blue)](https://osintbrasil.com)
[![Categorias](https://img.shields.io/badge/Categorias-53-green)](https://osintbrasil.com)
[![Idiomas](https://img.shields.io/badge/Idiomas-30-orange)](https://osintbrasil.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[🌐 Acesse Online](https://osintbrasil.com) · [📱 Android](#android) · [💻 Desktop](#desktop) · [🐛 Reportar Bug](https://github.com/azurejoga/osint-explorer/issues) · [💡 Sugerir Funcionalidade](https://github.com/azurejoga/osint-explorer/issues)

![OSINT Brasil Screenshot](https://osintbrasil.com/og-image.png)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Início Rápido](#início-rápido)
- [Instalação](#instalação)
- [Desktop (Electron)](#desktop-electron)
- [Android](#android)
- [Build](#build)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Internacionalização](#internacionalização)
- [SEO](#seo)
- [Contribuindo](#contribuindo)
- [Segurança](#segurança)
- [Licença](#licença)
- [Autor](#autor)

---

## 🔍 Sobre o Projeto

**OSINT Brasil** é uma plataforma open-source completa para profissionais de inteligência, investigadores, jornalistas e pesquisadores de segurança cibernética. Reúne **mais de 1.300 ferramentas de Open Source Intelligence (OSINT)** organizadas em **53 categorias**, com suporte a **30 idiomas** e disponível para **web, desktop (Windows/macOS/Linux) e Android**.

As ferramentas são atualizadas automaticamente a partir do repositório [awesome-osint](https://github.com/jivoi/awesome-osint) no GitHub, garantindo que o diretório esteja sempre atualizado.

### 🎯 Para quem é?

| Perfil | Uso |
|---|---|
| 🕵️ Investigadores privados | Busca de pessoas, registros públicos, redes sociais |
| 📰 Jornalistas | Verificação de fatos, rastreamento de fontes |
| 🔐 Profissionais de cibersegurança | Threat intelligence, análise de malware, OSINT técnico |
| 🎓 Pesquisadores acadêmicos | Coleta de dados, análise de redes sociais |
| 🏛️ Forças de segurança | Investigação digital, geolocalização |

---

## ✨ Funcionalidades

- **🔄 Atualização automática** — Sincroniza com o GitHub na abertura, fallback para cache offline
- **🌍 30 idiomas** — Português, Inglês, Espanhol, Francês, Alemão, Russo, Chinês, Japonês, Árabe e muito mais
- **📱 Multiplataforma** — Web, Windows, macOS, Linux e Android
- **🔍 Busca avançada** — Pesquisa em tempo real por nome, descrição e tags
- **📂 53 categorias** — Organizadas em grupos temáticos com acordeão expansível
- **⭐ Favoritos** — Salve ferramentas favoritas com persistência local
- **🎨 5 modos de visualização** — Grade, Lista, Tabela, Árvore, Compacto
- **🌙 Tema escuro/claro** — Persistido no localStorage
- **♿ Acessibilidade** — ARIA labels, skip links, suporte a RTL (Árabe, Persa)
- **🔎 SEO agressivo** — Meta tags, Open Graph, Twitter Cards, hreflang para 30 idiomas
- **🔧 Ferramentas personalizadas** — Adicione suas próprias ferramentas ao diretório
- **📊 Estatísticas em tempo real** — Total de ferramentas, status online/offline, favoritos

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React 18, Vite 5 |
| Estilização | Tailwind CSS 3 |
| Ícones | Lucide React |
| Desktop | Electron 41 |
| Mobile | Capacitor 8 (Android) |
| Build | electron-builder |
| Dados | GitHub API + parseMD local |
| Estado | React Context API |
| Persistência | localStorage |

---

## 🚀 Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Desenvolvimento local

```bash
# 1. Clone o repositório
git clone https://github.com/azurejoga/osint-explorer.git
cd osint-explorer

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`

---

## 💾 Instalação

### 🌐 Web

Acesse diretamente em [osintbrasil.com](https://osintbrasil.com) — sem instalação necessária.

### 💻 Desktop (Electron)

Baixe o executável para seu sistema operacional na [página de releases](https://github.com/azurejoga/osint-explorer/releases):

| Sistema | Arquivo | Tipo |
|---|---|---|
| Windows | `OSINT Tools Explorer Setup X.X.X.exe` | Instalador |
| Windows | `OSINT Tools Explorer X.X.X.exe` | Portátil (sem instalação) |
| macOS | `OSINT Tools Explorer-X.X.X.dmg` | Instalador |
| Linux | `OSINT-Tools-Explorer-X.X.X.AppImage` | Portátil |

### 📱 Android

Baixe o APK na [página de releases](https://github.com/azurejoga/osint-explorer/releases) e instale diretamente no seu dispositivo Android (habilite "Fontes desconhecidas" nas configurações).

---

## 🔧 Build

### Build completo (Electron + Android)

```bash
npm run build
```

### Apenas Electron (Windows)

```bash
npm run build:electron
```

### Apenas Android

```bash
npm run build:android
# Em seguida, abra no Android Studio:
npm run android:open
```

### Apenas Web

```bash
npm run build:web
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | Build completo (web + electron + android sync) |
| `npm run build:web` | Build apenas do frontend web |
| `npm run build:electron` | Build web + empacotamento Electron |
| `npm run build:android` | Build web + sync Capacitor Android |
| `npm run generate` | Gera tools.json a partir do GitHub |
| `npm run electron:dev` | Electron em modo desenvolvimento |
| `npm run android:open` | Abre projeto Android no Android Studio |
| `npm run preview` | Preview do build web |

---

## 📁 Estrutura do Projeto

```
osint-explorer/
├── electron/
│   └── main.js              # Processo principal do Electron
├── public/
│   └── data/
│       └── tools.json       # Cache gerado automaticamente
├── scripts/
│   └── fetch-osint-md.js    # Script de geração de tools.json
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Barra de navegação e controles
│   │   ├── Sidebar.jsx      # Categorias e filtros
│   │   ├── MainContent.jsx  # Listagem de ferramentas
│   │   ├── LandingPage.jsx  # Página inicial
│   │   └── Toast.jsx        # Notificações
│   ├── context/
│   │   └── AppContext.jsx   # Estado global da aplicação
│   ├── data/
│   │   ├── categories.js    # Definição de categorias (53) com i18n
│   │   └── i18n.js          # Traduções para 30 idiomas
│   ├── hooks/
│   │   ├── useToolsLoader.js  # Carregamento de ferramentas
│   │   └── useSEO.js          # Gerenciamento de meta tags
│   ├── utils/
│   │   └── parseMd.js       # Parser do README do awesome-osint
│   └── App.jsx              # Componente raiz
├── android/                 # Projeto Capacitor Android
├── capacitor.config.json    # Configuração do Capacitor
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind
└── package.json
```

---

## 🌍 Internacionalização

O projeto suporta **30 idiomas** com fallback automático para inglês e depois português:

| Código | Idioma | Código | Idioma |
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

A linguagem é detectada automaticamente pelo navegador e pode ser alterada pelo usuário. Idiomas RTL (Árabe, Persa) têm suporte completo com `dir="rtl"`.

---

## 🔎 SEO

- Meta tags dinâmicas por idioma (title, description, keywords)
- Open Graph para compartilhamento em redes sociais
- Twitter Cards
- `hreflang` alternates para 30 idiomas
- JSON-LD structured data (WebApplication)
- Canonical URL
- `robots.txt` e `sitemap.xml`

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Leia o [CONTRIBUTING.md](CONTRIBUTING.md) para saber como participar.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 🔒 Segurança

Encontrou uma vulnerabilidade? Leia nossa [Política de Segurança](SECURITY.md).

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

## 👤 Autor

**Juan Mathews Rebello Santos**

- 🌐 Website: [juanmathewsrebellosantos.com](https://juanmathewsrebellosantos.com)
- 💼 LinkedIn: [linkedin.com/in/juanmathews](https://linkedin.com/in/juanmathews)
- 🐙 GitHub: [@azurejoga](https://github.com/azurejoga)

---

<div align="center">

Feito com ❤️ no Brasil 🇧🇷 para o mundo 🌍

⭐ Se este projeto te ajudou, considere dar uma estrela!

</div>
