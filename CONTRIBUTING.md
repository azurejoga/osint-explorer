# 🤝 Guia de Contribuição

Obrigado pelo interesse em contribuir com o **OSINT Brasil**! Este documento explica como você pode participar do projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como posso contribuir?](#como-posso-contribuir)
- [Reportando bugs](#reportando-bugs)
- [Sugerindo funcionalidades](#sugerindo-funcionalidades)
- [Contribuindo com código](#contribuindo-com-código)
- [Padrões de código](#padrões-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Tradução](#tradução)

---

## 📜 Código de Conduta

Este projeto adota o [Código de Conduta do Contribuidor](CODE_OF_CONDUCT.md). Ao participar, você concorda em respeitar seus termos.

---

## 💡 Como posso contribuir?

| Tipo | Descrição |
|---|---|
| 🐛 Bug fix | Corrija um problema existente |
| ✨ Feature | Implemente uma nova funcionalidade |
| 🌍 Tradução | Adicione ou melhore traduções |
| 📝 Documentação | Melhore o README, comentários ou wikis |
| 🎨 Design | Melhore a UI/UX |
| ⚡ Performance | Otimize o desempenho |
| ♿ Acessibilidade | Melhore o suporte a acessibilidade |

---

## 🐛 Reportando Bugs

Antes de reportar, verifique se o bug já foi reportado nas [issues](https://github.com/azurejoga/osint-explorer/issues).

**Ao reportar, inclua:**
- Versão do sistema operacional
- Versão do app / URL acessada
- Passos para reproduzir o problema
- Comportamento esperado vs. comportamento atual
- Screenshots (se aplicável)
- Logs do console (se aplicável)

Use o template de [bug report](.github/ISSUE_TEMPLATE/bug_report.md).

---

## 💡 Sugerindo Funcionalidades

Verifique se a sugestão já existe nas [issues](https://github.com/azurejoga/osint-explorer/issues) antes de criar uma nova.

**Ao sugerir, descreva:**
- O problema que a funcionalidade resolve
- Como você imagina que funcione
- Por que isso seria útil para outros usuários

Use o template de [feature request](.github/ISSUE_TEMPLATE/feature_request.md).

---

## 🛠️ Contribuindo com Código

### 1. Fork e clone

```bash
git clone https://github.com/SEU_USUARIO/osint-explorer.git
cd osint-explorer
npm install
```

### 2. Crie uma branch

```bash
# Para features
git checkout -b feature/nome-da-feature

# Para bugs
git checkout -b fix/nome-do-bug

# Para traduções
git checkout -b i18n/adicionar-idioma-xx
```

### 3. Desenvolva

```bash
npm run dev
```

### 4. Teste suas mudanças

```bash
npm run build:web
```

### 5. Commit e Push

```bash
git add .
git commit -m "feat: descrição clara da mudança"
git push origin feature/nome-da-feature
```

### 6. Abra um Pull Request

Use o template de [Pull Request](.github/PULL_REQUEST_TEMPLATE.md).

---

## 📐 Padrões de Código

- **Linguagem:** JavaScript (ES Modules), React JSX
- **Formatação:** Siga o estilo existente do código
- **Comentários:** Apenas em inglês ou português, sem comentários desnecessários
- **Componentes React:** Funcionais com hooks
- **CSS:** Exclusivamente Tailwind CSS — sem CSS customizado inline

---

## 📝 Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>: <descrição curta>

[corpo opcional]

[rodapé opcional]
```

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação (sem mudança de lógica) |
| `refactor` | Refatoração de código |
| `perf` | Melhoria de performance |
| `i18n` | Tradução / internacionalização |
| `chore` | Build, configs, dependências |

**Exemplos:**
```
feat: adiciona modo de visualização kanban
fix: corrige sidebar não abrindo no mobile
i18n: adiciona tradução para swahili
docs: atualiza guia de instalação no README
```

---

## 🌍 Tradução

Para adicionar ou melhorar traduções:

1. Abra `src/data/i18n.js`
2. Localize o código do idioma (ex: `fr`, `de`, `ja`)
3. Adicione ou corrija as chaves necessárias
4. Para categorias, edite `src/data/categories.js`
5. Para grupos do sidebar, edite `src/components/Sidebar.jsx` na constante `GROUPS`

Os idiomas suportados estão listados no [README](README.md#internacionalização).

---

## ✅ Checklist do Pull Request

Antes de submeter, verifique:

- [ ] O código compila sem erros (`npm run build:web`)
- [ ] Não quebrei funcionalidades existentes
- [ ] Adicionei/atualizei traduções se necessário
- [ ] O código segue o estilo do projeto
- [ ] Os commits seguem o padrão Conventional Commits
- [ ] Descrevi as mudanças no PR

---

Dúvidas? Abra uma [issue](https://github.com/azurejoga/osint-explorer/issues) ou entre em contato com [@azurejoga](https://github.com/azurejoga).
