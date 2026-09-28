package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.PagedResponse;
import br.org.apaedigital.api.dto.news.NewsResponse;
import br.org.apaedigital.api.security.TenantResolver;
import br.org.apaedigital.api.service.NewsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints publicos de noticias. */
@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService newsService;
    private final TenantResolver tenantResolver;

    public NewsController(NewsService newsService, TenantResolver tenantResolver) {
        this.newsService = newsService;
        this.tenantResolver = tenantResolver;
    }

    @GetMapping
    public PagedResponse<NewsResponse> listPublished(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            HttpServletRequest request) {
        return newsService.listPublished(tenantResolver.resolve(request), page, size);
    }

    @GetMapping("/slug/{slug}")
    public NewsResponse getBySlug(@PathVariable String slug, HttpServletRequest request) {
        return newsService.getBySlug(tenantResolver.resolve(request), slug);
    }
}
