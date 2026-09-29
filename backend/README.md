# APAE Digital — Backend (API)

API REST em **Java 21 + Spring Boot 3**, com **JPA/Hibernate**, **PostgreSQL**,
autenticação **JWT** e **multi-tenancy** (dados isolados por APAE).

Faz parte do projeto **APAE Digital** (ver [README raiz](../README.md) para a visão geral
front + back). Os endpoints são alinhados ao que o frontend Next.js consome.

## Índice

- [Início rápido](#início-rápido)
- [O que já está implementado](#o-que-já-está-implementado)
- [Configuração](#configuração)
- [Autenticação e multi-tenancy](#autenticação-e-multi-tenancy)
- [Referência de rotas](#referência-de-rotas)
- [Testes e cobertura](#testes-e-cobertura)
- [Estrutura de pastas](#estrutura-de-pastas)

---

## Início rápido

> Este projeto exige **Java 21**. Se sua máquina tem outra versão (ex.: Java 8),
> use o fluxo Docker — o Java 21 fica no container e nada muda no seu ambiente.

**Subir tudo (banco + API) com Docker:**

```bash
cd backend
docker compose up --build
```

A API sobe em **http://localhost:8080**. No primeiro start, cria o tenant e o admin
de seed (`admin@apae.org` / `admin123`).

**Testar rápido:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@apae.org","password":"admin123"}'
```

Ou importe a collection [`postman/APAE-Digital.postman_collection.json`](postman/APAE-Digital.postman_collection.json)
no Postman — a request **Login** já salva o token e as rotas admin ficam autenticadas.

**Outros modos de rodar:**

| Objetivo | Comando |
|---|---|
| Só o Postgres (e rodar a API por conta) | `docker compose -f docker-compose.db.yml up -d` |
| API local (precisa de JDK 21) | `./mvnw spring-boot:run` |
| Build + testes local (JDK 21) | `./mvnw verify` |
| Build + testes sem Java local (Docker) | `docker run --rm -v "${PWD}:/app" -v "apae-m2:/root/.m2" -w /app maven:3.9-eclipse-temurin-21 mvn -B verify` |

---

## O que já está implementado

Este backend cobre **parte** do produto. O frontend já tem telas de administração para
vários módulos White Label, mas por enquanto só **Notícias** e **Eventos** têm API — os
demais ainda são salvos localmente no navegador (localStorage) no front.

| Módulo | API no backend | Observação |
|---|---|---|
| Autenticação (JWT) | ✅ | login / refresh / me |
| Notícias | ✅ | CRUD admin + rotas públicas |
| Eventos | ✅ | CRUD admin + consulta por período |
| Identidade visual (tema) | ✅ | GET público + GET/PUT admin (por tenant) |
| Página inicial (hero + números) | ⛔ roadmap | — |
| Serviços / Atendimentos | ⛔ roadmap | áreas e serviços (blocos) |
| Transparência | ⛔ roadmap | documentos |
| Doação | ⛔ roadmap | chave PIX, contas |
| Institucional (Sobre) | ⛔ roadmap | subpáginas de blocos |

O padrão (entidade → repositório → service → controller → DTO → testes) já está
estabelecido; adicionar os módulos do roadmap é repetir essa estrutura por tenant.

---

## Configuração

Variáveis de ambiente (todas têm padrão para desenvolvimento):

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/apae` | URL do banco (perfil default) |
| `DB_USER` / `DB_PASSWORD` | `apae` / `apae` | Credenciais do banco |
| `SERVER_PORT` | `8080` | Porta da API |
| `APP_JWT_SECRET` | (dev) | Segredo do JWT — **obrigatório em produção** (>= 32 bytes) |
| `APP_JWT_ACCESS_TTL` | `60` | Validade do access token (minutos) |
| `APP_JWT_REFRESH_TTL` | `7` | Validade do refresh token (dias) |
| `APP_CORS_ORIGINS` | `http://localhost:3000` | Origens permitidas (separadas por vírgula) |
| `APP_SEED_ENABLED` | `true` | Cria tenant/admin inicial no primeiro start |
| `APP_SEED_TENANT` | `apiuna` | Slug do tenant inicial |
| `APP_SEED_ADMIN_EMAIL` / `APP_SEED_ADMIN_PASSWORD` | `admin@apae.org` / `admin123` | Admin inicial |

**Perfis Spring:** `default` (API local → Postgres em `localhost`), `docker` (API no
container → Postgres no serviço `db`), `test` (H2 em memória).

---

## Autenticação e multi-tenancy

**Autenticação (JWT).** O login devolve um `accessToken` (curto) e um `refreshToken`
(longo). Envie o access token nas rotas protegidas: `Authorization: Bearer <token>`.
O token carrega `sub` (id), `email`, `name`, `role` e `tenant`. Papéis: `ADMIN`,
`EDITOR`, `VIEWER` — as rotas admin exigem `ADMIN` ou `EDITOR`.

**Multi-tenancy.** Cada registro pertence a um tenant (uma APAE), identificado por um
`slug` (ex.: `apiuna`):
- **Rotas admin** (`/api/admin/**`): o tenant vem do **JWT** — cada admin só vê/edita a
  própria APAE.
- **Rotas públicas** (`/api/news`, `/api/events`): o tenant vem do header **`X-Tenant`**
  (se ausente, usa o tenant padrão).

---

## Referência de rotas

Base URL: `http://localhost:8080`. Coluna **Auth**: 🔓 público · 🔒 requer Bearer token.

| Método | Rota | Auth | Descrição |
|---|---|:--:|---|
| POST | `/api/auth/login` | 🔓 | Autentica e retorna tokens + usuário |
| POST | `/api/auth/refresh` | 🔓 | Gera novos tokens a partir do refresh token |
| GET | `/api/auth/me` | 🔒 | Dados do usuário autenticado |
| GET | `/api/news?page&size` | 🔓 | Lista notícias **publicadas** (paginado) |
| GET | `/api/news/slug/{slug}` | 🔓 | Detalhe de uma notícia por slug |
| GET | `/api/admin/news?page&size` | 🔒 | Lista todas (rascunho + publicada) do tenant |
| GET | `/api/admin/news/{id}` | 🔒 | Detalhe por id |
| POST | `/api/admin/news` | 🔒 | Cria notícia (slug gerado do título) |
| PUT | `/api/admin/news/{id}` | 🔒 | Atualiza notícia |
| DELETE | `/api/admin/news/{id}` | 🔒 | Remove notícia |
| GET | `/api/events?start&end` | 🔓 | Lista eventos no período (datas ISO-8601) |
| GET | `/api/events/{id}` | 🔓 | Detalhe de um evento |
| POST | `/api/admin/events` | 🔒 | Cria evento |
| PUT | `/api/admin/events/{id}` | 🔒 | Atualiza evento |
| DELETE | `/api/admin/events/{id}` | 🔒 | Remove evento |
| GET | `/api/tenants/{slug}/theme` | 🔓 | Tema (identidade visual) do tenant |
| GET | `/api/admin/theme` | 🔒 | Tema do tenant autenticado |
| PUT | `/api/admin/theme` | 🔒 | Salva/atualiza o tema do tenant |

Enums: notícia — categoria `CAMPANHAS·ESTRUTURA·PROJETOS·INSTITUCIONAL`, status
`DRAFT·PUBLISHED`; evento — categoria `EVENTO·REUNIAO·CAMPANHA·OFICINA`.

**Tema:** cores em canais RGB (ex.: `"30 107 82"`). Se o tenant ainda não personalizou,
o GET retorna um **tema padrão** (fallback) com o nome/cidade do tenant. O `PUT` faz
*upsert* e força o `tenant` dono (ignora o campo `tenant` enviado no corpo).

> Exemplos completos de request/response de **todas** as rotas estão na collection do
> Postman. Abaixo ficam só os principais para referência rápida.

### Login → `POST /api/auth/login`

```jsonc
// request
{ "email": "admin@apae.org", "password": "admin123" }

// 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "0b3c...", "name": "Administrador", "email": "admin@apae.org", "role": "ADMIN", "tenant": "apiuna" }
}
```
Erros: `401` credenciais inválidas · `400` payload inválido.

### Criar notícia → `POST /api/admin/news` 🔒

```jsonc
// request (NewsRequest)
{
  "title": "Campanha do Agasalho",
  "summary": "Resumo com pelo menos 10 caracteres.",
  "content": "Conteúdo com pelo menos 20 caracteres.",
  "coverImageUrl": "https://...",   // opcional
  "category": "CAMPANHAS",
  "status": "PUBLISHED",
  "tags": ["campanha", "solidariedade"]
}

// 201 (NewsResponse) — slug gerado do título; publishedAt preenchido ao publicar
{
  "id": "e1...", "title": "Campanha do Agasalho", "slug": "campanha-do-agasalho",
  "summary": "...", "content": "...", "coverImageUrl": null,
  "category": "CAMPANHAS", "status": "PUBLISHED",
  "publishedAt": "2026-08-22T12:00:00Z", "author": null, "tags": ["campanha"],
  "createdAt": "2026-08-20T10:00:00Z", "updatedAt": "2026-08-22T12:00:00Z"
}
```

### Listar notícias públicas → `GET /api/news`

Retorno paginado (formato `Paginated<T>` do front):

```jsonc
{ "content": [ /* NewsResponse[] */ ], "page": 0, "size": 9, "totalElements": 1, "totalPages": 1 }
```

### Criar evento → `POST /api/admin/events` 🔒

```jsonc
// request (EventRequest) — datas em ISO-8601
{
  "title": "Bingo Solidário",
  "description": "Renda para o transporte dos alunos",
  "location": "Salão Paroquial",
  "start": "2026-09-12T22:00:00Z",
  "end": "2026-09-13T00:00:00Z",   // opcional
  "allDay": false,
  "category": "CAMPANHA"
}
```

### Salvar tema → `PUT /api/admin/theme` 🔒

```jsonc
// request/response (BrandThemeDto) — o campo "tenant" é definido pelo servidor
{
  "name": "APAE de Apiúna",
  "city": "Apiúna - SC",
  "logoUrl": "/tenants/apiuna/logo.svg",
  "logoLightUrl": null,
  "colors": {
    "primary": "21 128 61", "primaryLight": "74 179 111", "primaryDark": "15 92 44",
    "primaryContrast": "255 255 255", "secondary": "234 88 12", "secondaryLight": "251 146 60",
    "secondaryDark": "194 65 12", "secondaryContrast": "255 255 255", "accent": "2 132 199",
    "surface": "255 255 255", "surfaceAlt": "233 241 235", "ink": "20 27 24", "inkMuted": "82 96 88"
  },
  "typography": { "heading": "'Poppins', sans-serif", "body": "'Inter', sans-serif" },
  "radius": "0.875rem",
  "contact": { "email": "contato@apae.org", "phone": "(47) 0000-0000", "address": "Apiúna - SC", "social": { "instagram": "https://instagram.com/..." } },
  "donationUrl": "/doacoes"
}
```

### Formato de erro (padrão para todas as falhas)

```jsonc
{ "timestamp": "2026-09-28T16:30:00Z", "status": 404, "error": "Not Found", "message": "Notícia não encontrada." }
```

| Código | Quando |
|:--:|---|
| `400` | Validação de payload |
| `401` | Sem token / token inválido / credenciais inválidas |
| `403` | Autenticado, mas sem permissão |
| `404` | Recurso não encontrado |
| `409` | Conflito (ex.: não foi possível gerar slug único) |

---

## Testes e cobertura

```bash
./mvnw verify        # local (JDK 21)
```

- **JUnit 5 + Mockito** nos serviços; **MockMvc** no fluxo HTTP; **H2** em memória (perfil `test`).
- **JaCoCo** gera o relatório em `target/site/jacoco/index.html`.
- O build **falha** se a cobertura de linhas cair abaixo de **80%** (atual: ~88%).

---

## Estrutura de pastas

```
backend/
├── src/main/java/br/org/apaedigital/api/
│   ├── config/          # AppProperties, SecurityConfig, DataSeeder (seed inicial)
│   ├── controller/      # Auth, News/AdminNews, Event/AdminEvent
│   ├── domain/          # Entidades JPA + enums
│   ├── dto/             # Requests/Responses (auth, news, event) + PagedResponse
│   ├── exception/       # Exceções + handler global + ApiError
│   ├── repository/      # Spring Data JPA
│   ├── security/        # JwtService, filtro JWT, CurrentUser, TenantResolver
│   └── service/         # AuthService, NewsService, EventService, SlugUtil
├── src/main/resources/
│   ├── application.yml           # perfis default/docker
│   └── db/migration/V1__init.sql # schema (Flyway)
├── src/test/...                  # testes unitários e de integração
├── postman/                      # collection para importar
├── Dockerfile                    # build + run (JDK 21)
├── docker-compose.yml            # Postgres + API
└── docker-compose.db.yml         # apenas Postgres (para rodar a API local)
```
