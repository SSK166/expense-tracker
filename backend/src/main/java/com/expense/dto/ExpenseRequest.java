package com.expense.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class ExpenseRequest {
    private String title;
    private Double amount;
    private String category;
    private String note;
    private LocalDate date;
}
