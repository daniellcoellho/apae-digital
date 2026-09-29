package br.org.apaedigital.api.dto.home;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

/**
 * Conteudo editavel da Home, espelhando HomeContent do front: hero + impact.
 */
public record HomeContentDto(
        @NotNull @Valid HomeHeroDto hero,
        @NotNull @Valid HomeImpactDto impact
) {
}
