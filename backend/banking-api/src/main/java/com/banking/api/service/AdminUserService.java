package com.banking.api.service;

import com.banking.api.repository.AccountRepository;
import com.banking.api.repository.BeneficiaryRepository;
import com.banking.api.repository.LoanRepository;
import com.banking.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private BeneficiaryRepository beneficiaryRepository;

    @Transactional
    public void deleteUser(Long userId) {
        beneficiaryRepository.deleteByUserId(userId);
        accountRepository.deleteByUserId(userId);
        loanRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }
}