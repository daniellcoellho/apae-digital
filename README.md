# APAE Digital

Plataforma **White Label** para APAEs (Associação de Pais e Amigos dos Excepcionais).
Um único código-base atende várias APAEs: cada instituição tem sua identidade visual,
seus conteúdos e seus dados, resolvidos por *tenant*. O cliente inicial (estudo de caso)
é a **APAE de Apiúna (SC)**.

> Status atual: **frontend** completo e funcional. O backend (Java + Spring Boot) ainda
> não existe — enquanto isso, o app usa dados de exemplo e um modo de administração que
> salva localmente no navegador. A arquitetura já está pronta para plugar a API.

---

## Stack

- **Next.js 15** (App Router) — framework React (rotas, SSR, build)
- **React 18** + **TypeScript**
- **Tailwind CSS** — estilos, com *design tokens* via CSS variables (base do White Label)
- **React Hook Form** + **Zod** — formulários e validação
- **Axios** — camada HTTP (com interceptor JWT, pronto para o backend)
- **date-fns** — datas (calendário de eventos)
- **qrcode** — geração do QR Code do PIX (BR Code EMV, sem gateway)

---

## Como rodar (quem clonou o projeto)

Pré-requisitos: **Node.js 18+** (recomendado 20/22) e npm.

```bash
# 1. Instale as dependências
npm install

# 2. (opcional) configure variáveis de ambiente
copy .env.example .env.local        # Windows
# cp .env.example .env.local        # Linux/Mac

# 3. Rode em desenvolvimento
npm run dev
```

Acesse **http://localhost:3000**.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (hot reload) |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | Lint |

> **Dica de desenvolvimento:** não rode `npm run build` enquanto o `npm run dev`
> estiver ativo — os dois usam a pasta `.next` e isso corrompe o cache do dev
> (gera erro 500 ou "Cannot find module"). Se acontecer: pare o dev, apague a pasta
> `.next` e rode `npm run dev` de novo.

### Variáveis de ambiente (`.env.local`)

| Variável | Padrão | Descrição |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `/api` | URL base da API do backend |
| `NEXT_PUBLIC_DEFAULT_TENANT` | `apiuna` | Tenant usado quando não dá para resolver pelo domínio |

Em desenvolvimento, chamadas para `/api/*` são encaminhadas para
`http://localhost:8080` (Spring Boot) via *rewrite* no `next.config.mjs`.

---

## Acesso ao painel administrativo

O painel fica em **http://localhost:3000/admin**.

Como ainda não há backend, existe um **login de demonstração** (definido em
`src/services/authService.ts`, `MOCK_ENABLED = true`):

- **E-mail:** `admin@apae.org`
- **Senha:** `admin123`

As edições feitas no admin são salvas no `localStorage` do navegador, por tenant.
Quando o backend existir, basta `MOCK_ENABLED = false` e trocar a camada de
persistência local por chamadas de API (as telas continuam iguais).

---

## Telas

### Site público

| Rota | Tela | Descrição |
|---|---|---|
| `/` | **Início** | Hero, números de impacto (contadores animados), notícias, agenda, serviços e bloco de doação. |
| `/sobre` e `/sobre/[slug]` | **Institucional** | Conteúdo "Sobre" dirigido por dados: Histórico, Presidente, Estrutura Organizacional, Programas, Profissionais, Convênios. Índice lateral navega entre as subpáginas. |
| `/servicos` | **Atendimentos Prestados** | Serviços detalhados em página única, agrupados por área (Saúde/Interdisciplinar e Educacional), com índice de âncoras. |
| `/eventos` | **Calendário de Eventos** | Calendário próprio (sem libs externas de UI): visão Mês e Agenda, categorias coloridas, modal de detalhes. |
| `/noticias` e `/noticias/[slug]` | **Notícias** | Grade de cards com filtro por categoria; página de detalhe. |
| `/transparencia` | **Transparência** | Lista de documentos (relatórios, financeiro, estatuto). |
| `/parcerias` | **Parcerias** | Seja parceiro / contratação. |
| `/faq` | **FAQ** | Perguntas frequentes. |
| `/contato` | **Contato** | Formulário (RHF + Zod) e canais de atendimento. |
| `/doacoes` | **Doações** | QR Code do PIX gerado localmente, chave com copiar, "Pix Copia e Cola" e dados bancários. |

### Painel administrativo (`/admin`)

| Rota | Tela | Descrição |
|---|---|---|
| `/admin/login` | **Login** | Autenticação (modo demo enquanto não há backend). |
| `/admin` | **Painel** | Atalhos para as áreas de gestão. |
| `/admin/pagina-inicial` | **Página Inicial** | Edita o hero (título, destaque, subtítulo, imagem, botões, card flutuante) e os números de impacto. |
| `/admin/noticias` | **Notícias** | Listar, criar, editar e excluir notícias (com categoria e status). |
| `/admin/eventos` | **Eventos** | Cadastrar eventos que aparecem no calendário. |
| `/admin/servicos` | **Serviços** | Editar áreas e atendimentos (ícone, título, resumo, parágrafos). |
| `/admin/transparencia` | **Transparência** | CRUD dos documentos de prestação de contas. |
| `/admin/identidade-visual` | **Identidade Visual** | Editar cores, logo, tipografia e raio, com pré-visualização ao vivo (essência do White Label). |
| `/admin/doacao` | **Doação** | Configurar chave PIX, recebedor e contas bancárias, com prévia do QR. |

---

## Arquitetura

### White Label (identidade por tenant)

