package br.org.apaedigital.api.security;

import br.org.apaedigital.api.config.AppProperties;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/**
 * Resolve o tenant das requisicoes publicas.
 * Prioridade: header "X-Tenant"; caso ausente, usa o tenant padrao (seed).
 * Em rotas autenticadas, o tenant vem do JWT (ver CurrentUser).
 */
@Component
public class TenantResolver {

    private final String defaultTenant;

    public TenantResolver(AppProperties props) {
        this.defaultTenant = props.getSeed().getTenant();
    }

    public String resolve(HttpServletRequest request) {
        String header = request.getHeader("X-Tenant");
        if (header != null && !header.isBlank()) {
            return header.trim();
        }
        return defaultTenant;
    }
}
