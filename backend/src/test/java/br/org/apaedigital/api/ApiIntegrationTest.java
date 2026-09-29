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

    // ---------- Tema (identidade visual) ----------

    @Test
    void temaPublicoSemPersonalizacaoRetornaPadrao() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/theme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenant", is(TENANT)))
                .andExpect(jsonPath("$.colors.primary").exists());
    }

    @Test
    void temaTenantInexistenteRetorna404() throws Exception {
        mvc.perform(get("/api/tenants/nao-existe/theme"))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminSalvaERecuperaTema() throws Exception {
        String token = login();

        String body = """
                {
                  "name": "APAE de Apiúna",
                  "city": "Apiúna - SC",
                  "logoUrl": "/tenants/apiuna/logo.svg",
                  "colors": {
                    "primary": "21 128 61", "primaryLight": "74 179 111", "primaryDark": "15 92 44",
                    "primaryContrast": "255 255 255", "secondary": "234 88 12", "secondaryLight": "251 146 60",
                    "secondaryDark": "194 65 12", "secondaryContrast": "255 255 255", "accent": "2 132 199",
                    "surface": "255 255 255", "surfaceAlt": "233 241 235", "ink": "20 27 24", "inkMuted": "82 96 88"
                  },
                  "typography": { "heading": "'Poppins', sans-serif", "body": "'Inter', sans-serif" },
                  "radius": "0.875rem",
                  "contact": { "email": "c@apae.org", "phone": "(47) 0000-0000", "address": "Apiúna - SC", "social": null },
                  "donationUrl": "/doacoes"
                }
                """;

        mvc.perform(put("/api/admin/theme")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenant", is(TENANT)))
                .andExpect(jsonPath("$.colors.primary", is("21 128 61")));

        // agora o publico ve o tema personalizado
        mvc.perform(get("/api/tenants/" + TENANT + "/theme"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.colors.primary", is("21 128 61")))
                .andExpect(jsonPath("$.radius", is("0.875rem")));
    }

    @Test
    void salvarTemaSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/theme")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void salvarTemaInvalidoRetorna400() throws Exception {
        String token = login();
        // faltam campos obrigatorios (colors/typography)
        mvc.perform(put("/api/admin/theme")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"name\":\"X\",\"city\":\"Y\",\"logoUrl\":\"/l.svg\",\"radius\":\"0.5rem\"}"))
                .andExpect(status().isBadRequest());
    }

    // ---------- Doação ----------

    @Test
    void doacaoPublicaSemConfiguracaoRetorna404() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/donation"))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminSalvaERecuperaDoacao() throws Exception {
        String token = login();

        String body = """
                {
                  "pix": {
                    "key": "12966084928", "keyType": "CPF", "keyDisplay": "129.660.849-28",
                    "merchantName": "APAE DE APIUNA", "merchantCity": "APIUNA"
                  },
                  "banks": [
                    { "bank": "Banco X", "agency": "0001", "account": "12345-6", "holder": "APAE de Apiúna", "document": "CNPJ 00.000.000/0001-00" }
                  ]
                }
                """;

        mvc.perform(put("/api/admin/donation")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pix.key", is("12966084928")))
                .andExpect(jsonPath("$.banks[0].bank", is("Banco X")));

        // agora o publico consegue ver
        mvc.perform(get("/api/tenants/" + TENANT + "/donation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pix.merchantName", is("APAE DE APIUNA")));
    }

    @Test
    void salvarDoacaoSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/donation")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void salvarDoacaoInvalidaRetorna400() throws Exception {
        String token = login();
        // pix ausente
        mvc.perform(put("/api/admin/donation")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content("{\"banks\":[]}"))
                .andExpect(status().isBadRequest());
    }
}
