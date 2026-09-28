package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.CalendarEvent;
import br.org.apaedigital.api.dto.event.EventRequest;
import br.org.apaedigital.api.dto.event.EventResponse;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository repository;

    public EventService(EventRepository repository) {
        this.repository = repository;
    }

    // ---- Publico ----

    @Transactional(readOnly = true)
    public List<EventResponse> listByRange(String tenant, Instant start, Instant end) {
        return repository.findByTenantSlugAndStartBetweenOrderByStartAsc(tenant, start, end)
                .stream()
                .map(EventResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EventResponse getById(String tenant, UUID id) {
        return EventResponse.from(findOwned(tenant, id));
    }

    // ---- Admin ----

    @Transactional
    public EventResponse create(String tenant, EventRequest req) {
        CalendarEvent event = new CalendarEvent();
        event.setTenantSlug(tenant);
        applyFields(event, req);
        return EventResponse.from(repository.save(event));
    }

    @Transactional
    public EventResponse update(String tenant, UUID id, EventRequest req) {
        CalendarEvent event = findOwned(tenant, id);
        applyFields(event, req);
        return EventResponse.from(repository.save(event));
    }

    @Transactional
    public void delete(String tenant, UUID id) {
        CalendarEvent event = findOwned(tenant, id);
        repository.delete(event);
    }

    // ---- Helpers ----

    private CalendarEvent findOwned(String tenant, UUID id) {
        return repository.findByTenantSlugAndId(tenant, id)
                .orElseThrow(() -> new NotFoundException("Evento não encontrado."));
    }

    private void applyFields(CalendarEvent event, EventRequest req) {
        event.setTitle(req.title());
        event.setDescription(req.description());
        event.setLocation(req.location());
        event.setStart(req.start());
        event.setEnd(req.end());
        event.setAllDay(req.allDay());
        event.setCategory(req.category());
    }
}
