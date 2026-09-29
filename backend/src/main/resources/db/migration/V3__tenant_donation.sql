-- Dados de doacao (PIX + contas) por tenant, guardados como JSON (texto).
CREATE TABLE tenant_donations (
    tenant_slug VARCHAR(60) PRIMARY KEY REFERENCES tenants(slug),
    payload     TEXT        NOT NULL,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
