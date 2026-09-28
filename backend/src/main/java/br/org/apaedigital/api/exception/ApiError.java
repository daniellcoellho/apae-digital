package br.org.apaedigital.api.exception;

import java.time.Instant;

/** Corpo padrao de erro da API. */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message
) {
    public static ApiError of(int status, String error, String message) {
        return new ApiError(Instant.now(), status, error, message);
    }
}
