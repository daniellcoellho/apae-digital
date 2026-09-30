package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.institutional.InstitutionalContentDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.InstitutionalService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos do conteudo institucional (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/institutional")
public class AdminInstitutionalController {

    private final InstitutionalService institutionalService;

    public AdminInstitutionalController(InstitutionalService institutionalService) {
        this.institutionalService = institutionalService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public InstitutionalContentDto get() {
        return institutionalService.getByTenant(tenant());
    }

    @PutMapping
    public InstitutionalContentDto update(@Valid @RequestBody InstitutionalContentDto request) {
        return institutionalService.save(tenant(), request);
    }
}
