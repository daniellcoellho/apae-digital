package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, String> {
}
