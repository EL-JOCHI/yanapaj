package com.mahatec.yapanaj;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class YanapajServiceApplicationTests {


	@Test
	void contextLoads() {
		// In Spring Boot, this test is used to verify that the application context loads successfully.
	}

	@Test
	void applicationModules() {
		final ApplicationModules modules = ApplicationModules.of(YanapajServiceApplication.class);
		modules.forEach(System.out::println);
		assertThat(modules).hasSize(2);
	}
}
