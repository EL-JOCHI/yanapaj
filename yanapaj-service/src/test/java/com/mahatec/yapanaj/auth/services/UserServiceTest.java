package com.mahatec.yapanaj.auth.services;

import static org.mockito.Mockito.when;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.auth.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;

    @InjectMocks private UserService userService;

    @Test
    void givenExistingEmail_whenFindUserByEmail_thenReturnUser() {
        // Given
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Mono.just(user));

        // When
        Mono<User> result = userService.findUserByEmail(email);

        // Then
        StepVerifier.create(result).expectNext(user).verifyComplete();
    }

    @Test
    void givenNonExistingEmail_whenFindUserByEmail_thenReturnEmptyMono() {
        // Given
        String email = "nonexisting@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Mono.empty());

        // When
        Mono<User> result = userService.findUserByEmail(email);

        // Then
        StepVerifier.create(result).verifyComplete();
    }
}
