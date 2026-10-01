package br.org.apaedigital.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * Metadados de um arquivo enviado (upload). O binario fica em disco;
 * aqui guardamos o rastreio por tenant e a URL publica de acesso.
 */
@Entity
@Table(name = "uploaded_file")
public class UploadedFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_slug", nullable = false, length = 120)
    private String tenantSlug;

    @Column(name = "stored_name", nullable = false, length = 255)
    private String storedName;

    @Column(name = "original_name", length = 255)
    private String originalName;

    @Column(name = "content_type", nullable = false, length = 120)
    private String contentType;

    @Column(name = "size_bytes", nullable = false)
    private long sizeBytes;

    @Column(name = "url", nullable = false, length = 512)
    private String url;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected UploadedFile() {
    }

    public UploadedFile(String tenantSlug, String storedName, String originalName,
                        String contentType, long sizeBytes, String url) {
        this.tenantSlug = tenantSlug;
        this.storedName = storedName;
        this.originalName = originalName;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.url = url;
    }

    public Long getId() {
        return id;
    }

    public String getTenantSlug() {
        return tenantSlug;
    }

    public String getStoredName() {
        return storedName;
    }

    public String getOriginalName() {
        return originalName;
    }

    public String getContentType() {
        return contentType;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public String getUrl() {
        return url;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
