package br.org.apaedigital.api.dto.donation;

import jakarta.validation.constraints.NotBlank;

/**
 * Conta bancaria para transferencia, espelhando BankAccount do front.
 * document e opcional.
 */
public record BankAccountDto(
        @NotBlank String bank,
        @NotBlank String agency,
        @NotBlank String account,
        @NotBlank String holder,
        String document
) {
}
