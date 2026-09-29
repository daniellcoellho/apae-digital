package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.dto.donation.BankAccountDto;
import br.org.apaedigital.api.dto.donation.DonationInfoDto;
import br.org.apaedigital.api.dto.donation.PixInfoDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantDonationRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import({DonationService.class, ObjectMapper.class})
class DonationServiceTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private TenantDonationRepository donationRepository;

    @Autowired
    private DonationService service;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void seed() {
        donationRepository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
    }

    private DonationInfoDto sample() {
        return new DonationInfoDto(
                new PixInfoDto("12966084928", PixInfoDto.PixKeyType.CPF, "129.660.849-28",
                        "APAE DE APIUNA", "APIUNA"),
                List.of(new BankAccountDto("Banco X", "0001", "12345-6", "APAE de Apiúna", "CNPJ 00.000.000/0001-00"))
        );
    }

    @Test
    void getSemConfiguracaoLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant(TENANT))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void getTenantInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getByTenant("nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void savePersisteERetorna() {
        DonationInfoDto saved = service.save(TENANT, sample());

        assertThat(saved.pix().key()).isEqualTo("12966084928");
        assertThat(saved.pix().keyType()).isEqualTo(PixInfoDto.PixKeyType.CPF);
        assertThat(saved.banks()).hasSize(1);
        assertThat(donationRepository.findById(TENANT)).isPresent();
    }

    @Test
    void getAposSaveRetornaDados() {
        service.save(TENANT, sample());

        DonationInfoDto info = service.getByTenant(TENANT);

        assertThat(info.pix().merchantName()).isEqualTo("APAE DE APIUNA");
        assertThat(info.banks().get(0).bank()).isEqualTo("Banco X");
    }

    @Test
    void saveComBanksNullNormalizaParaListaVazia() {
        DonationInfoDto semBanks = new DonationInfoDto(sample().pix(), null);

        DonationInfoDto saved = service.save(TENANT, semBanks);

        assertThat(saved.banks()).isNotNull().isEmpty();
    }

    @Test
    void saveDuasVezesAtualizaSemDuplicar() {
        service.save(TENANT, sample());

        DonationInfoDto alterado = new DonationInfoDto(
                new PixInfoDto("email@apae.org", PixInfoDto.PixKeyType.EMAIL, "email@apae.org",
                        "APAE", "APIUNA"),
                List.of());
        service.save(TENANT, alterado);

        assertThat(donationRepository.count()).isEqualTo(1);
        assertThat(service.getByTenant(TENANT).pix().keyType()).isEqualTo(PixInfoDto.PixKeyType.EMAIL);
    }
}
