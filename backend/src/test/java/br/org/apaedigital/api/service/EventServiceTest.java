package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.EventCategory;
import br.org.apaedigital.api.dto.event.EventRequest;
import br.org.apaedigital.api.dto.event.EventResponse;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import(EventService.class)
class EventServiceTest {

    @Autowired
    private EventRepository repository;

    @Autowired
    private EventService service;

    private static final String TENANT = "apiuna";
    private final Instant base = Instant.parse("2026-09-15T12:00:00Z");

    private EventRequest sample(String title, Instant start) {
        return new EventRequest(title, "desc", "Sede", start, start.plus(2, ChronoUnit.HOURS), false, EventCategory.EVENTO);
    }

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    @Test
    void createSalvaEvento() {
        EventResponse res = service.create(TENANT, sample("Bingo", base));

        assertThat(res.id()).isNotBlank();
        assertThat(res.title()).isEqualTo("Bingo");
        assertThat(res.category()).isEqualTo("EVENTO");
        assertThat(res.start()).isEqualTo(base.toString());
    }

    @Test
    void listByRangeRetornaEventosNoIntervalo() {
        service.create(TENANT, sample("Dentro", base));
        service.create(TENANT, sample("Fora", base.plus(60, ChronoUnit.DAYS)));

        List<EventResponse> res = service.listByRange(
                TENANT,
                base.minus(1, ChronoUnit.DAYS),
                base.plus(1, ChronoUnit.DAYS));

        assertThat(res).hasSize(1);
        assertThat(res.get(0).title()).isEqualTo("Dentro");
    }

    @Test
    void listByRangeIsolaPorTenant() {
        service.create(TENANT, sample("Apiuna", base));
        service.create("outra", sample("Outra", base));

        List<EventResponse> res = service.listByRange(
                TENANT, base.minus(1, ChronoUnit.DAYS), base.plus(1, ChronoUnit.DAYS));

        assertThat(res).hasSize(1);
        assertThat(res.get(0).title()).isEqualTo("Apiuna");
    }

    @Test
    void updateAlteraCampos() {
        EventResponse created = service.create(TENANT, sample("Original", base));
        UUID id = UUID.fromString(created.id());

        EventRequest changed = new EventRequest("Alterado", "nova desc", "Praça", base, null, true, EventCategory.CAMPANHA);
        EventResponse updated = service.update(TENANT, id, changed);

        assertThat(updated.title()).isEqualTo("Alterado");
        assertThat(updated.allDay()).isTrue();
        assertThat(updated.category()).isEqualTo("CAMPANHA");
        assertThat(updated.end()).isNull();
    }

    @Test
    void updateInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.update(TENANT, UUID.randomUUID(), sample("X", base)))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void getByIdRespeitaTenant() {
        EventResponse created = service.create(TENANT, sample("Da Apiuna", base));
        UUID id = UUID.fromString(created.id());

        assertThat(service.getById(TENANT, id).title()).isEqualTo("Da Apiuna");
        assertThatThrownBy(() -> service.getById("outra", id)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteRemoveEvento() {
        EventResponse created = service.create(TENANT, sample("Apagar", base));
        UUID id = UUID.fromString(created.id());

        service.delete(TENANT, id);

        assertThatThrownBy(() -> service.getById(TENANT, id)).isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.delete(TENANT, UUID.randomUUID()))
                .isInstanceOf(NotFoundException.class);
    }
}
