package com.mahatec.yapanaj.auth.controllers;

import com.mahatec.yapanaj.auth.requests.LoginRequest;
import com.mahatec.yapanaj.auth.requests.SignupRequest;
import com.mahatec.yapanaj.auth.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public Mono<ResponseEntity<String>> signup(@RequestBody SignupRequest signupRequest) {
        log.info("Signup request: {}", signupRequest);
        return authenticationService.signUp(signupRequest)
                .map(user -> ResponseEntity.status(HttpStatus.CREATED)
                        .body(user));
    }

    @PostMapping("/login")
    public Mono<ResponseEntity<String>> login(@RequestBody LoginRequest loginRequest) {
        log.info("Login request: {}", loginRequest.email());
        return authenticationService.login(loginRequest)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()); // Handle invalid credentials
    }

    @PreAuthorize(value = "isAuthenticated()")
    @PostMapping("/logout")
    public Mono<ResponseEntity<Void>> logout() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .doOnNext(authentication -> {
                    if (authentication != null && authentication.getPrincipal() instanceof UserDetails userDetails) {
                        final String username = userDetails.getUsername();
                        log.info("Logout request received from: {}!!", username);
                    }
                })
                .thenReturn(ResponseEntity.ok().build());
    }

}
