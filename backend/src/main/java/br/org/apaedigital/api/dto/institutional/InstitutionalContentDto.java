package br.org.apaedigital.api.dto.institutional;

import jakarta.validation.Valid;

import java.util.List;

/**
 * Conteudo institucional completo de um tenant: a lista de subpaginas ("Sobre").
 * Envolver a lista num objeto facilita validacao e evolucao futura.
 */
public record InstitutionalContentDto(
        @Valid List<InstitutionalPageDto> pages
) {
}
