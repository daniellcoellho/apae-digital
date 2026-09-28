package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.NewsArticle;
import br.org.apaedigital.api.domain.NewsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NewsRepository extends JpaRepository<NewsArticle, UUID> {

    Page<NewsArticle> findByTenantSlugAndStatusOrderByPublishedAtDesc(
            String tenantSlug, NewsStatus status, Pageable pageable);

    Page<NewsArticle> findByTenantSlugOrderByUpdatedAtDesc(String tenantSlug, Pageable pageable);

    Optional<NewsArticle> findByTenantSlugAndSlug(String tenantSlug, String slug);

    Optional<NewsArticle> findByTenantSlugAndId(String tenantSlug, UUID id);

    boolean existsByTenantSlugAndSlug(String tenantSlug, String slug);
}
