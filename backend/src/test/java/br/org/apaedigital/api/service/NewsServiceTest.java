package br.org.apaedigital.api.service;

import br.org.apaedigital.api.domain.NewsCategory;
import br.org.apaedigital.api.domain.NewsStatus;
import br.org.apaedigital.api.dto.PagedResponse;
import br.org.apaedigital.api.dto.news.NewsRequest;
import br.org.apaedigital.api.dto.news.NewsResponse;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
@Import(NewsService.class)
class NewsServiceTest {

    @Autowired
    private NewsRepository repository;

    @Autowired
    private NewsService service;

    private static final String TENANT = "apiuna";

    private NewsRequest sample(String title, NewsStatus status) {
        return new NewsRequest(
                title,
                "Resumo suficientemente longo para validar.",
                "Conteúdo com mais de vinte caracteres para passar na validação.",
                null,
                NewsCategory.CAMPANHAS,
                status,
                List.of("tag1", "tag2")
        );
    }

    @BeforeEach
    void clean() {
        repository.deleteAll();
    }

    @Test
    void createGeraSlugEDefinePublishedAtQuandoPublicado() {
        NewsResponse res = service.create(TENANT, sample("Campanha do Agasalho", NewsStatus.PUBLISHED));

        assertThat(res.slug()).isEqualTo("campanha-do-agasalho");
        assertThat(res.status()).isEqualTo("PUBLISHED");
        assertThat(res.publishedAt()).isNotNull();
        assertThat(res.tags()).containsExactly("tag1", "tag2");
    }

    @Test
    void createRascunhoNaoDefinePublishedAt() {
        NewsResponse res = service.create(TENANT, sample("Rascunho", NewsStatus.DRAFT));
        assertThat(res.publishedAt()).isNull();
    }

    @Test
    void createComTitulosIguaisGeraSlugsUnicos() {
        NewsResponse a = service.create(TENANT, sample("Mesmo Título", NewsStatus.DRAFT));
        NewsResponse b = service.create(TENANT, sample("Mesmo Título", NewsStatus.DRAFT));

        assertThat(a.slug()).isEqualTo("mesmo-titulo");
        assertThat(b.slug()).isEqualTo("mesmo-titulo-2");
    }

    @Test
    void listPublishedRetornaApenasPublicadas() {
        service.create(TENANT, sample("Publicada", NewsStatus.PUBLISHED));
        service.create(TENANT, sample("Rascunho", NewsStatus.DRAFT));

        PagedResponse<NewsResponse> page = service.listPublished(TENANT, 0, 10);

        assertThat(page.content()).hasSize(1);
        assertThat(page.content().get(0).title()).isEqualTo("Publicada");
        assertThat(page.totalElements()).isEqualTo(1);
    }

    @Test
    void listPublishedIsolaPorTenant() {
        service.create(TENANT, sample("Da Apiuna", NewsStatus.PUBLISHED));
        service.create("outra", sample("De Outra", NewsStatus.PUBLISHED));

        assertThat(service.listPublished(TENANT, 0, 10).content()).hasSize(1);
        assertThat(service.listPublished("outra", 0, 10).content()).hasSize(1);
    }

    @Test
    void getBySlugRetornaNoticia() {
        service.create(TENANT, sample("Notícia X", NewsStatus.PUBLISHED));
        NewsResponse res = service.getBySlug(TENANT, "noticia-x");
        assertThat(res.title()).isEqualTo("Notícia X");
    }

    @Test
    void getBySlugInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.getBySlug(TENANT, "nao-existe"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void listAllRetornaTodasDoTenant() {
        service.create(TENANT, sample("A", NewsStatus.PUBLISHED));
        service.create(TENANT, sample("B", NewsStatus.DRAFT));

        PagedResponse<NewsResponse> page = service.listAll(TENANT, 0, 10);
        assertThat(page.content()).hasSize(2);
    }

    @Test
    void updateAlteraCamposEPublicaDefinindoPublishedAt() {
        NewsResponse created = service.create(TENANT, sample("Original", NewsStatus.DRAFT));
        UUID id = UUID.fromString(created.id());

        NewsResponse updated = service.update(TENANT, id, sample("Original", NewsStatus.PUBLISHED));

        assertThat(updated.status()).isEqualTo("PUBLISHED");
        assertThat(updated.publishedAt()).isNotNull();
    }

    @Test
    void updateInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.update(TENANT, UUID.randomUUID(), sample("X", NewsStatus.DRAFT)))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void getByIdRespeitaTenant() {
        NewsResponse created = service.create(TENANT, sample("Da Apiuna", NewsStatus.PUBLISHED));
        UUID id = UUID.fromString(created.id());

        assertThatThrownBy(() -> service.getById("outra", id))
                .isInstanceOf(NotFoundException.class);
        assertThat(service.getById(TENANT, id).title()).isEqualTo("Da Apiuna");
    }

    @Test
    void deleteRemoveNoticia() {
        NewsResponse created = service.create(TENANT, sample("Para Apagar", NewsStatus.DRAFT));
        UUID id = UUID.fromString(created.id());

        service.delete(TENANT, id);

        assertThatThrownBy(() -> service.getById(TENANT, id))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void deleteInexistenteLancaNotFound() {
        assertThatThrownBy(() -> service.delete(TENANT, UUID.randomUUID()))
                .isInstanceOf(NotFoundException.class);
    }
}
