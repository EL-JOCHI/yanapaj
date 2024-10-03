package com.mahatec.yapanaj.auth.services;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.mahatec.yapanaj.auth.jwt.JwtHelper;
import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.auth.repositories.UserRepository;
import com.mahatec.yapanaj.auth.requests.LoginRequest;
import com.mahatec.yapanaj.auth.requests.SignupRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock private UserRepository userRepository;

    @Mock private JwtHelper jwtHelper;

    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks private AuthenticationService authenticationService;

    @Test
    void givenNewUser_whenSignup_thenReturnJwtToken() {
        // Given
        SignupRequest signupRequest = new SignupRequest("test@example.com", "password");
        User newUser = new User();
        newUser.setEmail(signupRequest.email());
        newUser.setPassword("encodedPassword");

        when(userRepository.findByEmail(signupRequest.email())).thenReturn(Mono.empty());
        when(passwordEncoder.encode(signupRequest.password())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(Mono.just(newUser));
        when(jwtHelper.generateToken(signupRequest.email())).thenReturn("JWT Token");

        // When
        Mono<String> result = authenticationService.signUp(signupRequest);

        // Then
        StepVerifier.create(result).expectNext("JWT Token").verifyComplete();
    }

    @Test
    void givenExistingUser_whenSignup_thenThrowIllegalArgumentException() {
        // Given
        SignupRequest signupRequest = new SignupRequest("existing@example.com", "password");
        User existingUser = new User();
        existingUser.setEmail(signupRequest.email());

        when(userRepository.findByEmail(signupRequest.email())).thenReturn(Mono.just(existingUser));

        // When
        Mono<String> result = authenticationService.signUp(signupRequest);

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof IllegalArgumentException
                                        && throwable.getMessage().equals("Email already exists"))
                .verify();
    }

    @Test
    void givenValidCredentials_whenLogin_thenReturnJwtToken() {
        // Given
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        User user = new User();
        user.setEmail(loginRequest.email());
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail(loginRequest.email())).thenReturn(Mono.just(user));
        when(passwordEncoder.matches(loginRequest.password(), user.getPassword())).thenReturn(true);
        when(jwtHelper.generateToken(loginRequest.email())).thenReturn("JWT Token");

        // When
        Mono<String> result = authenticationService.login(loginRequest);

        // Then
        StepVerifier.create(result).expectNext("JWT Token").verifyComplete();
    }

    @Test
    void givenInvalidCredentials_whenLogin_thenThrowRuntimeException() {
        // Given
        LoginRequest loginRequest = new LoginRequest("test@example.com", "wrongpassword");
        User user = new User();
        user.setEmail(loginRequest.email());
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail(loginRequest.email())).thenReturn(Mono.just(user));
        when(passwordEncoder.matches(loginRequest.password(), user.getPassword()))
                .thenReturn(false);

        // When
        Mono<String> result = authenticationService.login(loginRequest);

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof RuntimeException
                                        && throwable.getMessage().equals("Invalid credentials"))
                .verify();
    }
}
