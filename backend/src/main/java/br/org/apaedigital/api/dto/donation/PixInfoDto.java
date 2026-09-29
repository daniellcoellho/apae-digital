package br.org.apaedigital.api.dto.donation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Dados da chave PIX, espelhando DonationInfo.pix do front.
 * keyType: CPF | CNPJ | EMAIL | TELEFONE | ALEATORIA.
 */
public record PixInfoDto(
        @NotBlank String key,
        @NotNull PixKeyType keyType,
        @NotBlank String keyDisplay,
        @NotBlank String merchantName,
        @NotBlank String merchantCity
) {
    public enum PixKeyType {
        CPF, CNPJ, EMAIL, TELEFONE, ALEATORIA
    }
}
