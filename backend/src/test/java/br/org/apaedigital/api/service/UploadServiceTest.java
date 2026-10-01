package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.dto.upload.UploadResponse;
import br.org.apaedigital.api.exception.BadRequestException;
import br.org.apaedigital.api.repository.UploadedFileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class UploadServiceTest {

    @TempDir
    Path tempDir;

    private UploadedFileRepository repository;
    private UploadService service;

    private static final String TENANT = "apiuna";

    @BeforeEach
    void setUp() {
        repository = mock(UploadedFileRepository.class);
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AppProperties props = new AppProperties();
        props.getUploads().setDir(tempDir.toString());
        props.getUploads().setPublicPath("/uploads");
        props.getUploads().setMaxFileSizeBytes(5L * 1024 * 1024);

        service = new UploadService(repository, props);
    }

    private MockMultipartFile png(byte[] content) {
        return new MockMultipartFile("file", "foto.png", "image/png", content);
    }

    @Test
    void gravaImagemEDevolveUrlComTenant() throws Exception {
        UploadResponse res = service.store(TENANT, png(new byte[]{1, 2, 3, 4}));

        assertThat(res.url()).startsWith("/uploads/apiuna/").endsWith(".png");
        assertThat(res.contentType()).isEqualTo("image/png");
        assertThat(res.size()).isEqualTo(4);

        // O arquivo foi realmente gravado em disco.
        Path stored = tempDir.resolve("apiuna").resolve(res.fileName());
        assertThat(Files.exists(stored)).isTrue();
        verify(repository).save(any());
    }

    @Test
    void aceitaPdf() {
        var pdf = new MockMultipartFile("file", "doc.pdf", "application/pdf", new byte[]{37, 80, 68, 70});
        UploadResponse res = service.store(TENANT, pdf);
        assertThat(res.url()).endsWith(".pdf");
    }

    @Test
    void rejeitaTipoNaoSuportado() {
        var exe = new MockMultipartFile("file", "virus.exe", "application/octet-stream", new byte[]{1});
        assertThatThrownBy(() -> service.store(TENANT, exe))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("não suportado");
    }

    @Test
    void rejeitaArquivoVazio() {
        var empty = new MockMultipartFile("file", "x.png", "image/png", new byte[]{});
        assertThatThrownBy(() -> service.store(TENANT, empty))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Nenhum arquivo");
    }

    @Test
    void rejeitaArquivoAcimaDoLimite() {
        AppProperties props = new AppProperties();
        props.getUploads().setDir(tempDir.toString());
        props.getUploads().setMaxFileSizeBytes(2);
        UploadService small = new UploadService(repository, props);

        assertThatThrownBy(() -> small.store(TENANT, png(new byte[]{1, 2, 3, 4})))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("tamanho máximo");
    }

    @Test
    void sanitizaTenantComCaracteresInvalidos() {
        UploadResponse res = service.store("Ap1a/../etc", png(new byte[]{1}));
        // Barras e pontos removidos -> impede path traversal, pasta segura.
        assertThat(res.url()).isEqualTo("/uploads/ap1aetc/" + res.fileName());
        assertThat(res.url()).doesNotContain("..").doesNotContain("/etc/");
    }
}
