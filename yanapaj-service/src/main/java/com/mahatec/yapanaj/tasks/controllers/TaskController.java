package com.mahatec.yapanaj.tasks.controllers;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import com.mahatec.yapanaj.tasks.services.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PreAuthorize(value = "isAuthenticated()")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Task> createTask(
            @Valid @RequestBody TaskRequest taskRequest, @AuthenticationPrincipal Mono<User> user) {
        return user.flatMap(currentUser -> taskService.createTask(taskRequest, currentUser));
    }

    @PreAuthorize(value = "isAuthenticated()")
    @GetMapping
    public Flux<Task> getTasks(
            @AuthenticationPrincipal Mono<User> user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate,desc") String[] sort) {
        final Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        return user.flatMapMany(currentUser -> taskService.getTasksByUser(currentUser, pageable));
    }
}
