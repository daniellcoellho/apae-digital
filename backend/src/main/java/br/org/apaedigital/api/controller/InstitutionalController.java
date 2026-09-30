package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.institutional.InstitutionalContentDto;
import br.org.apaedigital.api.service.InstitutionalService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: conteudo institucional (aba "Sobre") de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class InstitutionalController {

    private final InstitutionalService institutionalService;

    public InstitutionalController(InstitutionalService institutionalService) {
        this.institutionalService = institutionalService;
    }

    @GetMapping("/{slug}/institutional")
    public InstitutionalContentDto getInstitutional(@PathVariable String slug) {
        return institutionalService.getByTenant(slug);
    }
}
