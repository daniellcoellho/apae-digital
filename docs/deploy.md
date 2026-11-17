# Deploy gratuito — Vercel + Render + Neon

```
Navegador ──► Vercel (Next.js) ──rewrite /api e /uploads──► Render (Spring Boot, Docker) ──► Neon (Postgres)
```

| Parte | Serviço | Plano | Observação |
|---|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Hobby | Next.js detectado automaticamente |
| Backend | [Render](https://render.com) | Free | Usa `backend/Dockerfile` via `render.yaml`; dorme após 15 min sem acesso |
| Banco | [Neon](https://neon.com) | Free | Postgres gerenciado; não expira (o Postgres grátis do Render expira) |

Os arquivos enviados pelo admin (imagens/PDF) ficam **no banco**, porque o disco do
Render gratuito é apagado a cada restart/deploy.

> Os limites dos planos gratuitos mudam com frequência — confira na página de cada
> serviço ao criar a conta.

---

## 1. Banco — Neon

1. Crie um projeto no Neon. Região: **AWS US East 1 (N. Virginia)** — a mesma do Render.
2. Em **Connect**, desligue a opção *Connection pooling* (use o host **direto**, sem
   `-pooler` no nome — o Flyway e o pool do Spring funcionam melhor assim).
3. Anote host, banco, usuário e senha e monte:

   | Variável | Valor |
   |---|---|
   | `DB_URL` | `jdbc:postgresql://<host>/<banco>?sslmode=require` |
   | `DB_USER` | usuário do Neon |
   | `DB_PASSWORD` | senha do Neon |

   Exemplo de `DB_URL`: `jdbc:postgresql://ep-cool-name-123456.us-east-1.aws.neon.tech/neondb?sslmode=require`

   Atenção: o Neon mostra a URL no formato `postgresql://usuario:senha@host/banco`.
   O Spring precisa do formato **JDBC** acima, com usuário e senha separados.

As tabelas são criadas automaticamente pelo Flyway no primeiro start da API.

## 2. Backend — Render

1. Render → **New → Blueprint** → selecione este repositório. O `render.yaml` da raiz
   cria o serviço `apae-digital-api` (Docker, plano free, região Virginia).
2. Preencha as variáveis pedidas:

   | Variável | Valor |
   |---|---|
   | `DB_URL`, `DB_USER`, `DB_PASSWORD` | do passo 1 |
   | `APP_SEED_ADMIN_EMAIL` | e-mail do admin inicial |
   | `APP_SEED_ADMIN_PASSWORD` | senha forte (o padrão `admin123` só serve para dev) |
   | `APP_CORS_ORIGINS` | URL da Vercel (pode preencher depois, ver passo 4) |

   `APP_JWT_SECRET` é gerado pelo próprio Render.
3. Aguarde o build (alguns minutos na primeira vez) e teste:
   `https://<seu-servico>.onrender.com/actuator/health/liveness` → `{"status":"UP"}`

O admin é criado no **primeiro** start. Trocar `APP_SEED_ADMIN_PASSWORD` depois não altera
a senha de um admin já existente.

## 3. Frontend — Vercel

1. Vercel → **Add New → Project** → importe este repositório (Root Directory: raiz).
2. Em **Environment Variables**:

   | Variável | Valor |
   |---|---|
   | `BACKEND_URL` | `https://<seu-servico>.onrender.com` (sem barra no final) |
   | `NEXT_PUBLIC_API_BASE_URL` | `/api` |
   | `NEXT_PUBLIC_DEFAULT_TENANT` | `apiuna` |

3. Deploy. `BACKEND_URL` é lida no **build** (rewrites do `next.config.mjs`): se mudar
   o endereço do backend, faça um **Redeploy** na Vercel.

O navegador só fala com a Vercel; ela encaminha `/api/*` e `/uploads/*` para o Render.

## 4. CORS

No Render, defina `APP_CORS_ORIGINS` com a URL da Vercel (ex.:
`https://apae-digital.vercel.app`; várias separadas por vírgula). Com o rewrite isso
nem é estritamente necessário, mas evita surpresas se alguém chamar a API direto.

## 5. Manter o backend acordado (recomendado)

O Render gratuito dorme após 15 min sem acesso e leva ~1 min para acordar (o front espera
até 60 s). Para evitar isso, crie um monitor gratuito no
[cron-job.org](https://cron-job.org) ou [UptimeRobot](https://uptimerobot.com):

- URL: `https://<seu-servico>.onrender.com/actuator/health/liveness`
- Intervalo: a cada **10 minutos**

Esse endpoint **não consulta o banco**, então não gasta as horas de computação do Neon.
As 750 h/mês grátis do Render cobrem um serviço ligado o mês inteiro.

## 6. Conferência final

- [ ] Site abre na URL da Vercel com o tema da APAE
- [ ] Login em `/admin/login` com o admin do passo 2
- [ ] Enviar uma imagem (ex.: logo em Identidade Visual) e ver ela no site
- [ ] Criar uma notícia e ver em `/noticias`

## Limitações conhecidas

- **Tenant pelo domínio:** em `*.vercel.app` o subdomínio não corresponde a uma APAE e o
  site usa `NEXT_PUBLIC_DEFAULT_TENANT`. Para várias APAEs, use domínio próprio
  (`apiuna.seudominio.org.br`) apontado para a Vercel.
- **Espaço no Neon:** uploads contam no armazenamento do banco (limite de 5 MB por arquivo).
  Prefira imagens otimizadas.
- **Vercel Hobby** é, pelos termos, para uso não comercial — confirme se atende ao caso.

## Rodar local continua igual

`cd backend && docker compose up --build` (o compose ativa o perfil `docker`) e
`npm run dev` na raiz.
