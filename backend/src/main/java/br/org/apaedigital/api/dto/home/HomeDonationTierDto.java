package br.org.apaedigital.api.dto.home;

/**
 * Faixa de doacao sugerida da Home, espelhando DonationTier do front.
 */
public record HomeDonationTierDto(
        String icon,
        String value,
        String desc
) {
}
