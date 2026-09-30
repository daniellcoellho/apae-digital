-- Conteudo institucional (aba "Sobre": subpaginas de blocos) por tenant, como JSON.
CREATE TABLE tenant_institutional (
    tenant_slug VARCHAR(60) PRIMARY KEY REFERENCES tenants(slug),
    payload     TEXT        NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
