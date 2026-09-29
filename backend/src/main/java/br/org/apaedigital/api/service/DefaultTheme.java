package br.org.apaedigital.api.service;

import br.org.apaedigital.api.dto.theme.BrandColorsDto;
import br.org.apaedigital.api.dto.theme.BrandContactDto;
import br.org.apaedigital.api.dto.theme.BrandThemeDto;
import br.org.apaedigital.api.dto.theme.BrandTypographyDto;

/**
 * Tema padrao (fallback) quando um tenant ainda nao personalizou sua identidade.
 * Espelha o tema "default" do front (src/theme/themes.ts).
 */
public final class DefaultTheme {

    private DefaultTheme() {
    }

    public static BrandThemeDto forTenant(String tenant, String name, String city) {
        return new BrandThemeDto(
                tenant,
                name != null ? name : "APAE Digital",
                city != null ? city : "Brasil",
                "/tenants/" + tenant + "/logo.svg",
                null,
                new BrandColorsDto(
                        "30 107 82",
                        "61 148 120",
                        "20 74 57",
                        "255 255 255",
                        "234 88 12",
                        "251 146 60",
                        "194 65 12",
                        "255 255 255",
                        "37 99 235",
                        "255 255 255",
                        "236 242 238",
                        "17 24 28",
                        "90 100 105"
                ),
                new BrandTypographyDto(
                        "'Poppins', system-ui, sans-serif",
                        "'Inter', system-ui, sans-serif"
                ),
                "0.75rem",
                new BrandContactDto("", "", city != null ? city : "Brasil", null),
                "/doacoes"
        );
    }
}
