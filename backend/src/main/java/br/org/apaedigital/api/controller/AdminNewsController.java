package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.PagedResponse;
import br.org.apaedigital.api.dto.news.NewsRequest;
import br.org.apaedigital.api.dto.news.NewsResponse;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/** Endpoints administrativos de noticias (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/news")
public class AdminNewsController {

    private final NewsService newsService;

    public AdminNewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public PagedResponse<NewsResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return newsService.listAll(tenant(), page, size);
    }

    @GetMapping("/{id}")
    public NewsResponse getById(@PathVariable UUID id) {
        return newsService.getById(tenant(), id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsResponse create(@Valid @RequestBody NewsRequest request) {
        return newsService.create(tenant(), request);
    }

    @PutMapping("/{id}")
    public NewsResponse update(@PathVariable UUID id, @Valid @RequestBody NewsRequest request) {
        return newsService.update(tenant(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        newsService.delete(tenant(), id);
    }
}
