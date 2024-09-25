package com.mahatec.yapanaj.tasks.services;

import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.models.TaskStatus;
import com.mahatec.yapanaj.tasks.repositories.TaskRepository;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;

    public Mono<Task> createTask(final TaskRequest taskRequest, final String userEmail) {
        final Task task = new Task();
        task.setTitle(taskRequest.title());
        task.setDescription(taskRequest.description());
        task.setDueDate(taskRequest.dueDate());
        task.setStatus(TaskStatus.TODO);
        task.setUserEmail(userEmail);
        log.debug("Saving task: {}", task);
        return taskRepository
                .save(task)
                .doOnSuccess(
                        savedTask -> log.info("Task saved successfully: {}", savedTask.getId()))
                .doOnError(error -> log.error("Error saving task: {}", error.getMessage()));
    }

    public Flux<Task> getTasksByUserEmail(final String email, Pageable pageable) {
        return taskRepository.findAllByUserEmail(email, pageable);
    }
}
