package br.org.apaedigital.api.dto.home;

import jakarta.validation.Valid;

import java.util.List;

/**
 * Bloco "impact" (numeros de impacto) da Home, espelhando HomeContent.impact.
 */
public record HomeImpactDto(
        String label,
        String title,
        String description,
        @Valid List<HomeStatDto> stats
) {
}
