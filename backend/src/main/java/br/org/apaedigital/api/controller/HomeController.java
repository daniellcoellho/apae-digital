package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.home.HomeContentDto;
import br.org.apaedigital.api.service.HomeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: conteudo da Home de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class HomeController {

    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping("/{slug}/home")
    public HomeContentDto getHome(@PathVariable String slug) {
        return homeService.getByTenant(slug);
    }
}
