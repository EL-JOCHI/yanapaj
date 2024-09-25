package com.mahatec.yapanaj.auth.models;

import jakarta.validation.constraints.NotBlank;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter
@Setter
public class User {

    @Id private String id;

    @Indexed(unique = true)
    private String email;

    @NotBlank private String password;

    private Date createdAt;

    private Date updatedAt;
}
