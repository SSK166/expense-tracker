package com.expense.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class MonthlySummaryDTO {
    private String category;
    private Double total;
}
