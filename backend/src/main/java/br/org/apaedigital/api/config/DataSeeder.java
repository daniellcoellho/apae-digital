package br.org.apaedigital.api.config;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.domain.UserRole;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria, no primeiro start, o tenant e o usuario admin iniciais (se ainda nao existirem).
 * Controlado por app.seed.enabled.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AppProperties props;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AppProperties props, TenantRepository tenantRepository,
                      UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.props = props;
        this.tenantRepository = tenantRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!props.getSeed().isEnabled()) {
            return;
        }

        AppProperties.Seed seed = props.getSeed();

        tenantRepository.findById(seed.getTenant()).orElseGet(() -> {
            log.info("Seed: criando tenant '{}'", seed.getTenant());
            return tenantRepository.save(new Tenant(seed.getTenant(), "APAE", seed.getTenant()));
        });

        if (!userRepository.existsByTenantSlugAndEmailIgnoreCase(seed.getTenant(), seed.getAdminEmail())) {
            log.info("Seed: criando admin '{}' no tenant '{}'", seed.getAdminEmail(), seed.getTenant());
            User admin = new User(
                    seed.getTenant(),
                    seed.getAdminName(),
                    seed.getAdminEmail(),
                    passwordEncoder.encode(seed.getAdminPassword()),
                    UserRole.ADMIN
            );
            userRepository.save(admin);
        }
    }
}
