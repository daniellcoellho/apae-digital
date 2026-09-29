package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.theme.BrandColorsDto;
import br.org.apaedigital.api.dto.theme.BrandContactDto;
import br.org.apaedigital.api.dto.theme.BrandThemeDto;
import br.org.apaedigital.api.dto.theme.BrandTypographyDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantThemeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import({ThemeService.class, ObjectMapper.class})
class ThemeServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantThemeRepository themeRepository;

    @Autowired
    private ThemeService service;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void seed() {
        themeRepository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
    }

    private BrandThemeDto sampleTheme() {
        return new BrandThemeDto(
                null,
                "APAE de Apiúna",
                "Apiúna - SC",
                "/tenants/apiuna/logo.svg",
                null,
                new BrandColorsDto("21 128 61", "74 179 111", "15 92 44", "255 255 255",
                        "234 88 12", "251 146 60", "194 65 12", "255 255 255",
                        "2 132 199", "255 255 255", "233 241 235", "20 27 24", "82 96 88"),
                new BrandTypographyDto("'Poppins', sans-serif", "'Inter', sans-serif"),
                "0.875rem",
                new BrandContactDto("contato@apae.org", "(47) 0000-0000", "Apiúna - SC",
                        new BrandContactDto.BrandSocialDto("https://instagram.com/x", null, null)),
                "/doacoes"
        );
    }

    @Test
    void getByTenantSemTemaRetornaPadrao() {
        BrandThemeDto theme = service.getByTenant(TENANT);

        assertThat(theme.tenant()).isEqualTo(TENANT);
        assertThat(theme.name()).isEqualTo("APAE de Apiúna");
        assertThat(theme.city()).isEqualTo("Apiúna - SC");
        assertThat(theme.colors().primary()).isEqualTo("30 107 82"); // cor do tema default
    }

    @Test
    void getByTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void saveDefinePersisteERetornaComTenantCorreto() {
        BrandThemeDto saved = service.save(TENANT, sampleTheme());

        assertThat(saved.tenant()).isEqualTo(TENANT);
        assertThat(saved.colors().primary()).isEqualTo("21 128 61");
        assertThat(themeRepository.findById(TENANT)).isPresent();
    }

    @Test
    void saveForcaOTenantDono() {
        // Mesmo enviando tenant "outro" no corpo, o dono deve ser o do escopo.
        BrandThemeDto comTenantErrado = new BrandThemeDto(
                "outro", "X", "Y", "/l.svg", null,
                sampleTheme().colors(), sampleTheme().typography(), "0.5rem", null, null);

        BrandThemeDto saved = service.save(TENANT, comTenantErrado);

        assertThat(saved.tenant()).isEqualTo(TENANT);
    }

    @Test
    void getAposSaveRetornaTemaPersonalizado() {
        service.save(TENANT, sampleTheme());

        BrandThemeDto theme = service.getByTenant(TENANT);

        assertThat(theme.colors().primary()).isEqualTo("21 128 61");
        assertThat(theme.radius()).isEqualTo("0.875rem");
        assertThat(theme.contact().social().instagram()).isEqualTo("https://instagram.com/x");
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, sampleTheme());

        BrandThemeDto alterado = new BrandThemeDto(
                null, "Novo Nome", "Nova Cidade", "/novo.svg", null,
                sampleTheme().colors(), sampleTheme().typography(), "1rem",
                sampleTheme().contact(), "/doar");
        service.save(TENANT, alterado);

        assertThat(themeRepository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).name()).isEqualTo("Novo Nome");
    }
}
