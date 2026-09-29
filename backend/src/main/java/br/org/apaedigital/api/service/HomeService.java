package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.domain.TenantHome;
import br.org.apaedigital.api.dto.home.HomeContentDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantHomeRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HomeService {

    private final TenantHomeRepository repository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public HomeService(TenantHomeRepository repository,
                       TenantRepository tenantRepository,
                       ObjectMapper objectMapper) {
        this.repository = repository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna o conteudo da Home do tenant. Se ainda nao houver, devolve o
     * conteudo padrao (fallback) preenchido com nome/cidade do tenant.
     */
    @Transactional(readOnly = true)
    public HomeContentDto getByTenant(String tenant) {
        Tenant t = tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));

        return repository.findById(tenant)
                .map(this::deserialize)
                .orElseGet(() -> DefaultHome.forTenant(tenant, t.getName(), t.getCity()));
    }

    /** Cria ou atualiza o conteudo da Home do tenant (upsert). */
    @Transactional
    public HomeContentDto save(String tenant, HomeContentDto dto) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));

        String json = serialize(dto);

        TenantHome entity = repository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantHome(tenant, json));

        repository.save(entity);
        return dto;
    }

    private String serialize(HomeContentDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar Home", e);
        }
    }

    private HomeContentDto deserialize(TenantHome entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), HomeContentDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler Home salva", e);
        }
    }
}
