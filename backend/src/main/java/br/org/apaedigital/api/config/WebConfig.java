package br.org.apaedigital.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Serve os arquivos enviados (uploads) como recursos estaticos publicos.
 * Mapeia {app.uploads.public-path}/** para o diretorio {app.uploads.dir} em disco.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final AppProperties props;

    public WebConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String publicPath = props.getUploads().getPublicPath();
        String pattern = publicPath.endsWith("/") ? publicPath + "**" : publicPath + "/**";

        String absoluteDir = Paths.get(props.getUploads().getDir()).toAbsolutePath().normalize().toString();
        String location = "file:" + absoluteDir + "/";

        registry.addResourceHandler(pattern)
                .addResourceLocations(location);
    }
}
