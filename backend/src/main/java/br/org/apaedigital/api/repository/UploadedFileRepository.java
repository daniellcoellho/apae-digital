package br.org.apaedigital.api.repository;

import br.org.apaedigital.api.domain.UploadedFile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {
}
