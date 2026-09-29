package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.theme.BrandThemeDto;
import br.org.apaedigital.api.service.ThemeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: tema (identidade visual) de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class ThemeController {

    private final ThemeService themeService;

    public ThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    @GetMapping("/{slug}/theme")
    public BrandThemeDto getTheme(@PathVariable String slug) {
        return themeService.getByTenant(slug);
    }
}
