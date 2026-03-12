package com.expense.repository;

import com.expense.entity.ExpenseEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<ExpenseEntity, String> {
    List<ExpenseEntity> findByUserIdOrderByDateDesc(String userId);
    List<ExpenseEntity> findByUserIdAndCategory(String userId, String category);
    List<ExpenseEntity> findByUserIdAndDateBetween(String userId, java.time.LocalDate start, java.time.LocalDate end);
}
