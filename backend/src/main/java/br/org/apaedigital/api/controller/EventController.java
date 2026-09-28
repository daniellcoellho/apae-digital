package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.event.EventResponse;
import br.org.apaedigital.api.security.TenantResolver;
import br.org.apaedigital.api.service.EventService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Endpoints publicos de eventos. */
@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final TenantResolver tenantResolver;

    public EventController(EventService eventService, TenantResolver tenantResolver) {
        this.eventService = eventService;
        this.tenantResolver = tenantResolver;
    }

    @GetMapping
    public List<EventResponse> listByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end,
            HttpServletRequest request) {
        return eventService.listByRange(tenantResolver.resolve(request), start, end);
    }

    @GetMapping("/{id}")
    public EventResponse getById(@PathVariable UUID id, HttpServletRequest request) {
        return eventService.getById(tenantResolver.resolve(request), id);
    }
}
