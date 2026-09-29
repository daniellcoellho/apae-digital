package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.transparency.TransparencyContentDto;
import br.org.apaedigital.api.dto.transparency.TransparencyDocDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantTransparencyRepository;
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
@Import({TransparencyService.class, ObjectMapper.class})
class TransparencyServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantTransparencyRepository repository;

    @Autowired
    private TransparencyService service;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void seed() {
        repository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
    }

    private TransparencyContentDto sample() {
        return new TransparencyContentDto(
                "Consulte nossos relatórios.",
                List.of(
                        new TransparencyDocDto("Relatório 2025", "Prestação de contas.", "RELATÓRIO", "https://x/r.pdf"),
                        new TransparencyDocDto("Estatuto", "Documento constitutivo.", "INSTITUCIONAL", null)
                )
        );
    }

    @Test
    void getSemConteudoRetornaPadraoVazio() {
        TransparencyContentDto content = service.getByTenant(TENANT);

        assertThat(content.intro()).isEmpty();
        assertThat(content.documents()).isEmpty();
    }

    @Test
    void getTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void savePersisteERetorna() {
        TransparencyContentDto saved = service.save(TENANT, sample());

        assertThat(saved.intro()).isEqualTo("Consulte nossos relatórios.");
        assertThat(saved.documents()).hasSize(2);
        assertThat(repository.findById(TENANT)).isPresent();
    }

    @Test
    void getAposSaveRetornaConteudo() {
        service.save(TENANT, sample());

        TransparencyContentDto content = service.getByTenant(TENANT);

        assertThat(content.documents().get(0).title()).isEqualTo("Relatório 2025");
        assertThat(content.documents().get(1).url()).isNull();
    }

    @Test
    void saveComDocumentsNullNormalizaParaListaVazia() {
        TransparencyContentDto semDocs = new TransparencyContentDto("Intro", null);

        TransparencyContentDto saved = service.save(TENANT, semDocs);

        assertThat(saved.documents()).isNotNull().isEmpty();
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, sample());
        service.save(TENANT, new TransparencyContentDto("Nova intro", List.of()));

        assertThat(repository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).intro()).isEqualTo("Nova intro");
    }
}
