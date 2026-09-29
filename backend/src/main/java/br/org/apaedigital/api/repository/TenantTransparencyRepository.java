package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantTransparency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantTransparencyRepository extends JpaRepository<TenantTransparency, String> {
}
