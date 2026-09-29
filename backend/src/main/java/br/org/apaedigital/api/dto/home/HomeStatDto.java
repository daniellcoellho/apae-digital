package br.org.apaedigital.api.dto.home;

import jakarta.validation.constraints.NotNull;

/**
 * Numero de impacto da Home, espelhando HomeStat do front.
 */
public record HomeStatDto(
        @NotNull Integer value,
        String suffix,
        String label,
        String hint
) {
}
