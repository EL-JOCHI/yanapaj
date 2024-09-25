package com.mahatec.yapanaj.auth.services;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.auth.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public final class UserService {

    private final UserRepository userRepository;

    public Mono<User> findUserByEmail(final String email) {
        return userRepository.findByEmail(email);
    }
}
