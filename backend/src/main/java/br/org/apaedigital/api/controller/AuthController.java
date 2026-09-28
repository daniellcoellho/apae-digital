package br.org.apaedigital.api.controller;

import br.org.apaedigital.api.dto.auth.AuthResponse;
import br.org.apaedigital.api.dto.auth.LoginRequest;
import br.org.apaedigital.api.dto.auth.RefreshRequest;
import br.org.apaedigital.api.dto.auth.UserResponse;
import br.org.apaedigital.api.security.CurrentUser;
import br.org.apaedigital.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        return authService.me(CurrentUser.require());
    }
}
