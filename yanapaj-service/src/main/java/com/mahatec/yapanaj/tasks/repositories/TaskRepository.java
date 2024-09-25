package com.mahatec.yapanaj.tasks.repositories;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.tasks.models.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;

public interface TaskRepository extends ReactiveMongoRepository<Task, String> {

    Flux<Task> findAllByUser(User user, Pageable pageable);

}
