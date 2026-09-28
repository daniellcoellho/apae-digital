package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.domain.UserRole;
import br.org.apaedigital.api.security.JwtService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        AppProperties props = new AppProperties();
        props.getJwt().setSecret("test-secret-test-secret-test-secret-32bytes!!");
        props.getJwt().setAccessTokenTtlMinutes(60);
        props.getJwt().setRefreshTokenTtlDays(7);
        jwtService = new JwtService(props);

        user = new User("apiuna", "Admin", "admin@apae.org", "hash", UserRole.ADMIN);
        // id normalmente vem do banco; para teste, usamos reflection-free via subtype nao e necessario:
        // o token usa getId().toString(), entao criamos um usuario com id setado abaixo.
    }

    @Test
    void accessTokenCarregaClaimsCorretas() {
        UserWithId u = new UserWithId();
        String token = jwtService.generateAccessToken(u);
        Claims claims = jwtService.parse(token);

        assertThat(claims.getSubject()).isEqualTo(u.getId().toString());
        assertThat(claims.get("email", String.class)).isEqualTo("admin@apae.org");
        assertThat(claims.get("role", String.class)).isEqualTo("ADMIN");
        assertThat(claims.get("tenant", String.class)).isEqualTo("apiuna");
        assertThat(jwtService.isAccessToken(claims)).isTrue();
        assertThat(jwtService.isRefreshToken(claims)).isFalse();
    }

    @Test
    void refreshTokenEhIdentificadoComoRefresh() {
        UserWithId u = new UserWithId();
        String token = jwtService.generateRefreshToken(u);
        Claims claims = jwtService.parse(token);

        assertThat(jwtService.isRefreshToken(claims)).isTrue();
        assertThat(jwtService.isAccessToken(claims)).isFalse();
        assertThat(claims.get("tenant", String.class)).isEqualTo("apiuna");
    }

    /** Usuario de teste com id fixo (o construtor de User nao seta id). */
    static class UserWithId extends User {
        private final java.util.UUID fixedId = java.util.UUID.randomUUID();

        UserWithId() {
            super("apiuna", "Admin", "admin@apae.org", "hash", UserRole.ADMIN);
        }

        @Override
        public java.util.UUID getId() {
            return fixedId;
        }
    }
}
