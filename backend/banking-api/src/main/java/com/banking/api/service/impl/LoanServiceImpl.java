package com.banking.api.service.impl;

import com.banking.api.dto.request.ApplyLoanRequest;
import com.banking.api.dto.request.LoanDecisionRequest;
import com.banking.api.dto.response.LoanResponse;
import com.banking.api.entity.Account;
import com.banking.api.entity.Loan;
import com.banking.api.entity.User;
import com.banking.api.exception.BankingException;
import com.banking.api.repository.AccountRepository;
import com.banking.api.repository.LoanRepository;
import com.banking.api.repository.UserRepository;
import com.banking.api.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    @Override
    @Transactional
    public LoanResponse applyLoan(String userEmail, ApplyLoanRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new BankingException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("You are not authorized to use this account");
        }

        Loan loan = Loan.builder()
                .loanType(request.getLoanType())
                .amount(request.getAmount())
                .tenureMonths(request.getTenureMonths())
                .purpose(request.getPurpose())
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        loanRepository.save(loan);
        return mapToResponse(loan);
    }

    @Override
    public List<LoanResponse> getMyLoans(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        return loanRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LoanResponse> getAllLoans() {
        return loanRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LoanResponse approveLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new BankingException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.PENDING) {
            throw new BankingException("Loan has already been decided");
        }

        // Credit the loan amount into the user's account
        Account account = loan.getAccount();
        account.setBalance(account.getBalance().add(loan.getAmount()));
        accountRepository.save(account);

        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setDecidedAt(LocalDateTime.now());
        loanRepository.save(loan);

        return mapToResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse rejectLoan(Long loanId, LoanDecisionRequest request) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new BankingException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.PENDING) {
            throw new BankingException("Loan has already been decided");
        }

        loan.setStatus(Loan.LoanStatus.REJECTED);
        loan.setRejectionReason(request.getRejectionReason() != null
                ? request.getRejectionReason() : "Not specified");
        loan.setDecidedAt(LocalDateTime.now());
        loanRepository.save(loan);

        return mapToResponse(loan);
    }

    private LoanResponse mapToResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId())
                .loanType(loan.getLoanType().name())
                .amount(loan.getAmount())
                .tenureMonths(loan.getTenureMonths())
                .interestRate(loan.getInterestRate())
                .purpose(loan.getPurpose())
                .status(loan.getStatus().name())
                .rejectionReason(loan.getRejectionReason())
                .accountNumber(loan.getAccount().getAccountNumber())
                .applicantEmail(loan.getUser().getEmail())
                .appliedAt(loan.getAppliedAt())
                .decidedAt(loan.getDecidedAt())
                .build();
    }
}