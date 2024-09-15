package com.mahatec.yapanaj.auth.controllers;

import com.mahatec.yapanaj.auth.controllers.requests.SignupRequest;
import com.mahatec.yapanaj.auth.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
}
