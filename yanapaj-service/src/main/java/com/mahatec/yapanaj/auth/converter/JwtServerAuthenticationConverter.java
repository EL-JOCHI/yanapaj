package com.mahatec.yapanaj.auth.converter;

import com.mahatec.yapanaj.auth.jwt.JwtHelper;
import com.mahatec.yapanaj.auth.jwt.JwtToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
final class JwtServerAuthenticationConverter implements ServerAuthenticationConverter {

    private static final String BEARER = "Bearer ";
    private final JwtHelper jwtService;

    @Override
    public Mono<Authentication> convert(final ServerWebExchange exchange) {
        return Mono.justOrEmpty(
                        exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                .filter(header -> header.startsWith(BEARER))
                .map(header -> header.substring(BEARER.length()))
                .map(token -> new JwtToken(token, createUserDetails(token)));
    }

    private UserDetails createUserDetails(final String token) {
        String username = jwtService.extractUsername(token);
        return User.builder().username(username).password("").build();
    }
}
