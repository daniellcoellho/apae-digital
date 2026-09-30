package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantInstitutional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantInstitutionalRepository extends JpaRepository<TenantInstitutional, String> {
}
