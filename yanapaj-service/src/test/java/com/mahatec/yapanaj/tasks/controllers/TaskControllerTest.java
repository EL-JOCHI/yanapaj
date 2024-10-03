package com.mahatec.yapanaj.tasks.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.models.TaskStatus;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import com.mahatec.yapanaj.tasks.services.TaskService;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock private TaskService taskService;

    @InjectMocks private TaskController taskController;

    private static final String USERNAME = "testuser";
    private static final String TASK_ID = "taskId";

    @BeforeEach
    void setUp() {
        UserDetails userDetails =
                new User(
                        USERNAME,
                        "password",
                        Collections.singletonList(new SimpleGrantedAuthority("USER")));
        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void givenValidTaskRequest_whenCreateTask_thenReturnCreatedTask() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Test Task", "Description", new Date(), TaskStatus.TODO);
        Task createdTask = new Task();
        createdTask.setId(TASK_ID);
        createdTask.setTitle("Test Task");

        when(taskService.createTask(any(TaskRequest.class), anyString()))
                .thenReturn(Mono.just(createdTask));

        // When
        Mono<Task> result =
                taskController.createTask(
                        taskRequest,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectNextMatches(
                        task -> task.getId().equals(TASK_ID) && task.getTitle().equals("Test Task"))
                .verifyComplete();
    }

    @Test
    void givenTaskRequestWithInvalidUser_whenCreateTask_thenReturnBadRequestError() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Test Task", "Description", new Date(), TaskStatus.TODO);

        when(taskService.createTask(any(TaskRequest.class), anyString())).thenReturn(Mono.empty());

        // When
        Mono<Task> result =
                taskController.createTask(
                        taskRequest,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.BAD_REQUEST)
                .verify();
    }

    @Test
    void givenValidUser_whenGetTasks_thenReturnPageOfTasks() {
        // Given
        List<Task> tasks = Collections.singletonList(new Task());
        Page<Task> taskPage = new PageImpl<>(tasks);

        when(taskService.getTasksByUserEmail(anyString(), any(Pageable.class)))
                .thenReturn(Mono.just(taskPage));

        // When
        Mono<Page<Task>> result =
                taskController.getTasks(
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())),
                        0,
                        10,
                        new String[] {"dueDate,desc"});

        // Then
        StepVerifier.create(result)
                .expectNextMatches(page -> page.getTotalElements() == 1)
                .verifyComplete();
    }

    @Test
    void givenInvalidUser_whenGetTasks_thenReturnNotFoundError() {
        // Given

        when(taskService.getTasksByUserEmail(anyString(), any(Pageable.class)))
                .thenReturn(Mono.empty());

        // When
        Mono<Page<Task>> result =
                taskController.getTasks(
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())),
                        0,
                        10,
                        new String[] {"dueDate,desc"});

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.NOT_FOUND)
                .verify();
    }

    @Test
    void givenValidTaskIdAndUser_whenGetTaskById_thenReturnTask() {
        // Given
        Task task = new Task();
        task.setId(TASK_ID);

        when(taskService.getTaskById(anyString(), anyString())).thenReturn(Mono.just(task));

        // When
        Mono<Task> result =
                taskController.getTaskById(
                        TASK_ID,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectNextMatches(t -> t.getId().equals(TASK_ID))
                .verifyComplete();
    }

    @Test
    void givenInvalidTaskIdOrUser_whenGetTaskById_thenReturnNotFoundError() {
        // Given
        when(taskService.getTaskById(anyString(), anyString())).thenReturn(Mono.empty());

        // When
        Mono<Task> result =
                taskController.getTaskById(
                        TASK_ID,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.NOT_FOUND)
                .verify();
    }

    @Test
    void givenValidTaskIdAndUserAndTaskRequest_whenUpdateTask_thenReturnUpdatedTask() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Test Task", "Description", new Date(), TaskStatus.TODO);
        Task updatedTask = new Task();
        updatedTask.setId(TASK_ID);
        updatedTask.setTitle("Updated Task");

        when(taskService.updateTask(anyString(), any(TaskRequest.class), anyString()))
                .thenReturn(Mono.just(updatedTask));

        // When
        Mono<Task> result =
                taskController.updateTask(
                        TASK_ID,
                        taskRequest,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectNextMatches(
                        task ->
                                task.getId().equals(TASK_ID)
                                        && task.getTitle().equals("Updated Task"))
                .verifyComplete();
    }

    @Test
    void givenInvalidTaskIdOrUser_whenUpdateTask_thenReturnNotFoundError() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Test Task", "Description", new Date(), TaskStatus.TODO);

        when(taskService.updateTask(anyString(), any(TaskRequest.class), anyString()))
                .thenReturn(Mono.empty());

        // When
        Mono<Task> result =
                taskController.updateTask(
                        TASK_ID,
                        taskRequest,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.NOT_FOUND)
                .verify();
    }

    @Test
    void givenValidTaskIdAndUser_whenDeleteTask_thenReturnNoContent() {
        // Given
        when(taskService.deleteTask(anyString(), anyString())).thenReturn(Mono.empty());

        // When
        Mono<Task> result =
                taskController.deleteTask(
                        TASK_ID,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.NOT_FOUND
                                        && Objects.equals(
                                                ((ResponseStatusException) throwable).getReason(),
                                                "Task not found or you don't have permission to delete it."))
                .verify();
    }

    @Test
    void givenInvalidTaskIdOrUser_whenDeleteTask_thenReturnNotFoundError() {
        // Given
        when(taskService.deleteTask(anyString(), anyString())).thenReturn(Mono.empty());

        // When
        Mono<Task> result =
                taskController.deleteTask(
                        TASK_ID,
                        Mono.just(
                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                                instanceof UserDetails
                                        ? (UserDetails)
                                                SecurityContextHolder.getContext()
                                                        .getAuthentication()
                                                        .getPrincipal()
                                        : new User(USERNAME, "password", List.of())));

        // Then
        StepVerifier.create(result)
                .expectErrorMatches(
                        throwable ->
                                throwable instanceof ResponseStatusException
                                        && ((ResponseStatusException) throwable).getStatusCode()
                                                == HttpStatus.NOT_FOUND)
                .verify();
    }
}
