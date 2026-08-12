package com.banking.api.service.impl;

import com.banking.api.dto.request.CreateAccountRequest;
import com.banking.api.dto.response.AccountResponse;
import com.banking.api.entity.Account;
import com.banking.api.entity.User;
import com.banking.api.exception.BankingException;
import com.banking.api.repository.AccountRepository;
import com.banking.api.repository.LoanRepository;
import com.banking.api.repository.TransactionRepository;
import com.banking.api.repository.UserRepository;
import com.banking.api.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final LoanRepository loanRepository;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public AccountResponse createAccount(String userEmail, CreateAccountRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        boolean kycComplete = user.getAadharNumber() != null
                && user.getPanNumber() != null
                && user.getDateOfBirth() != null;

        if (!kycComplete) {
            if (request.getAadharNumber() == null || request.getPanNumber() == null || request.getDateOfBirth() == null) {
                throw new BankingException("Aadhar number, PAN number, and date of birth are required to open your first account.");
            }
            user.setAadharNumber(request.getAadharNumber());
            user.setPanNumber(request.getPanNumber());
            user.setDateOfBirth(request.getDateOfBirth());
            user.setNomineeName(request.getNomineeName());
            user.setNomineeRelation(request.getNomineeRelation());
            userRepository.save(user);
        }

        boolean alreadyHasType = accountRepository.findByUserId(user.getId())
                .stream()
                .anyMatch(acc -> acc.getAccountType() == request.getAccountType());

        if (alreadyHasType) {
            throw new BankingException(
                    "You already have a " + request.getAccountType() + " account. Only one account per type is allowed.");
        }

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(request.getAccountType())
                .balance(BigDecimal.ZERO)
                .status(Account.AccountStatus.ACTIVE)
                .user(user)
                .build();

        accountRepository.save(account);
        return mapToResponse(account);
    }

    @Override
    public List<AccountResponse> getMyAccounts(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountByNumber(String accountNumber, String userEmail) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BankingException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("You are not authorized to view this account");
        }

        return mapToResponse(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AccountResponse freezeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BankingException("Account not found"));
        account.setStatus(Account.AccountStatus.FROZEN);
        accountRepository.save(account);
        return mapToResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse activateAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BankingException("Account not found"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        accountRepository.save(account);
        return mapToResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse closeAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BankingException("Account not found"));

        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new BankingException("Cannot close account with remaining balance. Withdraw funds first.");
        }

        account.setStatus(Account.AccountStatus.CLOSED);
        accountRepository.save(account);
        return mapToResponse(account);
    }

    @Override
    @Transactional
    public void deleteAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new BankingException("Account not found"));

        // Clear dependent rows first to avoid foreign key constraint failures
        transactionRepository.deleteByAccountId(accountId);
        loanRepository.deleteByAccountId(accountId);

        accountRepository.delete(account);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = "AC" + (1000000000L + (long) (RANDOM.nextDouble() * 9000000000L));
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .createdAt(account.getCreatedAt())
                .ownerName(account.getUser().getFullName())
                .ownerEmail(account.getUser().getEmail())
                .build();
    }
}