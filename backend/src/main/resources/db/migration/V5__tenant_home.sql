-- Conteudo da Home (hero + numeros de impacto) por tenant, guardado como JSON.
CREATE TABLE tenant_home (
    tenant_slug VARCHAR(60) PRIMARY KEY REFERENCES tenants(slug),
    payload     TEXT        NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
