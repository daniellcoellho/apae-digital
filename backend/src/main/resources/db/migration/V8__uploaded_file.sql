-- Rastreio dos arquivos enviados (uploads) por tenant.
-- O binario vive em disco; esta tabela guarda os metadados e a URL publica.
CREATE TABLE uploaded_file (
    id            BIGSERIAL PRIMARY KEY,
    tenant_slug   VARCHAR(120) NOT NULL,
    stored_name   VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    content_type  VARCHAR(120) NOT NULL,
    size_bytes    BIGINT       NOT NULL,
    url           VARCHAR(512) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_uploaded_file_tenant ON uploaded_file (tenant_slug);
CREATE UNIQUE INDEX ux_uploaded_file_stored_name ON uploaded_file (stored_name);
