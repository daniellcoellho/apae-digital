package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.institutional.InstitutionalContentDto;
import br.org.apaedigital.api.dto.institutional.InstitutionalPageDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantInstitutionalRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.databind.JsonNode;
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
@Import({InstitutionalService.class, ObjectMapper.class})
class InstitutionalServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantInstitutionalRepository repository;

    @Autowired
    private InstitutionalService service;

    @Autowired
    private ObjectMapper mapper;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void seed() {
        repository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
    }

    private JsonNode paragraph(String text) {
        return mapper.createObjectNode().put("type", "paragraph").put("text", text);
    }

    private InstitutionalPageDto page(String slug, String title, int order) {
        return new InstitutionalPageDto(slug, title, "Subtítulo de " + title, order,
                List.of(paragraph("Conteúdo de " + title)));
    }

    @Test
    void getSemConteudoRetornaListaVazia() {
        InstitutionalContentDto content = service.getByTenant(TENANT);
        assertThat(content.pages()).isEmpty();
    }

    @Test
    void getTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void savePersisteEOrdenaPorOrder() {
        var dto = new InstitutionalContentDto(List.of(
                page("convenios", "Convênios", 3),
                page("historico", "Histórico", 1),
                page("presidente", "Presidente", 2)
        ));

        InstitutionalContentDto saved = service.save(TENANT, dto);

        assertThat(saved.pages()).extracting(InstitutionalPageDto::slug)
                .containsExactly("historico", "presidente", "convenios");
        assertThat(repository.findById(TENANT)).isPresent();
    }

    @Test
    void getAposSavePreservaBlocosEOrdem() {
        service.save(TENANT, new InstitutionalContentDto(List.of(
                page("b", "B", 2), page("a", "A", 1))));

        InstitutionalContentDto content = service.getByTenant(TENANT);

        assertThat(content.pages()).extracting(InstitutionalPageDto::slug).containsExactly("a", "b");
        assertThat(content.pages().get(0).blocks().get(0).get("type").asText()).isEqualTo("paragraph");
    }

    @Test
    void saveComPagesNullNormalizaParaVazio() {
        InstitutionalContentDto saved = service.save(TENANT, new InstitutionalContentDto(null));
        assertThat(saved.pages()).isNotNull().isEmpty();
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, new InstitutionalContentDto(List.of(page("a", "A", 1))));
        service.save(TENANT, new InstitutionalContentDto(List.of(page("x", "X", 1), page("y", "Y", 2))));

        assertThat(repository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).pages()).hasSize(2);
    }
}
