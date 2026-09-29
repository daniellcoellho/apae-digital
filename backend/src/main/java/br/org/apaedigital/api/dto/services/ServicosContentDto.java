package br.org.apaedigital.api.dto.services;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;

import java.util.List;

/**
 * Conteudo de "Atendimentos Prestados", espelhando ServicosContent do front:
 * blocos de abertura (intro) + areas com servicos.
 */
public record ServicosContentDto(
        List<JsonNode> intro,
        @Valid List<ServiceAreaDto> areas
) {
}
