package br.org.apaedigital.api.dto.home;

/**
 * Campanha em destaque da Home, espelhando HomeCampaign do front.
 */
public record HomeCampaignDto(
        String title,
        Long raised,
        Long goal,
        Integer donors
) {
}
