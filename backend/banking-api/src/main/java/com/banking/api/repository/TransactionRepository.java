package com.banking.api.repository;

import com.banking.api.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId);
    void deleteByAccountId(Long accountId);
    boolean existsByTransactionRef(String transactionRef);
}