package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.upload.UploadResponse;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.UploadService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Upload de arquivos (imagens/PDF) do tenant autenticado. Devolve a URL publica. */
@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    private final UploadService uploadService;

    public AdminUploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse upload(@RequestParam("file") MultipartFile file) {
        return uploadService.store(tenant(), file);
    }
}
