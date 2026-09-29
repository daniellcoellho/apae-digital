package br.org.apaedigital.api.dto.transparency;

import jakarta.validation.constraints.NotBlank;

/**
 * Documento de transparencia (prestacao de contas), espelhando o front.
 * url (link do arquivo) e opcional.
 */
public record TransparencyDocDto(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String tag,
        String url
) {
}
