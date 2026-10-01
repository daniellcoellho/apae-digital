package br.org.apaedigital.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuracoes da aplicacao (prefixo "app" no application.yml).
 */
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private Seed seed = new Seed();
    private Uploads uploads = new Uploads();

    public Jwt getJwt() {
        return jwt;
    }

    public void setJwt(Jwt jwt) {
        this.jwt = jwt;
    }

    public Uploads getUploads() {
        return uploads;
    }

    public void setUploads(Uploads uploads) {
        this.uploads = uploads;
    }

    public Cors getCors() {
        return cors;
    }

    public void setCors(Cors cors) {
        this.cors = cors;
    }

    public Seed getSeed() {
        return seed;
    }

    public void setSeed(Seed seed) {
        this.seed = seed;
    }

    public static class Jwt {
        private String secret;
        private long accessTokenTtlMinutes = 60;
        private long refreshTokenTtlDays = 7;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getAccessTokenTtlMinutes() {
            return accessTokenTtlMinutes;
        }

        public void setAccessTokenTtlMinutes(long accessTokenTtlMinutes) {
            this.accessTokenTtlMinutes = accessTokenTtlMinutes;
        }

        public long getRefreshTokenTtlDays() {
            return refreshTokenTtlDays;
        }

        public void setRefreshTokenTtlDays(long refreshTokenTtlDays) {
            this.refreshTokenTtlDays = refreshTokenTtlDays;
        }
    }

    public static class Cors {
        private String allowedOrigins = "http://localhost:3000";

        public String getAllowedOrigins() {
            return allowedOrigins;
        }

        public void setAllowedOrigins(String allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }
    }

    public static class Uploads {
        /** Diretorio base onde os arquivos enviados sao gravados. */
        private String dir = "uploads";
        /** URL base publica usada para montar o link do arquivo (ex.: /uploads). */
        private String publicPath = "/uploads";
        /** Tamanho maximo por arquivo em bytes (default 5 MB). */
        private long maxFileSizeBytes = 5L * 1024 * 1024;

        public String getDir() {
            return dir;
        }

        public void setDir(String dir) {
            this.dir = dir;
        }

        public String getPublicPath() {
            return publicPath;
        }

        public void setPublicPath(String publicPath) {
            this.publicPath = publicPath;
        }

        public long getMaxFileSizeBytes() {
            return maxFileSizeBytes;
        }

        public void setMaxFileSizeBytes(long maxFileSizeBytes) {
            this.maxFileSizeBytes = maxFileSizeBytes;
        }
    }

    public static class Seed {
        private boolean enabled = true;
        private String tenant = "apiuna";
        private String adminName = "Administrador";
        private String adminEmail = "admin@apae.org";
        private String adminPassword = "admin123";

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getTenant() {
            return tenant;
        }

        public void setTenant(String tenant) {
            this.tenant = tenant;
        }

        public String getAdminName() {
            return adminName;
        }

        public void setAdminName(String adminName) {
            this.adminName = adminName;
        }

        public String getAdminEmail() {
            return adminEmail;
        }

        public void setAdminEmail(String adminEmail) {
            this.adminEmail = adminEmail;
        }

        public String getAdminPassword() {
            return adminPassword;
        }

        public void setAdminPassword(String adminPassword) {
            this.adminPassword = adminPassword;
        }
    }
}
