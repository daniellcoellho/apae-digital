package br.org.apaedigital.api.dto.services;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

/**
 * Grande area de atendimento (ex.: Saude, Educacional), espelhando ServiceArea.
 */
public record ServiceAreaDto(
        @NotBlank String id,
        @NotBlank String title,
        String description,
        @Valid List<ServiceItemDto> services
) {
}
