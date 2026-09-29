-- Tema (identidade visual) por tenant, guardado como JSON (texto).
CREATE TABLE tenant_themes (
    tenant_slug VARCHAR(60) PRIMARY KEY REFERENCES tenants(slug),
    payload     TEXT        NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
