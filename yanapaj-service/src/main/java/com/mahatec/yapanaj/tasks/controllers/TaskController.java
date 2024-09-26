package com.mahatec.yapanaj.tasks.controllers;

import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import com.mahatec.yapanaj.tasks.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PreAuthorize(value = "isAuthenticated()")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Task> createTask(
            @Valid @RequestBody TaskRequest taskRequest,
            @AuthenticationPrincipal Mono<UserDetails> userDetails) {
        log.info("Creating a new Task: {}", taskRequest);

        return userDetails.flatMap(
                userInfo -> {
                    log.info("Request from {}", userInfo);
                    return taskService
                            .createTask(taskRequest, userInfo.getUsername())
                            .switchIfEmpty(
                                    Mono.error(
                                            new ResponseStatusException(
                                                    HttpStatus.BAD_REQUEST, "User not found")));
                });
    }

    @PreAuthorize(value = "isAuthenticated()")
    @GetMapping
    public Mono<Page<Task>> getTasks(
            @AuthenticationPrincipal Mono<UserDetails> userDetailsMono,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate,desc") String[] sort) {

        final Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        return userDetailsMono
                .flatMap(
                        userDetails ->
                                taskService.getTasksByUserEmail(
                                        userDetails.getUsername(), pageable))
                .switchIfEmpty(
                        Mono.error(
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found or no tasks available")));
    }

    @PreAuthorize(value = "isAuthenticated()")
    @GetMapping("/{id}")
    public Mono<Task> getTaskById(
            @PathVariable String id, @AuthenticationPrincipal Mono<UserDetails> userDetails) {
        return userDetails.flatMap(
                userInfo ->
                        taskService
                                .getTaskById(id, userInfo.getUsername())
                                .switchIfEmpty(
                                        Mono.error(
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Task not found or you don't have permission to access it."))));
    }

    @PreAuthorize(value = "isAuthenticated()")
    @PutMapping("/{id}")
    public Mono<Task> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest taskRequest,
            @AuthenticationPrincipal Mono<UserDetails> userDetails) {
        return userDetails.flatMap(
                userInfo ->
                        taskService
                                .updateTask(id, taskRequest, userInfo.getUsername())
                                .switchIfEmpty(
                                        Mono.error(
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Task not found or you don't have permission to update it."))));
    }

    @PreAuthorize(value = "isAuthenticated()")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Task> deleteTask(
            @PathVariable String id, @AuthenticationPrincipal Mono<UserDetails> userDetails) {
        return userDetails.flatMap(
                userInfo ->
                        taskService
                                .deleteTask(id, userInfo.getUsername())
                                .switchIfEmpty(
                                        Mono.error(
                                                new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Task not found or you don't have permission to delete it."))));
    }
}
