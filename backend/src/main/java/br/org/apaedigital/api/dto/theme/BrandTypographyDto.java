package br.org.apaedigital.api.dto.theme;

import jakarta.validation.constraints.NotBlank;

public record BrandTypographyDto(
        @NotBlank String heading,
        @NotBlank String body
) {
}
