package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.TenantDonation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantDonationRepository extends JpaRepository<TenantDonation, String> {
}
