package br.org.apaedigital.api;

import br.org.apaedigital.api.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ApaeDigitalApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApaeDigitalApiApplication.class, args);
    }
}
