package com.banking.api.repository;

import com.banking.api.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUserId(Long userId);

    void deleteByAccountId(Long accountId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Loan l WHERE l.user.id = :userId")
    void deleteByUserId(Long userId);
}