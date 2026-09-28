package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.domain.UserRole;
import br.org.apaedigital.api.dto.auth.AuthResponse;
import br.org.apaedigital.api.dto.auth.LoginRequest;
import br.org.apaedigital.api.dto.auth.RefreshRequest;
import br.org.apaedigital.api.dto.auth.UserResponse;
import br.org.apaedigital.api.exception.UnauthorizedException;
import br.org.apaedigital.api.repository.UserRepository;
import br.org.apaedigital.api.security.AuthenticatedUser;
import br.org.apaedigital.api.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder encoder;
    private JwtService jwtService;
    private AuthService authService;

    private User admin;
    private final UUID adminId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        encoder = new BCryptPasswordEncoder();

        AppProperties props = new AppProperties();
        props.getJwt().setSecret("test-secret-test-secret-test-secret-32bytes!!");
        jwtService = new JwtService(props);

        authService = new AuthService(userRepository, encoder, jwtService);

        admin = new User("apiuna", "Admin", "admin@apae.org", encoder.encode("admin123"), UserRole.ADMIN) {
            @Override
            public UUID getId() {
                return adminId;
            }
        };
    }

    @Test
    void loginComCredenciaisValidasRetornaTokens() {
        when(userRepository.findByEmailIgnoreCase("admin@apae.org")).thenReturn(Optional.of(admin));

        AuthResponse res = authService.login(new LoginRequest("admin@apae.org", "admin123"));

        assertThat(res.accessToken()).isNotBlank();
        assertThat(res.refreshToken()).isNotBlank();
        assertThat(res.user().email()).isEqualTo("admin@apae.org");
        assertThat(res.user().tenant()).isEqualTo("apiuna");
        assertThat(res.user().role()).isEqualTo("ADMIN");
    }

    @Test
    void loginComSenhaErradaFalha() {
        when(userRepository.findByEmailIgnoreCase("admin@apae.org")).thenReturn(Optional.of(admin));

        assertThatThrownBy(() -> authService.login(new LoginRequest("admin@apae.org", "errada")))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void loginComEmailInexistenteFalha() {
        when(userRepository.findByEmailIgnoreCase(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("nao@existe.com", "x")))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void refreshComTokenValidoGeraNovosTokens() {
        String refresh = jwtService.generateRefreshToken(admin);
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));

        AuthResponse res = authService.refresh(new RefreshRequest(refresh));

        assertThat(res.accessToken()).isNotBlank();
        assertThat(res.user().email()).isEqualTo("admin@apae.org");
    }

    @Test
    void refreshComAccessTokenFalha() {
        String access = jwtService.generateAccessToken(admin);

        assertThatThrownBy(() -> authService.refresh(new RefreshRequest(access)))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void refreshComTokenInvalidoFalha() {
        assertThatThrownBy(() -> authService.refresh(new RefreshRequest("nao-e-um-jwt")))
                .isInstanceOf(UnauthorizedException.class);
    }

    @Test
    void meRetornaUsuarioAtual() {
        when(userRepository.findById(adminId)).thenReturn(Optional.of(admin));
        AuthenticatedUser current = new AuthenticatedUser(adminId, "admin@apae.org", "Admin", UserRole.ADMIN, "apiuna");

        UserResponse res = authService.me(current);

        assertThat(res.email()).isEqualTo("admin@apae.org");
        assertThat(res.tenant()).isEqualTo("apiuna");
    }

    @Test
    void meComUsuarioInexistenteFalha() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());
        AuthenticatedUser current = new AuthenticatedUser(UUID.randomUUID(), "x@x.com", "X", UserRole.ADMIN, "apiuna");

        assertThatThrownBy(() -> authService.me(current))
                .isInstanceOf(UnauthorizedException.class);
    }
}
