package com.mahatec.yapanaj.tasks.services;

import com.mahatec.yapanaj.auth.models.User;
import com.mahatec.yapanaj.tasks.models.Task;
import com.mahatec.yapanaj.tasks.repositories.TaskRepository;
import com.mahatec.yapanaj.tasks.services.dtos.TaskDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Mono<Task> createTask(final TaskDto taskDto, final User user) {
        final Task task = new Task();
        task.setTitle(taskDto.title());
        task.setDescription(taskDto.description());
        task.setUser(user);
        return taskRepository.save(task);
    }
}