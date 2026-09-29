-- Conteudo de transparencia (intro + documentos) por tenant, guardado como JSON.
CREATE TABLE tenant_transparency (
    tenant_slug VARCHAR(60) PRIMARY KEY REFERENCES tenants(slug),
    payload     TEXT        NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
