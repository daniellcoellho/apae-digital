# APAE Digital — Backend (API)

API REST **White Label** para APAEs, em **Java 21 + Spring Boot 3**, com **JPA/Hibernate**,
**PostgreSQL**, autenticação **JWT** e **multi-tenancy** (dados escopados por APAE).

Alinhada 1:1 aos endpoints que o frontend (Next.js) já consome.

---

## Stack

- **Java 21** + **Spring Boot 3.4**
- **Spring Web**, **Spring Data JPA (Hibernate)**, **Spring Security**, **Bean Validation**
- **PostgreSQL** + **Flyway** (migrations)
- **JWT** via [jjwt](https://github.com/jwtk/jjwt)
- **Testes:** JUnit 5, Mockito, Spring Security Test, H2 (em memória)
- **Cobertura:** JaCoCo (mínimo de 80% de linhas, verificado no build)

---

## Como rodar

> **Importante:** este projeto exige **Java 21**. Se sua máquina tem outra versão de
> Java (ex.: Java 8), use o fluxo **via Docker** — o Java 21 fica dentro do container e
> nada muda no seu ambiente.

### Opção A — Tudo no Docker (recomendado, não precisa de Java local)

```bash
cd backend
docker compose up --build
```

Sobe **PostgreSQL** + **API**. A API fica em **http://localhost:8080**.
Ao subir pela primeira vez, cria o tenant e o usuário admin de seed (ver abaixo).

### Opção B — Postgres no Docker, API local (mais ágil p/ desenvolver)

Requer **JDK 21** instalado localmente.

```bash
cd backend
docker compose -f docker-compose.db.yml up -d     # sobe só o Postgres
./mvnw spring-boot:run                             # roda a API local (perfil default)
```

### Build e testes (com relatório de cobertura)

Local (com JDK 21):
```bash
./mvnw verify
```

Sem Java local — rodando no Docker:
```bash
docker run --rm -v "${PWD}:/app" -v "apae-m2:/root/.m2" -w /app \
  maven:3.9-eclipse-temurin-21 mvn -B verify
```

O relatório de cobertura fica em `target/site/jacoco/index.html`.
O build **falha** se a cobertura de linhas cair abaixo de 80%.

---

## Configuração (variáveis de ambiente)

| Variável | Padrão | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/apae` | URL do banco (perfil default) |
| `DB_USER` / `DB_PASSWORD` | `apae` / `apae` | Credenciais do banco |
| `SERVER_PORT` | `8080` | Porta da API |
| `APP_JWT_SECRET` | (dev) | Segredo do JWT (**defina em produção**, >= 32 bytes) |
| `APP_JWT_ACCESS_TTL` | `60` | Validade do access token (minutos) |
| `APP_JWT_REFRESH_TTL` | `7` | Validade do refresh token (dias) |
| `APP_CORS_ORIGINS` | `http://localhost:3000` | Origens permitidas (CSV) |
| `APP_SEED_ENABLED` | `true` | Cria tenant/admin inicial no primeiro start |
| `APP_SEED_TENANT` | `apiuna` | Slug do tenant inicial |
| `APP_SEED_ADMIN_EMAIL` | `admin@apae.org` | E-mail do admin inicial |
| `APP_SEED_ADMIN_PASSWORD` | `admin123` | Senha do admin inicial |

**Perfis Spring:** `default` (API local → Postgres em `localhost`), `docker` (API no container → Postgres no serviço `db`), `test` (H2 em memória).

---

## Multi-tenancy

Cada registro pertence a um **tenant** (uma APAE), identificado pelo `slug` (ex.: `apiuna`).

- **Rotas administrativas** (`/api/admin/**`): o tenant vem do **JWT** do usuário logado.
  Um admin só enxerga/edita dados da própria APAE.
- **Rotas públicas** (`/api/news`, `/api/events`): o tenant vem do header **`X-Tenant`**.
  Se ausente, usa o tenant padrão (`APP_SEED_TENANT`).

---

## Autenticação

Login retorna um **access token** (curto) e um **refresh token** (longo). As rotas
administrativas exigem o header `Authorization: Bearer <accessToken>`. O token carrega
`sub` (id), `email`, `name`, `role` e `tenant`.

Papéis: `ADMIN`, `EDITOR`, `VIEWER`. As rotas admin exigem `ADMIN` ou `EDITOR`.

**Credenciais de seed (dev):** `admin@apae.org` / `admin123`.

---

## Endpoints

Base URL: `http://localhost:8080`

### Autenticação

#### `POST /api/auth/login`
Request:
```json
{ "email": "admin@apae.org", "password": "admin123" }
```
Response `200`:
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "0b3c...","name": "Administrador","email": "admin@apae.org",
    "role": "ADMIN","tenant": "apiuna"
  }
}
```
Erros: `401` (credenciais inválidas), `400` (payload inválido).

#### `POST /api/auth/refresh`
Request: `{ "refreshToken": "eyJ..." }` → Response `200`: mesmo formato do login.
Erros: `401` (refresh inválido/expirado ou token de tipo errado).

#### `GET /api/auth/me`  _(requer Bearer token)_
Response `200`:
```json
{ "id": "0b3c...","name": "Administrador","email": "admin@apae.org","role": "ADMIN","tenant": "apiuna" }
```
Erros: `401` (sem token / token inválido).

---

### Notícias — público

#### `GET /api/news?page=0&size=9`  _(header `X-Tenant` opcional)_
Lista **apenas publicadas**, paginado. Response `200`:
```json
{
  "content": [
    {
      "id": "e1...","title": "Campanha do Agasalho","slug": "campanha-do-agasalho",
      "summary": "...","content": "...","coverImageUrl": null,
      "category": "CAMPANHAS","status": "PUBLISHED",
      "publishedAt": "2026-08-22T12:00:00Z","author": null,
      "tags": ["campanha"],
      "createdAt": "2026-08-20T10:00:00Z","updatedAt": "2026-08-22T12:00:00Z"
    }
  ],
  "page": 0, "size": 9, "totalElements": 1, "totalPages": 1
}
```

#### `GET /api/news/slug/{slug}`  _(header `X-Tenant` opcional)_
Response `200`: um `NewsResponse`. Erros: `404` (não encontrada).

---

### Notícias — admin  _(requer Bearer token; escopo pelo tenant do token)_

#### `GET /api/admin/news?page=0&size=20`
Lista **todas** (rascunhos + publicadas) do tenant, paginado.

#### `GET /api/admin/news/{id}` → `NewsResponse` | `404`

#### `POST /api/admin/news`
Request (`NewsRequest`):
```json
{
  "title": "Campanha do Agasalho",
  "summary": "Resumo com pelo menos 10 caracteres.",
  "content": "Conteúdo com pelo menos 20 caracteres.",
  "coverImageUrl": "https://...",
  "category": "CAMPANHAS",
  "status": "PUBLISHED",
  "tags": ["campanha", "solidariedade"]
}
```
Response `201`: `NewsResponse` (o `slug` é gerado do título; `publishedAt` é preenchido ao publicar).
Erros: `400` (validação), `401`/`403` (sem permissão).

#### `PUT /api/admin/news/{id}` → `200` `NewsResponse` | `404`
Mesmo corpo do POST.

#### `DELETE /api/admin/news/{id}` → `204` | `404`

**Categorias:** `CAMPANHAS`, `ESTRUTURA`, `PROJETOS`, `INSTITUCIONAL`.
**Status:** `DRAFT`, `PUBLISHED`.

---

### Eventos — público

#### `GET /api/events?start={ISO}&end={ISO}`  _(header `X-Tenant` opcional)_
Lista eventos com início no intervalo `[start, end]`. Response `200`:
```json
[
  {
    "id": "a1...","title": "Bingo Solidário","description": "...","location": "Salão",
    "start": "2026-09-12T22:00:00Z","end": "2026-09-13T00:00:00Z",
    "allDay": false,"category": "CAMPANHA"
  }
]
```

#### `GET /api/events/{id}` → `EventResponse` | `404`

---

### Eventos — admin  _(requer Bearer token)_

#### `POST /api/admin/events`
Request (`EventRequest`):
```json
{
  "title": "Bingo Solidário",
  "description": "Renda para o transporte dos alunos",
  "location": "Salão Paroquial",
  "start": "2026-09-12T22:00:00Z",
  "end": "2026-09-13T00:00:00Z",
  "allDay": false,
  "category": "CAMPANHA"
}
```
Response `201`: `EventResponse`.

#### `PUT /api/admin/events/{id}` → `200` `EventResponse` | `404`

#### `DELETE /api/admin/events/{id}` → `204` | `404`

**Categorias:** `EVENTO`, `REUNIAO`, `CAMPANHA`, `OFICINA`.

---

## Formato de erro

Todas as falhas retornam um corpo padrão:
```json
{
  "timestamp": "2026-09-28T16:30:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Notícia não encontrada."
}
```

| Código | Quando |
|---|---|
| `400` | Validação de payload |
| `401` | Sem token / token inválido / credenciais inválidas |
| `403` | Autenticado, mas sem permissão |
| `404` | Recurso não encontrado |
| `409` | Conflito (ex.: não foi possível gerar slug único) |

---

## Collection do Postman

Importe o arquivo [`postman/APAE-Digital.postman_collection.json`](postman/APAE-Digital.postman_collection.json)
no Postman.

- A collection tem a variável `baseUrl` (padrão `http://localhost:8080`) e `tenant` (`apiuna`).
- A request **Login** salva automaticamente `accessToken` e `refreshToken` nas variáveis
  da collection (script em *Tests*), então as rotas admin já vão autenticadas.
- Ordem sugerida: **Login** → criar notícia/evento → listar → atualizar → excluir.

---

## Estrutura de pastas

```
backend/
├── src/main/java/br/org/apaedigital/api/
│   ├── ApaeDigitalApiApplication.java
│   ├── config/          # AppProperties, SecurityConfig, DataSeeder (seed inicial)
│   ├── controller/      # Auth, News/AdminNews, Event/AdminEvent
│   ├── domain/          # Entidades JPA + enums
│   ├── dto/             # Requests/Responses (auth, news, event) + PagedResponse
│   ├── exception/       # NotFound/Unauthorized/Conflict + handler global + ApiError
│   ├── repository/      # Spring Data JPA
│   ├── security/        # JwtService, filtro JWT, CurrentUser, TenantResolver
│   └── service/         # AuthService, NewsService, EventService, SlugUtil
├── src/main/resources/
│   ├── application.yml           # perfis default/docker
│   └── db/migration/V1__init.sql # schema (Flyway)
├── src/test/...                  # testes unitários e de integração
├── postman/                      # collection para importar
├── Dockerfile                    # build+run (JDK 21)
├── docker-compose.yml            # Postgres + API
└── docker-compose.db.yml         # apenas Postgres (p/ rodar a API local)
```
