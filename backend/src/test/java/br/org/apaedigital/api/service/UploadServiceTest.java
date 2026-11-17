package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.domain.UploadedFile;
import br.org.apaedigital.api.dto.upload.UploadResponse;
import br.org.apaedigital.api.exception.BadRequestException;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.UploadedFileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

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
    void gravaImagemNoBancoEDevolveUrlComTenant() {
        UploadResponse res = service.store(TENANT, png(new byte[]{1, 2, 3, 4}));

        assertThat(res.url()).startsWith("/uploads/apiuna/").endsWith(".png");
        assertThat(res.contentType()).isEqualTo("image/png");
        assertThat(res.size()).isEqualTo(4);

        // O conteudo vai para o banco (disco efemero em hosts gratuitos)...
        ArgumentCaptor<UploadedFile> saved = ArgumentCaptor.forClass(UploadedFile.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getData()).containsExactly(1, 2, 3, 4);
        assertThat(saved.getValue().getStoredName()).isEqualTo(res.fileName());
        // ...e nada e gravado em disco.
        assertThat(tempDir.resolve("apiuna")).doesNotExist();
    }

    @Test
    void carregaArquivoDoBanco() {
        UploadedFile record = new UploadedFile(TENANT, "abc.png", "foto.png", "image/png", 2,
                "/uploads/apiuna/abc.png", new byte[]{9, 8});
        when(repository.findByStoredName("abc.png")).thenReturn(Optional.of(record));

        UploadService.StoredFile file = service.load("apiuna", "abc.png");

        assertThat(file.contentType()).isEqualTo("image/png");
        assertThat(file.data()).containsExactly(9, 8);
    }

    @Test
    void carregaUploadAntigoDoDisco() throws Exception {
        Files.createDirectories(tempDir.resolve("apiuna"));
        Files.write(tempDir.resolve("apiuna").resolve("old.png"), new byte[]{7});
        UploadedFile legacy = new UploadedFile(TENANT, "old.png", "old.png", "image/png", 1,
                "/uploads/apiuna/old.png", null);
        when(repository.findByStoredName("old.png")).thenReturn(Optional.of(legacy));

        assertThat(service.load("apiuna", "old.png").data()).containsExactly(7);
    }

    @Test
    void naoEntregaArquivoDeOutroTenant() {
        UploadedFile record = new UploadedFile("outra", "abc.png", "foto.png", "image/png", 1,
                "/uploads/outra/abc.png", new byte[]{1});
        when(repository.findByStoredName("abc.png")).thenReturn(Optional.of(record));

        assertThatThrownBy(() -> service.load("apiuna", "abc.png"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    void arquivoInexistenteDaNotFound() {
        when(repository.findByStoredName("nada.png")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.load("apiuna", "nada.png"))
                .isInstanceOf(NotFoundException.class);
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
