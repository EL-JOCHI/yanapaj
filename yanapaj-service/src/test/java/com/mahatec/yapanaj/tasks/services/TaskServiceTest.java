package com.mahatec.yapanaj.tasks.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.models.TaskStatus;
import com.mahatec.yapanaj.tasks.repositories.TaskRepository;
import com.mahatec.yapanaj.tasks.requests.TaskRequest;
import java.util.Date;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock private TaskRepository taskRepository;

    @InjectMocks private TaskService taskService;

    private static final String USER_EMAIL = "testuser@example.com";
    private static final String TASK_ID = "taskId";

    @Test
    void givenValidTaskRequest_whenCreateTask_thenSaveTaskWithCorrectDetails() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Test Task", "Description", new Date(), TaskStatus.IN_PROGRESS);
        Task savedTask = new Task();
        savedTask.setId(TASK_ID);
        savedTask.setTitle("Test Task");
        savedTask.setDescription("Description");
        savedTask.setDueDate(taskRequest.dueDate());
        savedTask.setStatus(TaskStatus.IN_PROGRESS);
        savedTask.setUserEmail(USER_EMAIL);

        when(taskRepository.save(any(Task.class))).thenReturn(Mono.just(savedTask)); // Mock save

        // When
        taskService.createTask(taskRequest, USER_EMAIL).block();

        // Then
        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        Task capturedTask = taskCaptor.getValue();
        assertEquals("Test Task", capturedTask.getTitle());
        assertEquals("Description", capturedTask.getDescription());
        assertEquals(TaskStatus.IN_PROGRESS, capturedTask.getStatus());
        assertEquals(USER_EMAIL, capturedTask.getUserEmail());
    }

    @Test
    void givenTaskRequestWithNullStatus_whenCreateTask_thenSaveTaskWithDefaultStatus() {
        // Given
        TaskRequest taskRequest = new TaskRequest("Test Task", "Description", new Date(), null);
        Task savedTask = new Task(); // Create a Task object to be returned
        savedTask.setId(TASK_ID);
        savedTask.setTitle("Test Task");
        savedTask.setDescription("Description");
        savedTask.setDueDate(taskRequest.dueDate());
        savedTask.setStatus(TaskStatus.TODO); // Default status
        savedTask.setUserEmail(USER_EMAIL);

        when(taskRepository.save(any(Task.class))).thenReturn(Mono.just(savedTask)); // Mock save

        // When
        taskService.createTask(taskRequest, USER_EMAIL).block();

        // Then
        ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(taskCaptor.capture());
        Task capturedTask = taskCaptor.getValue();
        assertEquals(TaskStatus.TODO, capturedTask.getStatus());
    }

    @Test
    void givenValidTaskIdAndUserEmail_whenGetTaskById_thenReturnTask() {
        // Given
        Task task = new Task();
        task.setId(TASK_ID);
        task.setUserEmail(USER_EMAIL);
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.just(task));

        // When
        Mono<Task> result = taskService.getTaskById(TASK_ID, USER_EMAIL);

        // Then
        StepVerifier.create(result)
                .expectNextMatches(
                        t -> t.getId().equals(TASK_ID) && t.getUserEmail().equals(USER_EMAIL))
                .verifyComplete();
    }

    @Test
    void givenInvalidTaskId_whenGetTaskById_thenReturnEmptyMono() {
        // Given
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.empty());

        // When
        Mono<Task> result = taskService.getTaskById(TASK_ID, USER_EMAIL);

        // Then
        StepVerifier.create(result).verifyComplete();
    }

    @Test
    void givenValidTaskIdAndUserEmailAndTaskRequest_whenUpdateTask_thenUpdateTaskDetails() {
        // Given
        Task existingTask = new Task();
        existingTask.setId(TASK_ID);
        existingTask.setUserEmail(USER_EMAIL);
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.just(existingTask));

        TaskRequest taskRequest =
                new TaskRequest("Updated Task", "Updated Description", new Date(), TaskStatus.DONE);
        Task updatedTask = new Task();
        updatedTask.setId(TASK_ID);
        updatedTask.setTitle("Updated Task");
        updatedTask.setDescription("Updated Description");
        updatedTask.setDueDate(taskRequest.dueDate());
        updatedTask.setStatus(TaskStatus.DONE);
        updatedTask.setUserEmail(USER_EMAIL);
        when(taskRepository.save(any(Task.class))).thenReturn(Mono.just(updatedTask));

        // When
        Mono<Task> result = taskService.updateTask(TASK_ID, taskRequest, USER_EMAIL);

        // Then
        StepVerifier.create(result)
                .expectNextMatches(
                        task ->
                                task.getTitle().equals("Updated Task")
                                        && task.getDescription().equals("Updated Description")
                                        && task.getStatus() == TaskStatus.DONE)
                .verifyComplete();
    }

    @Test
    void givenInvalidTaskId_whenUpdateTask_thenReturnEmptyMono() {
        // Given
        TaskRequest taskRequest =
                new TaskRequest("Updated Task", "Updated Description", new Date(), TaskStatus.DONE);
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.empty());

        // When
        Mono<Task> result = taskService.updateTask(TASK_ID, taskRequest, USER_EMAIL);

        // Then
        StepVerifier.create(result).verifyComplete();
    }

    @Test
    void givenValidTaskIdAndUserEmail_whenDeleteTask_thenDeleteTask() {
        // Given
        Task task = new Task();
        task.setId(TASK_ID);
        task.setUserEmail(USER_EMAIL);
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.just(task));
        when(taskRepository.delete(task)).thenReturn(Mono.empty());

        // When
        Mono<Task> result = taskService.deleteTask(TASK_ID, USER_EMAIL);

        // Then
        StepVerifier.create(result)
                .expectNextMatches(
                        t -> t.getId().equals(TASK_ID) && t.getUserEmail().equals(USER_EMAIL))
                .verifyComplete();
    }

    @Test
    void givenInvalidTaskId_whenDeleteTask_thenReturnEmptyMono() {
        // Given
        when(taskRepository.findById(TASK_ID)).thenReturn(Mono.empty());

        // When
        Mono<Task> result = taskService.deleteTask(TASK_ID, USER_EMAIL);

        // Then
        StepVerifier.create(result).verifyComplete();
    }
}
