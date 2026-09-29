package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.theme.BrandThemeDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.ThemeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos do tema (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/theme")
public class AdminThemeController {

    private final ThemeService themeService;

    public AdminThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public BrandThemeDto get() {
        return themeService.getByTenant(tenant());
    }

    @PutMapping
    public BrandThemeDto update(@Valid @RequestBody BrandThemeDto request) {
        return themeService.save(tenant(), request);
    }
}
