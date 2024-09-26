package com.mahatec.yapanaj.tasks.repositories;

import com.mahatec.yapanaj.tasks.models.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface TaskRepository extends ReactiveMongoRepository<Task, String> {

    Flux<Task> findAllByUserEmail(String email, Pageable pageable);

    Mono<Long> countByUserEmail(String email);
}
