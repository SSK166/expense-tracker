package com.expense.controller;

import com.expense.dto.ExpenseRequest;
import com.expense.dto.MonthlySummaryDTO;
import com.expense.entity.ExpenseEntity;
import com.expense.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseEntity> addExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.addExpense(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseEntity>> getAllExpenses(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(expenseService.getAllExpenses(userDetails.getUsername()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ExpenseEntity>> getByCategory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String category) {
        return ResponseEntity.ok(expenseService.getByCategory(userDetails.getUsername(), category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {   // String id for MongoDB
        expenseService.deleteExpense(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<List<MonthlySummaryDTO>> getMonthlySummary(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int month,
            @RequestParam(defaultValue = "0") int year) {
        LocalDate now = LocalDate.now();
        int m = month == 0 ? now.getMonthValue() : month;
        int y = year == 0 ? now.getYear() : year;
        return ResponseEntity.ok(expenseService.getMonthlySummary(userDetails.getUsername(), m, y));
    }
}
