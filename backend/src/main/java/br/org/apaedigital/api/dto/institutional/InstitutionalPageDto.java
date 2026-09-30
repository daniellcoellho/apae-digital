package br.org.apaedigital.api.dto.institutional;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Subpagina institucional (aba "Sobre"), espelhando InstitutionalPage do front.
 * blocks e conteudo heterogeneo (JSON generico), definido pelo front.
 */
public record InstitutionalPageDto(
        @NotBlank String slug,
        @NotBlank String title,
        String subtitle,
        @NotNull Integer order,
        List<JsonNode> blocks
) {
}
