# APAE Digital

Plataforma **White Label** para APAEs (Associação de Pais e Amigos dos Excepcionais).
Um único código-base atende várias APAEs: cada instituição tem sua identidade visual,
seus conteúdos e seus dados, resolvidos por *tenant*. O cliente inicial (estudo de caso)
é a **APAE de Apiúna (SC)**.

O repositório é um **monorepo** com duas aplicações:

| Parte | Tecnologia | Documentação |
|---|---|---|
| **Frontend** (site público + painel admin) | Next.js 15 · React 18 · TypeScript · Tailwind | [`docs/frontend.md`](docs/frontend.md) |
| **Backend** (API REST) | Java 21 · Spring Boot 3 · JPA · PostgreSQL · JWT | [`backend/README.md`](backend/README.md) |

---

## Como os dois conversam

```
  Navegador
     │
     ▼
  Frontend (Next.js, :3000)  ──/api/*──►  Backend (Spring Boot, :8080)  ──►  PostgreSQL
     │                       (rewrite)         │
     └─ resolve o tenant                       └─ isola dados por tenant (multi-tenancy)
        (subdomínio / header)                     via JWT (admin) e header X-Tenant (público)
```

- O front resolve qual **APAE (tenant)** está sendo acessada e chama a API em `/api/*`.
  Em desenvolvimento, o Next encaminha essas chamadas para `http://localhost:8080`.
- O back valida o **JWT**, identifica o tenant e devolve apenas os dados daquela APAE.
- Front e back compartilham o mesmo **contrato** (os tipos do front espelham os DTOs da API).

---

## Status do projeto

O frontend está completo (site + painel administrativo de todos os módulos). O backend
O frontend e o backend cobrem **todos os módulos**, com o admin persistindo via API e o
site público consumindo os dados de cada APAE (tenant).

| Módulo | Frontend | Backend (API) |
|---|:--:|:--:|
| Autenticação (JWT) | ✅ | ✅ |
| Notícias | ✅ | ✅ |
| Eventos | ✅ | ✅ |
| Identidade visual (tema) | ✅ | ✅ |
| Página inicial (hero + números) | ✅ | ✅ |
| Serviços / Atendimentos | ✅ | ✅ |
| Transparência | ✅ | ✅ |
| Doação (PIX) | ✅ | ✅ |
| Institucional (Sobre) | ✅ | ✅ |
| Upload de imagens/arquivos | ✅ | ✅ |

---

## Início rápido

### Frontend

```bash
npm install
npm run dev            # http://localhost:3000
```

### Backend (com Docker — não precisa de Java na máquina)

```bash
cd backend
docker compose up --build   # sobe PostgreSQL + API em http://localhost:8080
```

Credenciais de demonstração do painel: **admin@apae.org** / **admin123**.

> Passo a passo detalhado, variáveis de ambiente, rotas e dicas em cada documentação:
> [frontend](docs/frontend.md) · [backend](backend/README.md).

---

## Estrutura do repositório

```
.
├── src/                 # Frontend (Next.js) — ver docs/frontend.md
├── public/              # Estáticos do front (logos por tenant, favicon)
├── backend/             # API Spring Boot — ver backend/README.md
├── docs/
│   └── frontend.md      # Documentação detalhada do frontend
└── README.md            # Este arquivo (visão geral)
```

---

## Roadmap

- [x] Frontend completo (site público + painel administrativo White Label)
- [x] Backend: autenticação (JWT), notícias e eventos, com Docker e testes (JaCoCo ~88%)
- [x] Backend de todos os módulos White Label (tema, home, serviços, transparência, doação, institucional)
- [x] Front conectado à API real em todos os módulos (com fallback local por tenant)
- [x] Upload real de imagens/arquivos (envio para o backend, servido em `/uploads/**`)
