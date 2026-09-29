package br.org.apaedigital.api.dto.services;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * Servico dentro de uma area, espelhando ServiceItem do front.
 * blocks e uma lista de blocos de conteudo heterogeneos (paragraph, list,
 * highlight, cards, etc.) — o front e a fonte da verdade da estrutura, entao
 * guardamos como JSON generico (JsonNode).
 */
public record ServiceItemDto(
        @NotBlank String id,
        @NotBlank String title,
        String summary,
        String icon,
        List<JsonNode> blocks
) {
}
