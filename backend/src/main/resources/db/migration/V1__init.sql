-- Schema inicial do APAE Digital

CREATE TABLE tenants (
    slug    VARCHAR(60)  PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    city    VARCHAR(255)
);

CREATE TABLE users (
    id            UUID         PRIMARY KEY,
    tenant_slug   VARCHAR(60)  NOT NULL REFERENCES tenants(slug),
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uk_users_tenant_email UNIQUE (tenant_slug, email)
);

CREATE TABLE news (
    id             UUID         PRIMARY KEY,
    tenant_slug    VARCHAR(60)  NOT NULL REFERENCES tenants(slug),
    title          VARCHAR(255) NOT NULL,
    slug           VARCHAR(255) NOT NULL,
    summary        VARCHAR(500) NOT NULL,
    content        TEXT         NOT NULL,
    cover_image_url VARCHAR(1000),
    category       VARCHAR(20)  NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    author         VARCHAR(255),
    published_at   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uk_news_tenant_slug UNIQUE (tenant_slug, slug)
);

CREATE TABLE news_tags (
    news_id UUID        NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag     VARCHAR(100) NOT NULL
);
CREATE INDEX idx_news_tags_news_id ON news_tags(news_id);

CREATE INDEX idx_news_tenant_status ON news(tenant_slug, status);

CREATE TABLE events (
    id          UUID         PRIMARY KEY,
    tenant_slug VARCHAR(60)  NOT NULL REFERENCES tenants(slug),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    location    VARCHAR(255),
    start_at    TIMESTAMPTZ  NOT NULL,
    end_at      TIMESTAMPTZ,
    all_day     BOOLEAN      NOT NULL DEFAULT FALSE,
    category    VARCHAR(20)  NOT NULL
);

CREATE INDEX idx_events_tenant_start ON events(tenant_slug, start_at);
