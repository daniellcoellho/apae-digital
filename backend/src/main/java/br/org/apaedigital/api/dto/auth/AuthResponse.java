package br.org.apaedigital.api.dto.auth;

/** Espelha AuthResponse do front. */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {
}
