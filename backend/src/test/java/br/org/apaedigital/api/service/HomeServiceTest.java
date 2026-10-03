package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.home.HomeCampaignDto;
import br.org.apaedigital.api.dto.home.HomeContentDto;
import br.org.apaedigital.api.dto.home.HomeDonationDto;
import br.org.apaedigital.api.dto.home.HomeDonationTierDto;
import br.org.apaedigital.api.dto.home.HomeHeroDto;
import br.org.apaedigital.api.dto.home.HomeImpactDto;
import br.org.apaedigital.api.dto.home.HomeStatDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantHomeRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import({HomeService.class, ObjectMapper.class})
class HomeServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantHomeRepository repository;

    @Autowired
    private HomeService service;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void seed() {
        repository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
    }

    private HomeContentDto sample() {
        return new HomeContentDto(
                new HomeHeroDto("Apiúna - SC", "Cada conquista começa com", "alguém que apoia",
                        "Subtítulo.", "https://x/img.jpg", "Quero doar", "Ver mais", 312,
                        "pessoas atendidas"),
                new HomeImpactDto("Nosso impacto", "Números que são histórias", "Descrição.",
                        List.of(new HomeStatDto(312, "", "Pessoas atendidas", "Por ano"),
                                new HomeStatDto(5400, "+", "Atendimentos", "Em 2025"))),
                new HomeDonationDto("Doação", "Sua doação ajuda", "Descrição da doação.",
                        List.of(new HomeDonationTierDto("peca", "R$ 30/mês", "Materiais")),
                        new HomeCampaignDto("Van acessível", 68400L, 120000L, 184))
        );
    }

    @Test
    void getSemConteudoRetornaPadrao() {
        HomeContentDto content = service.getByTenant(TENANT);

        assertThat(content.hero().titlePrefix()).isEqualTo("Cada conquista aqui começa com");
        assertThat(content.hero().titleHighlight()).isEqualTo("alguém que apoia");
        assertThat(content.impact().label()).isEqualTo("Nosso impacto");
    }

    @Test
    void getTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void savePersisteERetorna() {
        HomeContentDto saved = service.save(TENANT, sample());

        assertThat(saved.hero().floatingValue()).isEqualTo(312);
        assertThat(saved.impact().stats()).hasSize(2);
        assertThat(repository.findById(TENANT)).isPresent();
    }

    @Test
    void getAposSaveRetornaConteudo() {
        service.save(TENANT, sample());

        HomeContentDto content = service.getByTenant(TENANT);

        assertThat(content.hero().subtitle()).isEqualTo("Subtítulo.");
        assertThat(content.impact().stats().get(1).suffix()).isEqualTo("+");
        // Doacao e campanha persistidas e recuperadas.
        assertThat(content.donation()).isNotNull();
        assertThat(content.donation().campaign().title()).isEqualTo("Van acessível");
        assertThat(content.donation().tiers()).hasSize(1);
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, sample());

        HomeContentDto alterado = new HomeContentDto(
                new HomeHeroDto("X", "Novo título", "destaque", "s", "", "d", "v", 100, "l"),
                new HomeImpactDto("l", "t", "d", List.of()),
                null);
        service.save(TENANT, alterado);

        assertThat(repository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).hero().titlePrefix()).isEqualTo("Novo título");
    }
}
