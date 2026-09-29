package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantHome;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantHomeRepository extends JpaRepository<TenantHome, String> {
}
