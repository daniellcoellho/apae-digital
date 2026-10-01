package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.domain.UploadedFile;
import br.org.apaedigital.api.dto.upload.UploadResponse;
import br.org.apaedigital.api.exception.BadRequestException;
import br.org.apaedigital.api.repository.UploadedFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * Recebe arquivos (imagens e PDF), grava em disco por tenant e devolve a URL publica.
 * Valida tipo e tamanho; registra os metadados para rastreio.
 */
@Service
public class UploadService {

    /** Tipos aceitos -> extensao usada no nome gravado. */
    private static final Map<String, String> ALLOWED_TYPES = Map.of(
            "image/png", "png",
            "image/jpeg", "jpg",
            "image/webp", "webp",
            "image/gif", "gif",
            "image/svg+xml", "svg",
            "application/pdf", "pdf"
    );

    private final UploadedFileRepository repository;
    private final AppProperties props;

    public UploadService(UploadedFileRepository repository, AppProperties props) {
        this.repository = repository;
        this.props = props;
    }

    /**
     * Grava o arquivo recebido e retorna a URL publica.
     *
     * @param tenant slug do tenant (vem do JWT)
     * @param file   arquivo multipart
     */
    public UploadResponse store(String tenant, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Nenhum arquivo enviado.");
        }

        String contentType = file.getContentType();
        String ext = ALLOWED_TYPES.get(contentType);
        if (ext == null) {
            throw new BadRequestException("Tipo de arquivo não suportado. Envie imagem (PNG, JPG, WEBP, GIF, SVG) ou PDF.");
        }

        long max = props.getUploads().getMaxFileSizeBytes();
        if (file.getSize() > max) {
            throw new BadRequestException("Arquivo excede o tamanho máximo de " + (max / (1024 * 1024)) + " MB.");
        }

        String safeTenant = sanitizeTenant(tenant);
        String storedName = UUID.randomUUID().toString().replace("-", "") + "." + ext;

        try {
            Path tenantDir = baseDir().resolve(safeTenant);
            Files.createDirectories(tenantDir);
            Path target = tenantDir.resolve(storedName);
            // Protecao contra path traversal: o alvo deve ficar dentro do diretorio do tenant.
            if (!target.normalize().startsWith(tenantDir.normalize())) {
                throw new BadRequestException("Caminho de arquivo inválido.");
            }
            try (var in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new BadRequestException("Não foi possível gravar o arquivo: " + e.getMessage());
        }

        String url = props.getUploads().getPublicPath() + "/" + safeTenant + "/" + storedName;

        UploadedFile record = new UploadedFile(
                tenant,
                storedName,
                StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename()),
                contentType,
                file.getSize(),
                url
        );
        repository.save(record);

        return new UploadResponse(url, storedName, contentType, file.getSize());
    }

    private Path baseDir() {
        return Paths.get(props.getUploads().getDir()).toAbsolutePath().normalize();
    }

    /** Mantem apenas caracteres seguros para nome de pasta. */
    private String sanitizeTenant(String tenant) {
        if (tenant == null || tenant.isBlank()) {
            return "default";
        }
        String cleaned = tenant.toLowerCase().replaceAll("[^a-z0-9-]", "");
        return cleaned.isBlank() ? "default" : cleaned;
    }
}
