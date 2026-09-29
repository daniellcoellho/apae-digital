package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.home.HomeContentDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.HomeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos da Home (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/home")
public class AdminHomeController {

    private final HomeService homeService;

    public AdminHomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public HomeContentDto get() {
        return homeService.getByTenant(tenant());
    }

    @PutMapping
    public HomeContentDto update(@Valid @RequestBody HomeContentDto request) {
        return homeService.save(tenant(), request);
    }
}
