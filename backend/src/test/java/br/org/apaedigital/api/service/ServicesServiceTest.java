package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.services.ServiceAreaDto;
import br.org.apaedigital.api.dto.services.ServiceItemDto;
import br.org.apaedigital.api.dto.services.ServicosContentDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantServicesRepository;
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
@Import({ServicesService.class, ObjectMapper.class})
class ServicesServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantServicesRepository repository;

    @Autowired
    private ServicesService service;

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

    private JsonNode list(String title, String... items) {
        var node = mapper.createObjectNode();
        node.put("type", "list").put("title", title).put("variant", "check");
        var arr = node.putArray("items");
        for (String i : items) arr.add(i);
        return node;
    }

    private ServicosContentDto sample() {
        ServiceItemDto fisio = new ServiceItemDto(
                "fisioterapia", "Fisioterapia", "Autonomia e funcionalidade.", "🧘",
                List.of(paragraph("A fisioterapia previne e trata..."),
                        list("Modalidades", "Convencional", "Pediatria", "Neurologia")));
        ServiceItemDto psico = new ServiceItemDto(
                "psicologia", "Psicologia", "Avaliação e atendimento.", "🧠",
                List.of(paragraph("Atendimentos individuais e em grupo.")));
        ServiceAreaDto saude = new ServiceAreaDto("saude", "Área da saúde", "Acompanhamento técnico.",
                List.of(fisio, psico));
        return new ServicosContentDto(List.of(paragraph("Proposta interdisciplinar.")), List.of(saude));
    }

    @Test
    void getSemConteudoLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant(TENANT))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void getTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void savePersisteERetorna() {
        ServicosContentDto saved = service.save(TENANT, sample());

        assertThat(saved.areas()).hasSize(1);
        assertThat(saved.areas().get(0).services()).hasSize(2);
        assertThat(repository.findById(TENANT)).isPresent();
    }

    @Test
    void getAposSavePreservaBlocosHeterogeneos() {
        service.save(TENANT, sample());

        ServicosContentDto content = service.getByTenant(TENANT);

        assertThat(content.intro().get(0).get("type").asText()).isEqualTo("paragraph");
        var fisioBlocks = content.areas().get(0).services().get(0).blocks();
        assertThat(fisioBlocks).hasSize(2);
        assertThat(fisioBlocks.get(1).get("type").asText()).isEqualTo("list");
        assertThat(fisioBlocks.get(1).get("items")).hasSize(3);
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, sample());
        service.save(TENANT, new ServicosContentDto(List.of(), List.of()));

        assertThat(repository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).areas()).isEmpty();
    }
}
