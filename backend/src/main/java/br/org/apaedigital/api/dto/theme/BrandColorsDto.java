package br.org.apaedigital.api.dto.theme;

import jakarta.validation.constraints.NotBlank;

/**
 * Cores do tema, em canais RGB (ex.: "30 107 82"), como o front consome.
 */
public record BrandColorsDto(
        @NotBlank String primary,
        @NotBlank String primaryLight,
        @NotBlank String primaryDark,
        @NotBlank String primaryContrast,
        @NotBlank String secondary,
        @NotBlank String secondaryLight,
        @NotBlank String secondaryDark,
        @NotBlank String secondaryContrast,
        @NotBlank String accent,
        @NotBlank String surface,
        @NotBlank String surfaceAlt,
        @NotBlank String ink,
        @NotBlank String inkMuted
) {
}
