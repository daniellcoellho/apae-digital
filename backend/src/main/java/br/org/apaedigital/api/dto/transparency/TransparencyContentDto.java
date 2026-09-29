package br.org.apaedigital.api.dto.transparency;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Conteudo da pagina de transparencia, espelhando TransparencyContent do front:
 * texto de introducao + lista de documentos.
 */
public record TransparencyContentDto(
        @NotNull String intro,
        @Valid List<TransparencyDocDto> documents
) {
}
