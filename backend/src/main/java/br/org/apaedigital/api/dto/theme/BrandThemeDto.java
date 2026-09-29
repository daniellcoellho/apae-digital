package br.org.apaedigital.api.dto.theme;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Tema White Label completo, espelhando o BrandTheme do front.
 * Usado tanto no GET (retorno) quanto no PUT (atualizacao) do admin.
 * O campo `tenant` no retorno reflete o slug do tenant dono do tema.
 */
public record BrandThemeDto(
        String tenant,
        @NotBlank String name,
        @NotBlank String city,
        @NotBlank String logoUrl,
        String logoLightUrl,
        @NotNull @Valid BrandColorsDto colors,
        @NotNull @Valid BrandTypographyDto typography,
        @NotBlank String radius,
        @Valid BrandContactDto contact,
        String donationUrl
) {
}
