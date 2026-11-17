package br.org.apaedigital.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

/**
 * Arquivo enviado (upload): metadados, URL publica e o conteudo binario.
 * O binario fica no banco (coluna bytea) para sobreviver a hosts com disco efemero.
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

    /** Conteudo do arquivo. Null em registros antigos, gravados apenas em disco. */
    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "data", columnDefinition = "bytea")
    private byte[] data;

    protected UploadedFile() {
    }

    public UploadedFile(String tenantSlug, String storedName, String originalName,
                        String contentType, long sizeBytes, String url, byte[] data) {
        this.tenantSlug = tenantSlug;
        this.storedName = storedName;
        this.originalName = originalName;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.url = url;
        this.data = data;
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

    public byte[] getData() {
        return data;
    }
}
