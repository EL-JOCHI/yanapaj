package com.mahatec.yapanaj.auth.jwt;

import static org.junit.jupiter.api.Assertions.*;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import java.util.Collections;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

class JwtHelperTest {

    private JwtHelper jwtHelper;
    private final String secret = "testsecrettestsecrettestsecrettestsecrettestsecret";

    @BeforeEach
    void setUp() {
        long expirationTime = 10000;
        jwtHelper = new JwtHelper(secret, expirationTime);
    }

    @Test
    void isTokenValid_validToken() {
        String username = "testuser";
        UserDetails userDetails = new User(username, "password", Collections.emptyList());
        String token = jwtHelper.generateToken(username);

        assertTrue(jwtHelper.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_expiredToken() {
        String username = "testuser";
        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        // Create a token that will expire immediately
        JwtHelper expiringJwtHelper = new JwtHelper(secret, 0);
        String token = expiringJwtHelper.generateToken(username);

        // Catch the ExpiredJwtException directly
        assertThrows(ExpiredJwtException.class, () -> jwtHelper.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_invalidUsername() {
        String username = "testuser";
        UserDetails userDetails = new User("differentuser", "password", Collections.emptyList());
        String token = jwtHelper.generateToken(username);

        assertFalse(jwtHelper.isTokenValid(token, userDetails));
    }

    @Test
    void extractUsername() {
        String username = "testuser";
        String token = jwtHelper.generateToken(username);

        assertEquals(username, jwtHelper.extractUsername(token));
    }

    @Test
    void extractClaim() {
        String username = "testuser";
        String token = jwtHelper.generateToken(username);

        Date issuedAt = jwtHelper.extractClaim(token, Claims::getIssuedAt);
        assertNotNull(issuedAt);
    }
}
