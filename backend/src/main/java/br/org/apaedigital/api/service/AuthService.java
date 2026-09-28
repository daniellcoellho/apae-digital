package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.dto.auth.AuthResponse;
import br.org.apaedigital.api.dto.auth.LoginRequest;
import br.org.apaedigital.api.dto.auth.RefreshRequest;
import br.org.apaedigital.api.dto.auth.UserResponse;
import br.org.apaedigital.api.exception.UnauthorizedException;
import br.org.apaedigital.api.repository.UserRepository;
import br.org.apaedigital.api.security.AuthenticatedUser;
import br.org.apaedigital.api.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais inválidas.");
        }

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshRequest request) {
        final Claims claims;
        try {
            claims = jwtService.parse(request.refreshToken());
        } catch (JwtException | IllegalArgumentException ex) {
            throw new UnauthorizedException("Refresh token inválido.");
        }

        if (!jwtService.isRefreshToken(claims)) {
            throw new UnauthorizedException("Token não é de refresh.");
        }

        UUID userId = UUID.fromString(claims.getSubject());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado."));

        return buildAuthResponse(user);
    }

    public UserResponse me(AuthenticatedUser current) {
        User user = userRepository.findById(current.id())
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado."));
        return UserResponse.from(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);
        return new AuthResponse(access, refresh, UserResponse.from(user));
    }
}
