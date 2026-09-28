package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByTenantSlugAndEmailIgnoreCase(String tenantSlug, String email);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByTenantSlugAndEmailIgnoreCase(String tenantSlug, String email);
}
