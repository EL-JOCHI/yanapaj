package com.mahatec.yapanaj.tasks.services;

import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.models.TaskStatus;
import com.mahatec.yapanaj.tasks.repositories.TaskRepository;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Comparator;

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

    public Mono<Page<Task>> getTasksByUserEmail(final String email, Pageable pageable) {
        return taskRepository.findAllByUserEmail(email, pageable)
                .collectList()
                .zipWith(taskRepository.countByUserEmail(email))
                .map(page -> new PageImpl<>(page.getT1(), pageable, page.getT2()));
    }

    public Mono<Task> getTaskById(final String id, final String userEmail) {
        return taskRepository
                .findById(id)
                .filter(task -> task.getUserEmail().equals(userEmail));
    }

    public Mono<Task> updateTask(final String id, final TaskRequest taskRequest, final String userEmail) {
        return taskRepository
                .findById(id)
                .filter(task -> task.getUserEmail().equals(userEmail))
                .flatMap(
                        existingTask -> {
                            existingTask.setTitle(taskRequest.title());
                            existingTask.setDescription(taskRequest.description());
                            existingTask.setDueDate(taskRequest.dueDate());
                            // Only update status if provided in the request
                            if (taskRequest.status() != null) {
                                existingTask.setStatus(taskRequest.status());
                            }
                            return taskRepository.save(existingTask);
                        })
                .switchIfEmpty(Mono.empty());
    }

    public Mono<Task> deleteTask(final String id, final String userEmail) {
        return taskRepository
                .findById(id)
                .filter(task -> task.getUserEmail().equals(userEmail))
                .flatMap(
                        taskToDelete -> taskRepository.delete(taskToDelete) // Delete the task
                                .thenReturn(taskToDelete) // Return the deleted task
                );
    }
}
