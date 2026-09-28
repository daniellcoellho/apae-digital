package br.org.apaedigital.api.security;

import br.org.apaedigital.api.domain.UserRole;

import java.util.UUID;

/**
 * Principal autenticado, extraido do JWT. Fica disponivel no SecurityContext.
 */
public record AuthenticatedUser(
        UUID id,
        String email,
        String name,
        UserRole role,
        String tenant
) {
}
