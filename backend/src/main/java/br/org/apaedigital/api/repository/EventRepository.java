package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<CalendarEvent, UUID> {

    List<CalendarEvent> findByTenantSlugAndStartBetweenOrderByStartAsc(
            String tenantSlug, Instant start, Instant end);

    Optional<CalendarEvent> findByTenantSlugAndId(String tenantSlug, UUID id);
}
