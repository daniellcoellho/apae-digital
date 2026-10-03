package br.org.apaedigital.api;

import br.org.apaedigital.api.domain.Tenant;
import br.org.apaedigital.api.domain.User;
import br.org.apaedigital.api.domain.UserRole;
import br.org.apaedigital.api.repository.EventRepository;
import br.org.apaedigital.api.repository.NewsRepository;
import br.org.apaedigital.api.repository.TenantDonationRepository;
import br.org.apaedigital.api.repository.TenantHomeRepository;
import br.org.apaedigital.api.repository.TenantInstitutionalRepository;
import br.org.apaedigital.api.repository.TenantRepository;
import br.org.apaedigital.api.repository.TenantServicesRepository;
import br.org.apaedigital.api.repository.TenantThemeRepository;
import br.org.apaedigital.api.repository.TenantTransparencyRepository;
import br.org.apaedigital.api.repository.UploadedFileRepository;
import br.org.apaedigital.api.repository.UserRepository;
import org.springframework.mock.web.MockMultipartFile;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
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
    private NewsRepository newsRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TenantThemeRepository themeRepository;

    @Autowired
    private TenantDonationRepository donationRepository;

    @Autowired
    private TenantTransparencyRepository transparencyRepository;

    @Autowired
    private TenantHomeRepository homeRepository;

    @Autowired
    private TenantServicesRepository servicesRepository;

    @Autowired
    private TenantInstitutionalRepository institutionalRepository;

    @Autowired
    private UploadedFileRepository uploadedFileRepository;

    @Autowired
    private PasswordEncoder encoder;

    private static final String TENANT = "apiuna";
    private static final String EMAIL = "admin@apae.org";
    private static final String PASSWORD = "admin123";

    @BeforeEach
    void seed() {
        // Limpa filhos antes do tenant (FK), garantindo isolamento entre testes.
        newsRepository.deleteAll();
        eventRepository.deleteAll();
        themeRepository.deleteAll();
        donationRepository.deleteAll();
        transparencyRepository.deleteAll();
        homeRepository.deleteAll();
        servicesRepository.deleteAll();
        institutionalRepository.deleteAll();
        uploadedFileRepository.deleteAll();
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

    // ---------- Transparência ----------

    @Test
    void transparenciaPublicaSemConteudoRetornaPadraoVazio() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/transparency"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intro", is("")))
                .andExpect(jsonPath("$.documents", org.hamcrest.Matchers.hasSize(0)));
    }

    @Test
    void adminSalvaERecuperaTransparencia() throws Exception {
        String token = login();

        String body = """
                {
                  "intro": "Consulte nossos relatórios.",
                  "documents": [
                    { "title": "Relatório 2025", "description": "Prestação de contas.", "tag": "RELATÓRIO", "url": "https://x/r.pdf" },
                    { "title": "Estatuto", "description": "Documento constitutivo.", "tag": "INSTITUCIONAL", "url": null }
                  ]
                }
                """;

        mvc.perform(put("/api/admin/transparency")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.documents", org.hamcrest.Matchers.hasSize(2)));

        mvc.perform(get("/api/tenants/" + TENANT + "/transparency"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intro", is("Consulte nossos relatórios.")))
                .andExpect(jsonPath("$.documents[0].title", is("Relatório 2025")));
    }

    @Test
    void salvarTransparenciaSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/transparency")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // ---------- Página Inicial (Home) ----------

    @Test
    void homePublicaSemConteudoRetornaPadrao() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hero.titleHighlight", is("alguém que apoia")))
                .andExpect(jsonPath("$.impact.label", is("Nosso impacto")));
    }

    @Test
    void adminSalvaERecuperaHome() throws Exception {
        String token = login();

        String body = """
                {
                  "hero": {
                    "badge": "Apiúna - SC", "titlePrefix": "Cada conquista começa com",
                    "titleHighlight": "alguém que apoia", "subtitle": "Subtítulo.",
                    "imageUrl": "https://x/img.jpg", "primaryCtaLabel": "Quero doar",
                    "secondaryCtaLabel": "Ver mais", "floatingValue": 312, "floatingLabel": "pessoas atendidas"
                  },
                  "impact": {
                    "label": "Nosso impacto", "title": "Números que são histórias", "description": "Descrição.",
                    "stats": [
                      { "value": 312, "suffix": "", "label": "Pessoas atendidas", "hint": "Por ano" },
                      { "value": 5400, "suffix": "+", "label": "Atendimentos", "hint": "Em 2025" },
                      { "value": 240, "suffix": "", "label": "Famílias", "hint": "Apoio contínuo" },
                      { "value": 32, "suffix": "", "label": "Anos", "hint": "Desde 1994" }
                    ]
                  },
                  "donation": {
                    "label": "Doação", "title": "Sua doação ajuda", "description": "Descrição.",
                    "tiers": [ { "icon": "peca", "value": "R$ 30/mês", "desc": "Materiais" } ],
                    "campaign": { "title": "Van acessível", "raised": 68400, "goal": 120000, "donors": 184 }
                  }
                }
                """;

        mvc.perform(put("/api/admin/home")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.impact.stats", org.hamcrest.Matchers.hasSize(4)));

        mvc.perform(get("/api/tenants/" + TENANT + "/home"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hero.subtitle", is("Subtítulo.")))
                .andExpect(jsonPath("$.impact.stats[1].suffix", is("+")))
                .andExpect(jsonPath("$.donation.campaign.title", is("Van acessível")))
                .andExpect(jsonPath("$.donation.tiers[0].value", is("R$ 30/mês")));
    }

    @Test
    void salvarHomeSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/home")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void salvarHomeInvalidaRetorna400() throws Exception {
        String token = login();
        // hero ausente
        mvc.perform(put("/api/admin/home")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content("{\"impact\":{}}"))
                .andExpect(status().isBadRequest());
    }

    // ---------- Serviços (Atendimentos) ----------

    @Test
    void servicosPublicoSemConteudoRetorna404() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/services"))
                .andExpect(status().isNotFound());
    }

    @Test
    void adminSalvaERecuperaServicos() throws Exception {
        String token = login();

        String body = """
                {
                  "intro": [ { "type": "paragraph", "text": "Proposta interdisciplinar." } ],
                  "areas": [
                    {
                      "id": "saude", "title": "Área da saúde", "description": "Acompanhamento técnico.",
                      "services": [
                        {
                          "id": "fisioterapia", "title": "Fisioterapia", "summary": "Autonomia.", "icon": "🧘",
                          "blocks": [
                            { "type": "paragraph", "text": "A fisioterapia previne e trata..." },
                            { "type": "list", "title": "Modalidades", "variant": "check", "items": ["Convencional", "Pediatria"] }
                          ]
                        }
                      ]
                    }
                  ]
                }
                """;

        mvc.perform(put("/api/admin/services")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.areas[0].services[0].id", is("fisioterapia")));

        // publico ve o conteudo, com os blocos preservados
        mvc.perform(get("/api/tenants/" + TENANT + "/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.areas[0].title", is("Área da saúde")))
                .andExpect(jsonPath("$.areas[0].services[0].blocks[1].type", is("list")))
                .andExpect(jsonPath("$.areas[0].services[0].blocks[1].items", org.hamcrest.Matchers.hasSize(2)));
    }

    @Test
    void salvarServicosSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/services")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // ---------- Institucional (Sobre) ----------

    @Test
    void institucionalPublicoSemConteudoRetornaListaVazia() throws Exception {
        mvc.perform(get("/api/tenants/" + TENANT + "/institutional"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pages", org.hamcrest.Matchers.hasSize(0)));
    }

    @Test
    void adminSalvaERecuperaInstitucionalOrdenado() throws Exception {
        String token = login();

        String body = """
                {
                  "pages": [
                    { "slug": "convenios", "title": "Convênios", "subtitle": "Parcerias", "order": 3,
                      "blocks": [ { "type": "list", "items": ["SUS", "Prefeitura"] } ] },
                    { "slug": "historico", "title": "Histórico", "subtitle": "Nossa trajetória", "order": 1,
                      "blocks": [ { "type": "paragraph", "text": "Fundada em 1994." } ] }
                  ]
                }
                """;

        mvc.perform(put("/api/admin/institutional")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(body))
                .andExpect(status().isOk())
                // ordenado por "order": historico (1) antes de convenios (3)
                .andExpect(jsonPath("$.pages[0].slug", is("historico")))
                .andExpect(jsonPath("$.pages[1].slug", is("convenios")));

        mvc.perform(get("/api/tenants/" + TENANT + "/institutional"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pages[0].title", is("Histórico")))
                .andExpect(jsonPath("$.pages[0].blocks[0].type", is("paragraph")))
                .andExpect(jsonPath("$.pages[1].blocks[0].items", org.hamcrest.Matchers.hasSize(2)));
    }

    @Test
    void salvarInstitucionalSemTokenRetorna401() throws Exception {
        mvc.perform(put("/api/admin/institutional")
                        .contentType("application/json").content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // ---------- Uploads ----------

    @Test
    void uploadImagemRetornaUrlPublica() throws Exception {
        String token = login();
        MockMultipartFile file = new MockMultipartFile(
                "file", "logo.png", "image/png", new byte[]{1, 2, 3, 4});

        mvc.perform(multipart("/api/admin/uploads")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.url", org.hamcrest.Matchers.startsWith("/uploads/" + TENANT + "/")))
                .andExpect(jsonPath("$.contentType", is("image/png")))
                .andExpect(jsonPath("$.size", is(4)));
    }

    @Test
    void uploadSemTokenRetorna401() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "logo.png", "image/png", new byte[]{1, 2, 3, 4});
        mvc.perform(multipart("/api/admin/uploads").file(file))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadTipoNaoSuportadoRetorna400() throws Exception {
        String token = login();
        MockMultipartFile file = new MockMultipartFile(
                "file", "app.exe", "application/octet-stream", new byte[]{1, 2});
        mvc.perform(multipart("/api/admin/uploads")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }
}
