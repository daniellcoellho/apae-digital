package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.service.UploadService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

/**
 * Serve publicamente os arquivos enviados: GET {app.uploads.public-path}/{tenant}/{arquivo}.
 * O nome gravado e um UUID, entao o conteudo nunca muda e pode ser cacheado por longo prazo.
 */
@RestController
public class UploadFileController {

    private final UploadService uploadService;

    public UploadFileController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @GetMapping("${app.uploads.public-path:/uploads}/{tenant}/{fileName:.+}")
    public ResponseEntity<byte[]> get(@PathVariable String tenant, @PathVariable String fileName) {
        UploadService.StoredFile file = uploadService.load(tenant, fileName);

        ResponseEntity.BodyBuilder response = ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .header("X-Content-Type-Options", "nosniff");

        if ("image/svg+xml".equals(file.contentType())) {
            // SVG pode conter <script>: impede execucao se for aberto direto no navegador.
            response.header("Content-Security-Policy",
                    "default-src 'none'; img-src data:; style-src 'unsafe-inline'; sandbox");
        }
        return response.body(file.data());
    }
}
