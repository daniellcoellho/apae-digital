package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.TenantTransparency;
import br.org.apaedigital.api.dto.transparency.TransparencyContentDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantTransparencyRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransparencyService {

    private final TenantTransparencyRepository repository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public TransparencyService(TenantTransparencyRepository repository,
                               TenantRepository tenantRepository,
                               ObjectMapper objectMapper) {
        this.repository = repository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna o conteudo de transparencia do tenant.
     * Se ainda nao houver conteudo, devolve um padrao vazio (intro em branco,
     * sem documentos) para a pagina publica sempre renderizar.
     */
    @Transactional(readOnly = true)
    public TransparencyContentDto getByTenant(String tenant) {
        ensureTenantExists(tenant);
        return repository.findById(tenant)
                .map(this::deserialize)
                .orElseGet(() -> new TransparencyContentDto("", List.of()));
    }

    /** Cria ou atualiza o conteudo de transparencia do tenant (upsert). */
    @Transactional
    public TransparencyContentDto save(String tenant, TransparencyContentDto dto) {
        ensureTenantExists(tenant);

        TransparencyContentDto normalized = new TransparencyContentDto(
                dto.intro() != null ? dto.intro() : "",
                dto.documents() != null ? dto.documents() : List.of()
        );
        String json = serialize(normalized);

        TenantTransparency entity = repository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantTransparency(tenant, json));

        repository.save(entity);
        return normalized;
    }

    private void ensureTenantExists(String tenant) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));
    }

    private String serialize(TransparencyContentDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar transparência", e);
        }
    }

    private TransparencyContentDto deserialize(TenantTransparency entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), TransparencyContentDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler transparência salva", e);
        }
    }
}
