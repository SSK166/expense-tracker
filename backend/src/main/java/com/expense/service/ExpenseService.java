package com.expense.service;

import com.expense.dto.ExpenseRequest;
import com.expense.dto.MonthlySummaryDTO;
import com.expense.entity.ExpenseEntity;
import com.expense.entity.UserEntity;
import com.expense.exception.ResourceNotFoundException;
import com.expense.repository.ExpenseRepository;
import com.expense.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private UserEntity getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ExpenseEntity addExpense(String username, ExpenseRequest request) {
        UserEntity user = getUser(username);

        ExpenseEntity expense = new ExpenseEntity();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setNote(request.getNote());
        expense.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        expense.setUserId(user.getId());

        return expenseRepository.save(expense);
    }

    public List<ExpenseEntity> getAllExpenses(String username) {
        UserEntity user = getUser(username);
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId());
    }

    public List<ExpenseEntity> getByCategory(String username, String category) {
        UserEntity user = getUser(username);
        return expenseRepository.findByUserIdAndCategory(user.getId(), category);
    }

    public void deleteExpense(String username, String expenseId) {
        ExpenseEntity expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        UserEntity user = getUser(username);
        if (!expense.getUserId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }

    // Monthly summary - group by category in Java (no SQL needed)
    public List<MonthlySummaryDTO> getMonthlySummary(String username, int month, int year) {
        UserEntity user = getUser(username);

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<ExpenseEntity> expenses = expenseRepository
                .findByUserIdAndDateBetween(user.getId(), start, end);

        // Group by category and sum amounts
        Map<String, Double> grouped = new LinkedHashMap<>();
        for (ExpenseEntity e : expenses) {
            grouped.merge(e.getCategory(), e.getAmount(), Double::sum);
        }

        return grouped.entrySet().stream()
                .map(entry -> new MonthlySummaryDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
}
