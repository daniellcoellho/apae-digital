package br.org.apaedigital.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * Conteudo de transparencia de um tenant, guardado como JSON.
 * Um registro por tenant (slug e a chave primaria).
 */
@Entity
@Table(name = "tenant_transparency")
public class TenantTransparency {

    @Id
    @Column(name = "tenant_slug", nullable = false, length = 60)
    private String tenantSlug;

    @Column(name = "payload", nullable = false, columnDefinition = "text")
    private String payload;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected TenantTransparency() {
    }

    public TenantTransparency(String tenantSlug, String payload) {
        this.tenantSlug = tenantSlug;
        this.payload = payload;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getTenantSlug() {
        return tenantSlug;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
