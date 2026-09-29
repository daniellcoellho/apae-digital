package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.donation.DonationInfoDto;
import br.org.apaedigital.api.service.DonationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoint publico: dados de doacao (PIX + contas) de um tenant. */
@RestController
@RequestMapping("/api/tenants")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping("/{slug}/donation")
    public DonationInfoDto getDonation(@PathVariable String slug) {
        return donationService.getByTenant(slug);
    }
}
