package br.org.apaedigital.api.dto.donation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Info de doacao completa, espelhando DonationInfo do front:
 * dados do PIX + lista de contas bancarias.
 */
public record DonationInfoDto(
        @NotNull @Valid PixInfoDto pix,
        @Valid List<BankAccountDto> banks
) {
}
