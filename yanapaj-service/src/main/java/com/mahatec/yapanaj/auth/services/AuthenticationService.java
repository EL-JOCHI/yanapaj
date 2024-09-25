package com.mahatec.yapanaj.auth.services;

import com.mahatec.yapanaj.auth.jwt.JwtHelper;
import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.auth.repositories.UserRepository;
import com.mahatec.yapanaj.auth.requests.LoginRequest;
import com.mahatec.yapanaj.auth.requests.SignupRequest;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public final class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtHelper jwtHelper;
    private final PasswordEncoder passwordEncoder;

    public Mono<String> signUp(final SignupRequest signupRequest) {
        return userRepository
                .findByEmail(signupRequest.email())
                .flatMap(
                        existingUser ->
                                Mono.error(new IllegalArgumentException("Email already exists")))
                .switchIfEmpty(
                        Mono.defer(
                                () -> {
                                    User newUser = new User();
                                    newUser.setEmail(signupRequest.email());
                                    newUser.setPassword(
                                            passwordEncoder.encode(signupRequest.password()));
                                    newUser.setCreatedAt(new Date());
                                    newUser.setUpdatedAt(new Date());
                                    return userRepository.save(newUser);
                                }))
                .map(User.class::cast)
                .map(user -> jwtHelper.generateToken(user.getEmail()));
    }

    public Mono<String> login(final LoginRequest loginRequest) {
        return userRepository
                .findByEmail(loginRequest.email())
                .filter(
                        user ->
                                passwordEncoder.matches(
                                        loginRequest.password(), user.getPassword()))
                .map(user -> jwtHelper.generateToken(user.getEmail()))
                .switchIfEmpty(Mono.error(new RuntimeException("Invalid credentials")));
    }
}