- O **tenant** é resolvido pelo subdomínio (ex.: `apiuna.apaedigital.org.br` → `apiuna`);
  em `localhost` cai no `NEXT_PUBLIC_DEFAULT_TENANT` (ou `?tenant=` em dev).
- O **tema** é um conjunto de *design tokens* (cores, tipografia, raio) aplicados em
  runtime como **CSS variables** no `<html>`. O Tailwind consome essas variáveis
  (`rgb(var(--color-primary) / <alpha-value>)`), então trocar de APAE repinta a UI
  inteira sem recompilar.
- Conteúdo (Home, Sobre, Serviços, Transparência, Doação) também é **dirigido por dados
  por tenant**, em `src/content/`.

### Camada de dados (hoje x amanhã)

- **Hoje:** dados padrão ficam em arquivos (`src/content/**`, `src/theme/themes.ts`) e as
  edições do admin são salvas em `localStorage` via `src/services/localSettings.ts`
  (escopadas por tenant). Os *resolvers* fazem *merge* `padrão + override local`.
- **Amanhã (backend):** cada *resolver* passa a buscar da API (`/api/...`); os componentes
  e telas não mudam. A instância Axios (`src/services/http.ts`) já injeta o JWT e trata
  refresh de token.

### Renderização (Next.js)

- Componentes interativos (usam estado/efeito/contexto) são **Client Components** (`'use client'`).
- As rotas em `src/app/**` são *wrappers* finos que renderizam os componentes de tela
  em `src/screens/**`, mantendo a lógica de UI separada do roteamento.

---

## Estrutura de pastas

```
.
├── src/
│   ├── app/                        # Rotas (Next.js App Router)
│   │   ├── layout.tsx              # Layout raiz (<html>, Providers, metadata)
│   │   ├── providers.tsx           # ThemeProvider + AuthProvider (client)
│   │   ├── not-found.tsx           # Página 404
│   │   ├── (public)/               # Grupo de rotas do site público
│   │   │   ├── layout.tsx          # Header + conteúdo + Footer + acessibilidade
│   │   │   ├── page.tsx            # / (Home)
│   │   │   ├── sobre/[slug]/       # /sobre e /sobre/:slug
│   │   │   ├── servicos/           # /servicos
│   │   │   ├── eventos/            # /eventos
│   │   │   ├── noticias/[slug]/    # /noticias e /noticias/:slug
│   │   │   ├── transparencia/      # /transparencia
│   │   │   ├── parcerias/ faq/ contato/ doacoes/
│   │   └── admin/
│   │       ├── login/              # /admin/login (fora do guard)
│   │       └── (dashboard)/        # Grupo protegido (guard de auth)
│   │           ├── layout.tsx      # AdminLayout (sidebar + proteção)
│   │           ├── page.tsx        # Painel
│   │           ├── pagina-inicial/ noticias/ eventos/
│   │           ├── servicos/ transparencia/
│   │           └── identidade-visual/ doacao/
│   │
│   ├── screens/                    # Componentes de tela (a UI de cada página)
│   │   ├── public/                 # Home, Institucional, Serviços, Eventos, Notícias...
│   │   ├── admin/                  # Dashboard, Login, Branding, Doação, Home/Serviços/Transparência admin
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── layout/                 # Header, Footer, AdminLayout
│   │   ├── common/                 # PageMeta, PageHeader, SectionHeading, CountUp
│   │   └── a11y/                   # AccessibilityBar (fonte / alto contraste)
│   │
│   ├── features/                   # Módulos por domínio (lógica + UI específica)
│   │   ├── events/                 # Calendário, modal, categorias, hook de eventos
│   │   ├── news/                   # Card, categorias, schema, hook de listagem
│   │   ├── institucional/          # Renderizador de blocos + hook
│   │   └── donations/              # BR Code do PIX + componente do QR
│   │
│   ├── content/                    # Conteúdo por tenant (dados White Label)
│   │   ├── home/                   # Hero + números de impacto
│   │   ├── institucional/          # Subpáginas do "Sobre" (blocos)
│   │   ├── servicos/               # Atendimentos prestados
│   │   ├── transparencia/          # Documentos
│   │   └── doacoes/                # Chave PIX, recebedor, contas
│   │
│   ├── contexts/                   # ThemeContext (White Label) e AuthContext (JWT)
│   ├── theme/                      # Tokens, temas por tenant, aplicação e utilitários de cor
│   ├── services/                   # http (Axios+JWT), auth, news, event, tokenStorage, localSettings
│   ├── hooks/                      # useSettingsVersion
│   ├── types/                      # Tipos de domínio compartilhados
│   └── styles/                     # globals.css (Tailwind + tokens + utilitários)
│
├── public/                         # Estáticos (logos por tenant, favicon)
│   └── tenants/<slug>/logo.svg
│
├── next.config.mjs                 # Config do Next (rewrite /api, imagens)
├── tailwind.config.js              # Cores/tipografia/raio via CSS variables
├── postcss.config.js
├── tsconfig.json
└── .env.example
```

---

## Acessibilidade

- Barra de acessibilidade (aumentar/diminuir fonte, alto contraste), persistida por usuário.
- Link "pular para o conteúdo", foco visível, `aria-*` na navegação e nos controles,
  e respeito a `prefers-reduced-motion`.

---

## Roadmap

- [ ] Backend **Java + Spring Boot** (auth/JWT, notícias, eventos, tema, conteúdos), PostgreSQL, Docker.
- [ ] Trocar a persistência local (`localSettings`) pelas chamadas de API nos *resolvers*.
- [ ] Upload real de imagens/arquivos (hoje via URL).
- [ ] Editor de blocos completo para "Sobre" e "Serviços" (reordenação, novos tipos).
