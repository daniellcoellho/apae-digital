package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.services.ServicosContentDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.ServicesService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos de servicos (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/services")
public class AdminServicesController {

    private final ServicesService servicesService;

    public AdminServicesController(ServicesService servicesService) {
        this.servicesService = servicesService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public ServicosContentDto get() {
        return servicesService.getByTenant(tenant());
    }

    @PutMapping
    public ServicosContentDto update(@Valid @RequestBody ServicosContentDto request) {
        return servicesService.save(tenant(), request);
    }
}
