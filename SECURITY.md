# 🔒 Política de Segurança

## Versões Suportadas

| Versão | Suporte de Segurança |
|---|---|
| 1.x.x (latest) | ✅ Suportada |
| < 1.0.0 | ❌ Sem suporte |

## Reportando uma Vulnerabilidade

**NÃO abra uma issue pública para vulnerabilidades de segurança.**

Se você descobriu uma vulnerabilidade de segurança neste projeto, por favor reporte de forma responsável:

1. **E-mail:** Envie os detalhes para o mantenedor via [GitHub Security Advisories](https://github.com/azurejoga/osint-explorer/security/advisories/new)
2. **Inclua:**
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se tiver)

## Tempo de Resposta

- **Confirmação de recebimento:** até 48 horas
- **Avaliação inicial:** até 7 dias
- **Correção e divulgação:** até 30 dias (dependendo da gravidade)

## Escopo

Este projeto é uma **aplicação de leitura e agregação de links públicos**. Não há:
- Autenticação de usuários
- Banco de dados de usuários
- Processamento de dados sensíveis no servidor
- Coleta de dados pessoais

Os dados armazenados são exclusivamente locais (localStorage do navegador/app) e de uso pessoal do próprio usuário (favoritos, preferências de idioma e tema).

## Práticas de Segurança

- **Electron:** `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- **Links externos:** Abertos no navegador padrão, nunca dentro do Electron
- **Dados:** Apenas localStorage, sem envio de dados a servidores próprios
- **Dependências:** Auditadas regularmente com `npm audit`

## Créditos

Agradecemos a todos que reportarem vulnerabilidades de forma responsável. Pesquisadores serão creditados no CHANGELOG (a menos que prefiram anonimato).
