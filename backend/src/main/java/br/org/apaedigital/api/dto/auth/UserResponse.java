package br.org.apaedigital.api.dto.auth;

import br.org.apaedigital.api.domain.User;

/** Espelha o tipo User do front. */
public record UserResponse(
        String id,
        String name,
        String email,
        String role,
        String tenant
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getTenantSlug()
        );
    }
}
