package com.mahatec.yapanaj.tasks.controllers;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.services.TaskService;
import com.mahatec.yapanaj.tasks.services.dtos.TaskDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PreAuthorize(value = "isAuthenticated()")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<Task> createTask(@Valid @RequestBody TaskDto taskDto,
                                 @AuthenticationPrincipal Mono<User> user) {
        return user.flatMap(currentUser -> taskService.createTask(taskDto, currentUser));
    }
}