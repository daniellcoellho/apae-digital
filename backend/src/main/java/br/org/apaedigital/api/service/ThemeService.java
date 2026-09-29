package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.domain.TenantTheme;
import br.org.apaedigital.api.dto.theme.BrandThemeDto;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantThemeRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ThemeService {

    private final TenantThemeRepository themeRepository;
    private final TenantRepository tenantRepository;
    private final ObjectMapper objectMapper;

    public ThemeService(TenantThemeRepository themeRepository,
                        TenantRepository tenantRepository,
                        ObjectMapper objectMapper) {
        this.themeRepository = themeRepository;
        this.tenantRepository = tenantRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Retorna o tema do tenant. Se ainda nao houver tema salvo, devolve o tema
     * padrao (fallback) preenchido com nome/cidade do tenant.
     * Lanca NotFound se o tenant nao existir.
     */
    @Transactional(readOnly = true)
    public BrandThemeDto getByTenant(String tenant) {
        Tenant t = tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));

        return themeRepository.findById(tenant)
                .map(this::deserialize)
                .map(dto -> withTenant(dto, tenant))
                .orElseGet(() -> DefaultTheme.forTenant(tenant, t.getName(), t.getCity()));
    }

    /**
     * Cria ou atualiza o tema do tenant (upsert).
     */
    @Transactional
    public BrandThemeDto save(String tenant, BrandThemeDto dto) {
        tenantRepository.findById(tenant)
                .orElseThrow(() -> new NotFoundException("Tenant não encontrado."));

        BrandThemeDto toStore = withTenant(dto, tenant);
        String json = serialize(toStore);

        TenantTheme entity = themeRepository.findById(tenant)
                .map(existing -> {
                    existing.setPayload(json);
                    return existing;
                })
                .orElseGet(() -> new TenantTheme(tenant, json));

        themeRepository.save(entity);
        return toStore;
    }

    private BrandThemeDto withTenant(BrandThemeDto dto, String tenant) {
        // Garante que o campo tenant reflete o dono, ignorando o que veio no corpo.
        return new BrandThemeDto(
                tenant,
                dto.name(), dto.city(), dto.logoUrl(), dto.logoLightUrl(),
                dto.colors(), dto.typography(), dto.radius(), dto.contact(), dto.donationUrl()
        );
    }

    private String serialize(BrandThemeDto dto) {
        try {
            return objectMapper.writeValueAsString(dto);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao serializar tema", e);
        }
    }

    private BrandThemeDto deserialize(TenantTheme entity) {
        try {
            return objectMapper.readValue(entity.getPayload(), BrandThemeDto.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Falha ao ler tema salvo", e);
        }
    }
}
