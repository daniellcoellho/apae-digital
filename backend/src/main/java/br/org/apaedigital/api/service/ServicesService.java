package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.TenantServices;
import br.org.apaedigital.api.dto.services.ServicosContentDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantServicesRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ServicesService {

    private final TenantServicesRepository repository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public ServicesService(TenantServicesRepository repository,
                           TenantRepository tenantRepository,
                           ObjectMapper objectMapper) {
        this.repository = repository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna o conteudo de servicos do tenant.
     * Como e conteudo rico (nao ha um padrao sensato), lanca NotFound se a APAE
     * ainda nao configurou — o front trata a ausencia.
     */
    @Transactional(readOnly = true)
    public ServicosContentDto getByTenant(String tenant) {
        ensureTenantExists(tenant);
        return repository.findById(tenant)
                .map(this::deserialize)
                .orElseThrow(() -> new NotFoundException("Conteúdo de serviços não configurado."));
    }

    /** Cria ou atualiza o conteudo de servicos do tenant (upsert). */
    @Transactional
    public ServicosContentDto save(String tenant, ServicosContentDto dto) {
        ensureTenantExists(tenant);
        String json = serialize(dto);

        TenantServices entity = repository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantServices(tenant, json));

        repository.save(entity);
        return dto;
    }

    private void ensureTenantExists(String tenant) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));
    }

    private String serialize(ServicosContentDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar serviços", e);
        }
    }

    private ServicosContentDto deserialize(TenantServices entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), ServicosContentDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler serviços salvos", e);
        }
    }
}
