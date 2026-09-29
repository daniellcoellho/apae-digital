package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.TenantDonation;
import br.org.apaedigital.api.dto.donation.DonationInfoDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantDonationRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DonationService {

    private final TenantDonationRepository donationRepository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public DonationService(TenantDonationRepository donationRepository,
                           TenantRepository tenantRepository,
                           ObjectMapper objectMapper) {
        this.donationRepository = donationRepository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna a info de doacao do tenant.
     * Diferente do tema, nao ha um "padrao": se a APAE ainda nao configurou,
     * lanca NotFound (o front trata a ausencia mostrando "em breve").
     */
    @Transactional(readOnly = true)
    public DonationInfoDto getByTenant(String tenant) {
        ensureTenantExists(tenant);
        return donationRepository.findById(tenant)
                .map(this::deserialize)
                .orElseThrow(() -> new NotFoundException("Dados de doação não configurados."));
    }

    /**
     * Cria ou atualiza a info de doacao do tenant (upsert).
     * Normaliza banks null para lista vazia.
     */
    @Transactional
    public DonationInfoDto save(String tenant, DonationInfoDto dto) {
        ensureTenantExists(tenant);

        DonationInfoDto normalized = new DonationInfoDto(
                dto.pix(),
                dto.banks() != null ? dto.banks() : List.of()
        );
        String json = serialize(normalized);

        TenantDonation entity = donationRepository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantDonation(tenant, json));

        donationRepository.save(entity);
        return normalized;
    }

    private void ensureTenantExists(String tenant) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));
    }

    private String serialize(DonationInfoDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar doação", e);
        }
    }

    private DonationInfoDto deserialize(TenantDonation entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), DonationInfoDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler doação salva", e);
        }
    }
}
