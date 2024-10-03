package com.mahatec.yapanaj.auth.converter;

import com.mahatec.yapanaj.auth.jwt.JwtHelper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.security.core.Authentication;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class JwtServerAuthenticationConverterTest {

    @Mock private JwtHelper jwtService;

    @InjectMocks private JwtServerAuthenticationConverter converter;

    @Test
    void givenInvalidAuthorizationHeader_whenConvert_thenReturnEmptyMono() {
        // Given - Missing Authorization header
        MockServerHttpRequest request = MockServerHttpRequest.get("/").build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        // When
        Mono<Authentication> result = converter.convert(exchange);

        // Then
        StepVerifier.create(result).verifyComplete();
    }

    @Test
    void givenAuthorizationHeaderWithoutBearer_whenConvert_thenReturnEmptyMono() {
        // Given - Invalid Authorization header format
        MockServerHttpRequest request =
                MockServerHttpRequest.get("/")
                        .header(HttpHeaders.AUTHORIZATION, "InvalidToken")
                        .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        // When
        Mono<Authentication> result = converter.convert(exchange);

        // Then
        StepVerifier.create(result).verifyComplete();
    }
}
