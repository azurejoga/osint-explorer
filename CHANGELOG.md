# 📋 Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [1.0.0] — 2026-04-14

### Adicionado

- **1.300+ ferramentas OSINT** em 53 categorias
- **30 idiomas** com detecção automática e fallback em inglês/português
- **Sidebar responsiva** — estática no desktop, drawer no mobile
- **5 modos de visualização** — Grade, Lista, Tabela, Árvore, Compacto
- **Busca em tempo real** com suporte a busca global
- **Sistema de favoritos** com persistência em localStorage
- **Tema escuro/claro** persistido em localStorage
- **Landing page** multilíngue com hero, stats, features e FAQ
- **Navegação Home/Tools** no header
- **Build Electron** para Windows (instalador + portátil), macOS e Linux
- **Build Android** via Capacitor
- **SEO completo** — meta tags, Open Graph, Twitter Cards, hreflang para 30 idiomas
- **Atualização automática** — busca dados do GitHub na abertura
- **Fallback offline** — tools.json bundado para uso sem internet
- **Suporte a RTL** — Árabe e Persa com `dir="rtl"` automático
- **Acessibilidade** — ARIA labels, skip links, roles semânticos
- **Ferramentas personalizadas** — adicione suas próprias ferramentas

### Corrigido

- Todos os grupos de categorias expandidos por padrão
- Sidebar sempre visível no desktop (sem necessidade de toggle)
- Caminhos de assets relativos (`base: './'`) para funcionar no Electron/Android
- App fecha completamente ao fechar a janela no Windows
- Tradução de todos os rótulos de modo de visualização em 30 idiomas
- Tradução de aria-labels no footer
- Fallback de nomes de categoria para inglês antes de português
