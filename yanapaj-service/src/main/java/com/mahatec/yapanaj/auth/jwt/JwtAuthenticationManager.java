package com.mahatec.yapanaj.auth.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
class JwtAuthenticationManager implements ReactiveAuthenticationManager {

    private final JwtHelper jwtService;

    @Override
    public Mono<Authentication> authenticate(final Authentication authentication) {
        return Mono.just(authentication)
                .cast(JwtToken.class)
                .filter(
                        jwtToken ->
                                jwtService.isTokenValid(
                                        jwtToken.getToken(),
                                        (UserDetails) authentication.getPrincipal()))
                .map(jwtToken -> jwtToken.withAuthenticated(true))
                .switchIfEmpty(Mono.error(new RuntimeException("Invalid token.")));
    }
}
