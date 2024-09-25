package com.mahatec.yapanaj.auth.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.security.web.server.authentication.ServerAuthenticationConverter;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class AuthSecurityConfig {

    @Bean
    SecurityWebFilterChain springWebFilterChain(
            final ServerHttpSecurity http,
            final ReactiveAuthenticationManager authenticationManager,
            final ServerAuthenticationConverter authenticationConverter) {

        final AuthenticationWebFilter authenticationWebFilter =
                new AuthenticationWebFilter(authenticationManager);
        authenticationWebFilter.setServerAuthenticationConverter(authenticationConverter);

        return http.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(
                        exchanges ->
                                exchanges
                                        .pathMatchers("/api/v1/auth/signup")
                                        .permitAll()
                                        .pathMatchers("/api/v1/auth/login")
                                        .permitAll()
                                        .pathMatchers("/v1/yanapaj/**")
                                        .permitAll()
                                        .anyExchange()
                                        .authenticated())
                .addFilterAt(authenticationWebFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .cors(ServerHttpSecurity.CorsSpec::disable)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
