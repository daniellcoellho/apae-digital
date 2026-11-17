package br.org.apaedigital.api.service;

import br.org.apaedigital.api.config.AppProperties;
import br.org.apaedigital.api.domain.UploadedFile;
import br.org.apaedigital.api.dto.upload.UploadResponse;
import br.org.apaedigital.api.exception.BadRequestException;
import br.org.apaedigital.api.exception.NotFoundException;
import br.org.apaedigital.api.repository.UploadedFileRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

/**
 * Recebe arquivos (imagens e PDF), grava o conteudo no banco e devolve a URL publica.
 * Valida tipo e tamanho.
 *
 * <p>O binario fica no Postgres (e nao em disco) porque hosts gratuitos tem disco
 * efemero. Registros antigos, sem conteudo no banco, ainda sao lidos do diretorio
 * {@code app.uploads.dir} se o arquivo existir.</p>
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

    /** Conteudo de um arquivo pronto para ser servido. */
    public record StoredFile(String contentType, byte[] data) {
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

        byte[] data;
        try {
            data = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Não foi possível ler o arquivo: " + e.getMessage());
        }

        String safeTenant = sanitizeTenant(tenant);
        String storedName = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        String url = props.getUploads().getPublicPath() + "/" + safeTenant + "/" + storedName;

        UploadedFile record = new UploadedFile(
                tenant,
                storedName,
                StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename()),
                contentType,
                data.length,
                url,
                data
        );
        repository.save(record);

        return new UploadResponse(url, storedName, contentType, data.length);
    }

    /**
     * Busca um arquivo pelo segmento de tenant e nome gravado (como aparecem na URL publica).
     *
     * @throws NotFoundException se nao existir ou nao pertencer ao tenant informado
     */
    public StoredFile load(String tenantSegment, String storedName) {
        UploadedFile record = repository.findByStoredName(storedName)
                .filter(r -> sanitizeTenant(r.getTenantSlug()).equals(tenantSegment))
                .orElseThrow(() -> new NotFoundException("Arquivo não encontrado."));

        if (record.getData() != null) {
            return new StoredFile(record.getContentType(), record.getData());
        }
        return new StoredFile(record.getContentType(), readLegacyFromDisk(tenantSegment, storedName));
    }

    /** Compatibilidade: uploads feitos antes da V9 ficaram apenas em disco. */
    private byte[] readLegacyFromDisk(String tenantSegment, String storedName) {
        Path base = Paths.get(props.getUploads().getDir()).toAbsolutePath().normalize();
        Path target = base.resolve(tenantSegment).resolve(storedName).normalize();
        if (!target.startsWith(base) || !Files.isRegularFile(target)) {
            throw new NotFoundException("Arquivo não encontrado.");
        }
        try {
            return Files.readAllBytes(target);
        } catch (IOException e) {
            throw new NotFoundException("Arquivo não encontrado.");
        }
    }

    /** Mantem apenas caracteres seguros para o segmento de tenant da URL. */
    private String sanitizeTenant(String tenant) {
        if (tenant == null || tenant.isBlank()) {
            return "default";
        }
        String cleaned = tenant.toLowerCase().replaceAll("[^a-z0-9-]", "");
        return cleaned.isBlank() ? "default" : cleaned;
    }
}
