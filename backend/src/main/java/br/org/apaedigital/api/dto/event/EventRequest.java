package br.org.apaedigital.api.dto.event;

import br.org.apaedigital.api.domain.EventCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

/** Espelha EventInput do front. */
public record EventRequest(
        @NotBlank String title,
        String description,
        String location,
        @NotNull Instant start,
        Instant end,
        boolean allDay,
        @NotNull EventCategory category
) {
}
