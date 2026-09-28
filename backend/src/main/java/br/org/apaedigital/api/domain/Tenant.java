package br.org.apaedigital.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Uma APAE (tenant). O slug identifica o tenant no dominio/JWT.
 */
@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @Column(nullable = false, unique = true, length = 60)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String city;

    protected Tenant() {
    }

    public Tenant(String slug, String name, String city) {
        this.slug = slug;
        this.name = name;
        this.city = city;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
