package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.TenantInstitutional;
import br.org.apaedigital.api.dto.institutional.InstitutionalContentDto;
import br.org.apaedigital.api.dto.institutional.InstitutionalPageDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantInstitutionalRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class InstitutionalService {

    private final TenantInstitutionalRepository repository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public InstitutionalService(TenantInstitutionalRepository repository,
                                TenantRepository tenantRepository,
                                ObjectMapper objectMapper) {
        this.repository = repository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Lista as subpaginas do tenant, ordenadas por `order`.
     * Se ainda nao houver conteudo, devolve lista vazia (o front trata a ausencia).
     */
    @Transactional(readOnly = true)
    public InstitutionalContentDto getByTenant(String tenant) {
        ensureTenantExists(tenant);
        List<InstitutionalPageDto> pages = repository.findById(tenant)
                .map(this::deserialize)
                .map(InstitutionalContentDto::pages)
                .orElseGet(List::of);
        return new InstitutionalContentDto(sorted(pages));
    }

    /** Cria ou atualiza o conteudo institucional do tenant (upsert). */
    @Transactional
    public InstitutionalContentDto save(String tenant, InstitutionalContentDto dto) {
        ensureTenantExists(tenant);

        List<InstitutionalPageDto> pages = dto.pages() != null ? dto.pages() : List.of();
        InstitutionalContentDto normalized = new InstitutionalContentDto(sorted(pages));
        String json = serialize(normalized);

        TenantInstitutional entity = repository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantInstitutional(tenant, json));

        repository.save(entity);
        return normalized;
    }

    private List<InstitutionalPageDto> sorted(List<InstitutionalPageDto> pages) {
        return pages.stream()
                .sorted(Comparator.comparingInt(p -> p.order() != null ? p.order() : 0))
                .toList();
    }

    private void ensureTenantExists(String tenant) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));
    }

    private String serialize(InstitutionalContentDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar institucional", e);
        }
    }

    private InstitutionalContentDto deserialize(TenantInstitutional entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), InstitutionalContentDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler institucional salvo", e);
        }
    }
}
