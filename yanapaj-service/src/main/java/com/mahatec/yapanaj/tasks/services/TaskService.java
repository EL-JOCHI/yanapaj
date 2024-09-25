package com.mahatec.yapanaj.tasks.services;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.repositories.TaskRepository;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Mono<Task> createTask(final TaskRequest taskRequest, final User user) {
        final Task task = new Task();
        task.setTitle(taskRequest.title());
        task.setDescription(taskRequest.description());
        task.setDueDate(taskRequest.dueDate());
        task.setUser(user);
        return taskRepository.save(task);
    }

    public Flux<Task> getTasksByUser(final User user, final Pageable pageable) {
        return taskRepository.findAllByUser(user, pageable);
    }
}
