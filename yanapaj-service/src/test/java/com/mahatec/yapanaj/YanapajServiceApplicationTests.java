package com.mahatec.yapanaj;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.modulith.core.ApplicationModules;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class YanapajServiceApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	void applicationModules() {
		final ApplicationModules modules = ApplicationModules.of(YanapajServiceApplication.class);
		modules.forEach(System.out::println);
		assertThat(modules).hasSize(3);
	}
}
