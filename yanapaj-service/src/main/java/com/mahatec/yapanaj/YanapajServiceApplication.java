package com.mahatec.yapanaj;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info =
                @Info(
                        title = "Yanapaj API",
                        version = "1.0",
                        description = "Yanapaj API documentation"))
public class YanapajServiceApplication {

    public static void main(String... args) {
        SpringApplication.run(YanapajServiceApplication.class, args);
    }
}
