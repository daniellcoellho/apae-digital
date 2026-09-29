package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantTheme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantThemeRepository extends JpaRepository<TenantTheme, String> {
}
