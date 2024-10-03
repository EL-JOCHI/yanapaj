package com.mahatec.yapanaj.auth.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.mahatec.yapanaj.auth.requests.LoginRequest;
import com.mahatec.yapanaj.auth.requests.SignupRequest;
import com.mahatec.yapanaj.auth.services.AuthenticationService;
import java.util.Objects;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class AuthenticationControllerTest {

    @Mock private AuthenticationService authenticationService;

    @InjectMocks private AuthenticationController authenticationController;

    @Test
    void givenValidSignupRequest_whenSignup_thenReturnCreatedResponse() {
        // Given
        SignupRequest signupRequest = new SignupRequest("test@example.com", "password");
        when(authenticationService.signUp(any(SignupRequest.class)))
                .thenReturn(Mono.just("User created"));

        // When
        Mono<ResponseEntity<String>> response = authenticationController.signup(signupRequest);

        // Then
        StepVerifier.create(response)
                .expectNextMatches(
                        res ->
                                res.getStatusCode() == HttpStatus.CREATED
                                        && Objects.equals(res.getBody(), "User created"))
                .verifyComplete();
    }

    @Test
    void givenValidLoginRequest_whenLogin_thenReturnOkResponse() {
        // Given
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        when(authenticationService.login(any(LoginRequest.class)))
                .thenReturn(Mono.just("JWT Token"));

        // When
        Mono<ResponseEntity<String>> response = authenticationController.login(loginRequest);

        // Then
        StepVerifier.create(response)
                .expectNextMatches(
                        res ->
                                res.getStatusCode() == HttpStatus.OK
                                        && Objects.equals(res.getBody(), "JWT Token"))
                .verifyComplete();
    }

    @Test
    void givenInvalidLoginRequest_whenLogin_thenReturnUnauthorizedResponse() {
        // Given
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongpassword");
        when(authenticationService.login(any(LoginRequest.class)))
                .thenReturn(Mono.error(new RuntimeException("Invalid credentials")));

        // When
        Mono<ResponseEntity<String>> response = authenticationController.login(loginRequest);

        // Then
        StepVerifier.create(response)
                .expectNextMatches(res -> res.getStatusCode() == HttpStatus.UNAUTHORIZED)
                .verifyComplete();
    }
}
