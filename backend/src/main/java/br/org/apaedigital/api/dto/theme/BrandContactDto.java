package br.org.apaedigital.api.dto.theme;

/**
 * Contato exibido no rodape. social e opcional.
 */
public record BrandContactDto(
        String email,
        String phone,
        String address,
        BrandSocialDto social
) {
    public record BrandSocialDto(
            String instagram,
            String facebook,
            String youtube
    ) {
    }
}
