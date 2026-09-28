package br.org.apaedigital.api.dto.event;

import br.org.apaedigital.api.domain.CalendarEvent;

/** Espelha CalendarEvent do front (datas em ISO-8601). */
public record EventResponse(
        String id,
        String title,
        String description,
        String location,
        String start,
        String end,
        boolean allDay,
        String category
) {
    public static EventResponse from(CalendarEvent e) {
        return new EventResponse(
                e.getId().toString(),
                e.getTitle(),
                e.getDescription(),
                e.getLocation(),
                e.getStart().toString(),
                e.getEnd() != null ? e.getEnd().toString() : null,
                e.isAllDay(),
                e.getCategory().name()
        );
    }
}
