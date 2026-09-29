package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantServices;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantServicesRepository extends JpaRepository<TenantServices, String> {
}
