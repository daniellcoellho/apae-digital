package br.org.apaedigital.api;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.domain.UserRole;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    private static final String TENANT = "apiuna";
    private static final String EMAIL = "admin@apae.org";
    private static final String PASSWORD = "admin123";

    @BeforeEach
    void seed() {
        userRepository.deleteAll();
        tenantRepository.deleteAll();
        tenantRepository.save(new Tenant(TENANT, "APAE de Apiúna", "Apiúna - SC"));
        userRepository.save(new User(TENANT, "Admin", EMAIL, encoder.encode(PASSWORD), UserRole.ADMIN));
    }

    private String login() throws Exception {
        String body = """
                {"email":"%s","password":"%s"}
                """.formatted(EMAIL, PASSWORD);
        String json = mvc.perform(post("/api/auth/login")
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.tenant", is(TENANT)))
                .andReturn().getResponse().getContentAsString();
        return mapper.readTree(json).get("accessToken").asText();
    }

    // ---------- Auth ----------

    @Test
    void loginComSucesso() throws Exception {
        String token = login();
        org.assertj.core.api.Assertions.assertThat(token).isNotBlank();
    }

    @Test
    void loginComSenhaErradaRetorna401() throws Exception {
        String body = """
                {"email":"%s","password":"errada"}
                """.formatted(EMAIL);
        mvc.perform(post("/api/auth/login").contentType("application/json").content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meSemTokenRetorna401() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void meComTokenRetornaUsuario() throws Exception {
        String token = login();
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(EMAIL)));
    }

    @Test
    void refreshGeraNovoAccessToken() throws Exception {
        String body = """
                {"email":"%s","password":"%s"}
                """.formatted(EMAIL, PASSWORD);
        String json = mvc.perform(post("/api/auth/login")
                        .contentType("application/json").content(body))
                .andReturn().getResponse().getContentAsString();
        String refresh = mapper.readTree(json).get("refreshToken").asText();

        mvc.perform(post("/api/auth/refresh")
                        .contentType("application/json")
                        .content("{\"refreshToken\":\"" + refresh + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }

    // ---------- Seguranca ----------

    @Test
    void adminSemTokenRetorna401() throws Exception {
        mvc.perform(get("/api/admin/news")).andExpect(status().isUnauthorized());
    }

    // ---------- Noticias (fluxo completo) ----------

    @Test
    void fluxoNoticiaCriaListaEDeleta() throws Exception {
        String token = login();

        String novo = """
                {
                  "title": "Campanha do Agasalho",
                  "summary": "Resumo com tamanho suficiente para validar.",
                  "content": "Conteudo com mais de vinte caracteres aqui.",
                  "category": "CAMPANHAS",
                  "status": "PUBLISHED",
                  "tags": ["campanha"]
                }
                """;

        String created = mvc.perform(post("/api/admin/news")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(novo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.slug", is("campanha-do-agasalho")))
                .andReturn().getResponse().getContentAsString();
        String id = mapper.readTree(created).get("id").asText();

        // aparece na listagem publica (com header de tenant)
        mvc.perform(get("/api/news").header("X-Tenant", TENANT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements", is(1)));

        // detalhe publico por slug
        mvc.perform(get("/api/news/slug/campanha-do-agasalho").header("X-Tenant", TENANT))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Campanha do Agasalho")));

        // update
        String editado = novo.replace("Campanha do Agasalho", "Campanha do Agasalho 2025");
        mvc.perform(put("/api/admin/news/" + id)
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(editado))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Campanha do Agasalho 2025")));

        // delete
        mvc.perform(delete("/api/admin/news/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
    }

    @Test
    void criarNoticiaInvalidaRetorna400() throws Exception {
        String token = login();
        String invalido = """
                {"title":"x","summary":"curto","content":"curto","category":"CAMPANHAS","status":"DRAFT","tags":[]}
                """;
        mvc.perform(post("/api/admin/news")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(invalido))
                .andExpect(status().isBadRequest());
    }

    @Test
    void noticiaPorSlugInexistenteRetorna404() throws Exception {
        mvc.perform(get("/api/news/slug/nao-existe").header("X-Tenant", TENANT))
                .andExpect(status().isNotFound());
    }

    // ---------- Eventos ----------

    @Test
    void fluxoEventoCriaEListaPorRange() throws Exception {
        String token = login();

        String novo = """
                {
                  "title": "Bingo Solidário",
                  "description": "Renda para o transporte",
                  "location": "Salão",
                  "start": "2026-09-12T22:00:00Z",
                  "end": "2026-09-13T00:00:00Z",
                  "allDay": false,
                  "category": "CAMPANHA"
                }
                """;

        mvc.perform(post("/api/admin/events")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(novo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Bingo Solidário")));

        mvc.perform(get("/api/events")
                        .header("X-Tenant", TENANT)
                        .param("start", "2026-09-01T00:00:00Z")
                        .param("end", "2026-09-30T23:59:59Z"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title", is("Bingo Solidário")));
    }
}
