package com.mahatec.yapanaj.auth.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

@Component
public final class JwtHelper {

    private final Key secretKey;
    private final long expirationTime;

    public JwtHelper(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration:10000}") long expirationTime) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationTime = expirationTime;
    }

    public String generateToken(String username) {
        final Date now = new Date();
        final Date expiryDate = new Date(now.getTime() + expirationTime);
        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

}
