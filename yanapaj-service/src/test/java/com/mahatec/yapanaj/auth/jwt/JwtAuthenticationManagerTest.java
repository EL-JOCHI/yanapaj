package com.mahatec.yapanaj.auth.jwt;

import static org.mockito.Mockito.when;

import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationManagerTest {

    @Mock private JwtHelper jwtService;

    @InjectMocks private JwtAuthenticationManager jwtAuthenticationManager;

    @Test
    void givenValidJwtToken_whenAuthenticate_thenReturnAuthenticatedAuthentication() {
        // Given
        String token = "test-token";
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new JwtToken(token, userDetails);

        when(jwtService.isTokenValid(token, userDetails)).thenReturn(true);

        // When
        Mono<Authentication> result = jwtAuthenticationManager.authenticate(authentication);

        // Then
        StepVerifier.create(result)
                .expectNextMatches(auth -> auth instanceof JwtToken && auth.isAuthenticated())
                .verifyComplete();
    }

    @Test
    void givenInvalidJwtToken_whenAuthenticate_thenReturnError() {
        // Given
        String token = "invalid-token";
        UserDetails userDetails = new User("testuser", "password", Collections.emptyList());
        Authentication authentication = new JwtToken(token, userDetails);

        when(jwtService.isTokenValid(token, userDetails)).thenReturn(false);

        // When
        Mono<Authentication> result = jwtAuthenticationManager.authenticate(authentication);

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof RuntimeException
                                        && throwable.getMessage().equals("Invalid token."))
                .verify();
    }
}
