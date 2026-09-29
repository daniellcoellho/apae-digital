package br.org.apaedigital.api.dto.home;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Bloco "hero" da Home, espelhando HomeContent.hero do front.
 */
public record HomeHeroDto(
        String badge,
        @NotBlank String titlePrefix,
        String titleHighlight,
        String subtitle,
        String imageUrl,
        String primaryCtaLabel,
        String secondaryCtaLabel,
        @NotNull Integer floatingValue,
        String floatingLabel
) {
}
