package br.org.apaedigital.api.dto.upload;

/**
 * Resposta do upload: a URL publica do arquivo e seus metadados.
 */
public record UploadResponse(
        String url,
        String fileName,
        String contentType,
        long size
) {
}
