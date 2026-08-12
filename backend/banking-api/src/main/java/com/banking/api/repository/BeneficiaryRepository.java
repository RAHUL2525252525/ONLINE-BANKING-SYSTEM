package com.banking.api.repository;

import com.banking.api.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    boolean existsByUserIdAndBeneficiaryAccountNumber(Long userId, String beneficiaryAccountNumber);

    List<Beneficiary> findByUserId(Long userId);

    Optional<Beneficiary> findByIdAndUserId(Long id, Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Beneficiary b WHERE b.user.id = :userId")
    void deleteByUserId(Long userId);
}