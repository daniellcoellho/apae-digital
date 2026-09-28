package br.org.apaedigital.api.dto.news;

import br.org.apaedigital.api.domain.NewsCategory;
import br.org.apaedigital.api.domain.NewsStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Espelha NewsInput do front. */
public record NewsRequest(
        @NotBlank @Size(min = 3) String title,
        @NotBlank @Size(min = 10, max = 500) String summary,
        @NotBlank @Size(min = 20) String content,
        String coverImageUrl,
        @NotNull NewsCategory category,
        @NotNull NewsStatus status,
        List<String> tags
) {
}
