package com.expense.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserEntity {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String password;
    private String name;
}
