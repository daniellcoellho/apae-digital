package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.donation.DonationInfoDto;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Endpoints administrativos de doacao (escopo pelo tenant do JWT). */
@RestController
@RequestMapping("/api/admin/donation")
public class AdminDonationController {

    private final DonationService donationService;

    public AdminDonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    private String tenant() {
        return CurrentUser.require().tenant();
    }

    @GetMapping
    public DonationInfoDto get() {
        return donationService.getByTenant(tenant());
    }

    @PutMapping
    public DonationInfoDto update(@Valid @RequestBody DonationInfoDto request) {
        return donationService.save(tenant(), request);
    }
}
