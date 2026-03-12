package com.expense.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "expenses")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ExpenseEntity {

    @Id
    private String id;
    private String title;
    private Double amount;
    private String category;
    private String note;
    private LocalDate date;
    private String userId;
}
