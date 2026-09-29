package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.transparency.TransparencyContentDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.TransparencyService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos de transparencia (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/transparency")
public class AdminTransparencyController {

    private final TransparencyService transparencyService;

    public AdminTransparencyController(TransparencyService transparencyService) {
        this.transparencyService = transparencyService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public TransparencyContentDto get() {
        return transparencyService.getByTenant(tenant());
    }

    @PutMapping
    public TransparencyContentDto update(@Valid @RequestBody TransparencyContentDto request) {
        return transparencyService.save(tenant(), request);
    }
}
