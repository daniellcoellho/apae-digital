package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.transparency.TransparencyContentDto;
import br.org.apaedigital.api.service.TransparencyService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: conteudo de transparencia de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class TransparencyController {

    private final TransparencyService transparencyService;

    public TransparencyController(TransparencyService transparencyService) {
        this.transparencyService = transparencyService;
    }

    @GetMapping("/{slug}/transparency")
    public TransparencyContentDto getTransparency(@PathVariable String slug) {
        return transparencyService.getByTenant(slug);
    }
}
