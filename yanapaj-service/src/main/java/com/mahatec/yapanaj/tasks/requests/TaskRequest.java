package com.mahatec.yapanaj.tasks.requests;

import com.mahatec.yapanaj.tasks.models.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

public record TaskRequest(
        @NotBlank(message = "Title is required") String title,
        String description,
        @NotNull(message = "Due date is required") @FutureOrPresent(message = "Due date must be in the present or future")
                Date dueDate,
        TaskStatus status) {}
