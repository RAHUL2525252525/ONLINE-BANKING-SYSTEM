package com.banking.api.service.impl;

import com.banking.api.dto.request.DepositRequest;
import com.banking.api.dto.request.TransferRequest;
import com.banking.api.dto.request.WithdrawRequest;
import com.banking.api.dto.response.TransactionResponse;
import com.banking.api.entity.Account;
import com.banking.api.entity.Transaction;
import com.banking.api.entity.Transaction.TransactionType;
import com.banking.api.exception.BankingException;
import com.banking.api.repository.AccountRepository;
import com.banking.api.repository.TransactionRepository;
import com.banking.api.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionResponse deposit(String userEmail, DepositRequest request) {
        Account account = getOwnedAccount(request.getAccountNumber(), userEmail);
        validateAccountActive(account);

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction txn = Transaction.builder()
                .transactionRef(generateUniqueRef())
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Deposit")
                .account(account)
                .build();

        transactionRepository.save(txn);
        return mapToResponse(txn);
    }

    @Override
    @Transactional
    public TransactionResponse withdraw(String userEmail, WithdrawRequest request) {
        Account account = getOwnedAccount(request.getAccountNumber(), userEmail);
        validateAccountActive(account);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BankingException("Insufficient balance");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        Transaction txn = Transaction.builder()
                .transactionRef(generateUniqueRef())
                .type(TransactionType.WITHDRAW)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Withdrawal")
                .account(account)
                .build();

        transactionRepository.save(txn);
        return mapToResponse(txn);
    }

    @Override
    @Transactional
    public List<TransactionResponse> transfer(String userEmail, TransferRequest request) {
        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new BankingException("Cannot transfer to the same account");
        }

        Account fromAccount = getOwnedAccount(request.getFromAccountNumber(), userEmail);
        validateAccountActive(fromAccount);

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new BankingException("Destination account not found"));
        validateAccountActive(toAccount);

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new BankingException("Insufficient balance");
        }

        // Debit sender
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(fromAccount);

        // Credit receiver
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));
        accountRepository.save(toAccount);

        // NOTE: each leg of a transfer gets its OWN unique ref now, instead of
        // sharing a single ref between the debit and credit rows. Sharing one
        // ref guaranteed a unique-constraint violation on the second insert,
        // every single time. The two legs are still linked via relatedAccountNumber.
        Transaction debitTxn = Transaction.builder()
                .transactionRef(generateUniqueRef())
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Transfer sent")
                .account(fromAccount)
                .relatedAccountNumber(toAccount.getAccountNumber())
                .build();

        Transaction creditTxn = Transaction.builder()
                .transactionRef(generateUniqueRef())
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .description(request.getDescription() != null ? request.getDescription() : "Transfer received")
                .account(toAccount)
                .relatedAccountNumber(fromAccount.getAccountNumber())
                .build();

        transactionRepository.save(debitTxn);
        transactionRepository.save(creditTxn);

        return List.of(mapToResponse(debitTxn), mapToResponse(creditTxn));
    }

    @Override
    public List<TransactionResponse> getHistory(String userEmail, String accountNumber) {
        Account account = getOwnedAccount(accountNumber, userEmail);

        return transactionRepository.findByAccountIdOrderByCreatedAtDesc(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ---- Helper methods ----

    private Account getOwnedAccount(String accountNumber, String userEmail) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new BankingException("Account not found"));

        if (!account.getUser().getEmail().equals(userEmail)) {
            throw new BankingException("You are not authorized to access this account");
        }
        return account;
    }

    private void validateAccountActive(Account account) {
        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new BankingException("Account is not active (status: " + account.getStatus() + ")");
        }
    }

    /**
     * Generates a transaction reference and guarantees it doesn't already exist
     * in the database, mirroring the retry pattern used by
     * AccountServiceImpl.generateUniqueAccountNumber().
     */
    private String generateUniqueRef() {
        String ref;
        do {
            ref = "TXN" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        } while (transactionRepository.existsByTransactionRef(ref));
        return ref;
    }

    private TransactionResponse mapToResponse(Transaction txn) {
        return TransactionResponse.builder()
                .id(txn.getId())
                .transactionRef(txn.getTransactionRef())
                .type(txn.getType().name())
                .amount(txn.getAmount())
                .balanceAfter(txn.getBalanceAfter())
                .description(txn.getDescription())
                .accountNumber(txn.getAccount().getAccountNumber())
                .relatedAccountNumber(txn.getRelatedAccountNumber())
                .status(txn.getStatus().name())
                .createdAt(txn.getCreatedAt())
                .build();
    }
}