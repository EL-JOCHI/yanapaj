plugins {
	java
	id("org.springframework.boot") version "3.3.3"
	id("io.spring.dependency-management") version "1.1.6"
	id("com.diffplug.spotless") version "7.0.0.BETA2"
	jacoco
}

group = "com.mahatec"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
	maven { url = uri("https://repo.spring.io/milestone") }
}

extra["springModulithVersion"] = "1.2.3"
val jwtVersion = "0.12.6"
val springdocVersion = "2.6.0"
val jakartaServletApiVersion = "6.1.0"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.modulith:spring-modulith-starter-core")
	implementation("org.springframework.session:spring-session-core")
	// https://mvnrepository.com/artifact/jakarta.validation/jakarta.validation-api
	implementation("jakarta.validation:jakarta.validation-api")
	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-api
	implementation("io.jsonwebtoken:jjwt-api:$jwtVersion")
	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-impl
	implementation("io.jsonwebtoken:jjwt-impl:$jwtVersion")
	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-jackson
	implementation("io.jsonwebtoken:jjwt-jackson:$jwtVersion")
	// https://mvnrepository.com/artifact/org.springdoc/springdoc-openapi-starter-webflux-ui
	implementation("org.springdoc:springdoc-openapi-starter-webflux-ui:$springdocVersion")

	// https://mvnrepository.com/artifact/jakarta.servlet/jakarta.servlet-api
	compileOnly("jakarta.servlet:jakarta.servlet-api:$jakartaServletApiVersion")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	developmentOnly("org.springframework.boot:spring-boot-docker-compose")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")
	testImplementation("org.springframework.modulith:spring-modulith-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

dependencyManagement {
	imports {
		mavenBom("org.springframework.modulith:spring-modulith-bom:${property("springModulithVersion")}")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

spotless {
	java {
		importOrder()
		// Removing this momentary, until a fix is present: https://github.com/diffplug/spotless/issues/2159
		// removeUnusedImports()
		cleanthat()
		googleJavaFormat().aosp()
		formatAnnotations()
	}
}

tasks.test {
	finalizedBy(tasks.jacocoTestReport) // report is always generated after tests run
}

tasks.jacocoTestReport {
	dependsOn(tasks.test) // tests are required to run before generating the report
}

tasks.jacocoTestReport {
	reports {
		xml.required = false
		csv.required = false
		html.outputLocation = layout.buildDirectory.dir("jacocoHtml")
	}
}