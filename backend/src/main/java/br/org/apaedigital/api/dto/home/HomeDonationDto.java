package br.org.apaedigital.api.dto.home;

import jakarta.validation.Valid;

import java.util.List;

/**
 * Secao de doacao da Home (texto + faixas + campanha), espelhando HomeDonation do front.
 */
public record HomeDonationDto(
        String label,
        String title,
        String description,
        @Valid List<HomeDonationTierDto> tiers,
        @Valid HomeCampaignDto campaign
) {
}
