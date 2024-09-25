package com.mahatec.yapanaj.tasks.models;

import com.mahatec.yapanaj.auth.models.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks")
@Getter
@Setter
public class Task {

    @Id
    private String id;

    @NotBlank
    private String title;

    private String description;

    @DBRef
    private User user;
}
