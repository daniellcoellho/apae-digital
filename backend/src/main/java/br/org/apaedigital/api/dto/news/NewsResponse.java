package br.org.apaedigital.api.dto.news;

import br.org.apaedigital.api.domain.NewsArticle;

import java.util.List;

/** Espelha NewsArticle do front (datas em ISO-8601). */
public record NewsResponse(
        String id,
        String title,
        String slug,
        String summary,
        String content,
        String coverImageUrl,
        String category,
        String status,
        String publishedAt,
        String author,
        List<String> tags,
        String createdAt,
        String updatedAt
) {
    public static NewsResponse from(NewsArticle n) {
        return new NewsResponse(
                n.getId().toString(),
                n.getTitle(),
                n.getSlug(),
                n.getSummary(),
                n.getContent(),
                n.getCoverImageUrl(),
                n.getCategory().name(),
                n.getStatus().name(),
                n.getPublishedAt() != null ? n.getPublishedAt().toString() : null,
                n.getAuthor(),
                n.getTags(),
                n.getCreatedAt().toString(),
                n.getUpdatedAt().toString()
        );
    }
}
