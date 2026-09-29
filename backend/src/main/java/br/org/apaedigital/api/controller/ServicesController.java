package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.services.ServicosContentDto;
import br.org.apaedigital.api.service.ServicesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: conteudo de servicos (atendimentos) de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class ServicesController {

    private final ServicesService servicesService;

    public ServicesController(ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    @GetMapping("/{slug}/services")
    public ServicosContentDto getServices(@PathVariable String slug) {
        return servicesService.getByTenant(slug);
    }
}
