package com.mahatec.yapanaj.auth.entities;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
@Getter
@Setter
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @NotBlank
    private String password;

    private Date createdAt;

    private Date updatedAt;
}
