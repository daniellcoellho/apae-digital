package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.NewsArticle;
import br.org.apaedigital.api.domain.NewsStatus;
import br.org.apaedigital.api.dto.PagedResponse;
import br.org.apaedigital.api.dto.news.NewsRequest;
import br.org.apaedigital.api.dto.news.NewsResponse;
import br.org.apaedigital.api.exception.ConflictException;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.NewsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {

    private final NewsRepository repository;

    public NewsService(NewsRepository repository) {
        this.repository = repository;
    }

    // ---- Publico ----

    @Transactional(readOnly = true)
    public PagedResponse<NewsResponse> listPublished(String tenant, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NewsArticle> result = repository
                .findByTenantSlugAndStatusOrderByPublishedAtDesc(tenant, NewsStatus.PUBLISHED, pageable);
        return PagedResponse.from(result, NewsResponse::from);
    }

    @Transactional(readOnly = true)
    public NewsResponse getBySlug(String tenant, String slug) {
        NewsArticle article = repository.findByTenantSlugAndSlug(tenant, slug)
                .orElseThrow(() -> new NotFoundException("Notícia não encontrada."));
        return NewsResponse.from(article);
    }

    // ---- Admin ----

    @Transactional(readOnly = true)
    public PagedResponse<NewsResponse> listAll(String tenant, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NewsArticle> result = repository.findByTenantSlugOrderByUpdatedAtDesc(tenant, pageable);
        return PagedResponse.from(result, NewsResponse::from);
    }

    @Transactional(readOnly = true)
    public NewsResponse getById(String tenant, UUID id) {
        return NewsResponse.from(findOwned(tenant, id));
    }

    @Transactional
    public NewsResponse create(String tenant, NewsRequest req) {
        NewsArticle article = new NewsArticle();
        article.setTenantSlug(tenant);
        applyFields(article, req);
        article.setSlug(uniqueSlug(tenant, req.title(), null));
        applyPublishedAt(article, null);
        return NewsResponse.from(repository.save(article));
    }

    @Transactional
    public NewsResponse update(String tenant, UUID id, NewsRequest req) {
        NewsArticle article = findOwned(tenant, id);
        NewsStatus previousStatus = article.getStatus();
        applyFields(article, req);
        // mantem o slug estavel; se o titulo mudar e o slug antigo colidir, gera novo
        applyPublishedAt(article, previousStatus);
        return NewsResponse.from(repository.save(article));
    }

    @Transactional
    public void delete(String tenant, UUID id) {
        NewsArticle article = findOwned(tenant, id);
        repository.delete(article);
    }

    // ---- Helpers ----

    private NewsArticle findOwned(String tenant, UUID id) {
        return repository.findByTenantSlugAndId(tenant, id)
                .orElseThrow(() -> new NotFoundException("Notícia não encontrada."));
    }

    private void applyFields(NewsArticle article, NewsRequest req) {
        article.setTitle(req.title());
        article.setSummary(req.summary());
        article.setContent(req.content());
        article.setCoverImageUrl(req.coverImageUrl());
        article.setCategory(req.category());
        article.setStatus(req.status());
        article.setTags(req.tags() != null ? new ArrayList<>(req.tags()) : new ArrayList<>());
    }

    /** Define publishedAt quando a noticia passa a (ou nasce) PUBLISHED. */
    private void applyPublishedAt(NewsArticle article, NewsStatus previousStatus) {
        boolean nowPublished = article.getStatus() == NewsStatus.PUBLISHED;
        boolean wasPublished = previousStatus == NewsStatus.PUBLISHED;
        if (nowPublished && !wasPublished && article.getPublishedAt() == null) {
            article.setPublishedAt(Instant.now());
        }
        if (!nowPublished) {
            article.setPublishedAt(null);
        }
    }

    private String uniqueSlug(String tenant, String title, UUID ignoreId) {
        String base = SlugUtil.slugify(title);
        if (base.isEmpty()) {
            base = "noticia";
        }
        String candidate = base;
        int i = 2;
        List<String> tried = new ArrayList<>();
        while (repository.existsByTenantSlugAndSlug(tenant, candidate)) {
            candidate = base + "-" + i++;
            tried.add(candidate);
            if (i > 1000) {
                throw new ConflictException("Não foi possível gerar um slug único.");
            }
        }
        return candidate;
    }
}
