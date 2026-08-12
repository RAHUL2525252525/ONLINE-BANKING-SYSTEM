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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private LoanRepository loanRepository;

    @InjectMocks
    private AccountServiceImpl accountService;


    // =========================================================
    // TEST 1: Freeze Account
    // =========================================================

    @Test
    void shouldFreezeAccount() {

        User user = new User();
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setAccountNumber("AC1234567890");
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(user);

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(account));

        when(accountRepository.save(account))
                .thenReturn(account);

        accountService.freezeAccount(1L);

        assertEquals(
                Account.AccountStatus.FROZEN,
                account.getStatus()
        );

        verify(accountRepository).findById(1L);
        verify(accountRepository).save(account);
    }


    // =========================================================
    // TEST 2: Activate Account
    // =========================================================

    @Test
    void shouldActivateAccount() {

        User user = new User();
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setAccountNumber("AC1234567890");
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(Account.AccountStatus.FROZEN);
        account.setUser(user);

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(account));

        when(accountRepository.save(account))
                .thenReturn(account);

        accountService.activateAccount(1L);

        assertEquals(
                Account.AccountStatus.ACTIVE,
                account.getStatus()
        );

        verify(accountRepository).findById(1L);
        verify(accountRepository).save(account);
    }


    // =========================================================
    // TEST 3: Close Account
    // =========================================================

    @Test
    void shouldCloseAccount() {

        User user = new User();
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setAccountNumber("AC1234567890");
        account.setBalance(BigDecimal.ZERO);
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(user);

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(account));

        when(accountRepository.save(account))
                .thenReturn(account);

        accountService.closeAccount(1L);

        assertEquals(
                Account.AccountStatus.CLOSED,
                account.getStatus()
        );

        verify(accountRepository).findById(1L);
        verify(accountRepository).save(account);
    }


    // =========================================================
    // TEST 4: Delete Account
    // =========================================================

    @Test
    void shouldDeleteAccount() {

        Account account = new Account();
        account.setId(1L);

        when(accountRepository.findById(1L))
                .thenReturn(Optional.of(account));

        accountService.deleteAccount(1L);

        verify(transactionRepository)
                .deleteByAccountId(1L);

        verify(loanRepository)
                .deleteByAccountId(1L);

        verify(accountRepository)
                .delete(account);
    }


    // =========================================================
    // TEST 5: Create Account
    // =========================================================

    @Test
    void shouldCreateAccount() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        CreateAccountRequest request = new CreateAccountRequest();

        request.setAccountType(Account.AccountType.SAVINGS);
        request.setAadharNumber("123456789012");
        request.setPanNumber("ABCDE1234F");
        request.setDateOfBirth(LocalDate.of(2004, 7, 25));
        request.setNomineeName("Rahul Nominee");
        request.setNomineeRelation("Brother");

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByUserId(1L))
                .thenReturn(List.of());

        when(accountRepository.existsByAccountNumber(anyString()))
                .thenReturn(false);

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation -> {

                    Account account = invocation.getArgument(0);
                    account.setId(1L);

                    return account;
                });

        AccountResponse response = accountService.createAccount(
                "rahul@example.com",
                request
        );

        assertEquals(
                "SAVINGS",
                response.getAccountType()
        );

        assertEquals(
                BigDecimal.ZERO,
                response.getBalance()
        );

        assertEquals(
                "ACTIVE",
                response.getStatus()
        );

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(userRepository)
                .save(user);

        verify(accountRepository)
                .findByUserId(1L);

        verify(accountRepository)
                .save(any(Account.class));
    }


    // =========================================================
    // TEST 6: Duplicate Account Type
    // =========================================================

    @Test
    void shouldRejectDuplicateAccountType() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account existingAccount = new Account();

        existingAccount.setId(10L);
        existingAccount.setAccountType(Account.AccountType.SAVINGS);
        existingAccount.setAccountNumber("AC1111111111");
        existingAccount.setBalance(BigDecimal.ZERO);
        existingAccount.setStatus(Account.AccountStatus.ACTIVE);
        existingAccount.setUser(user);

        CreateAccountRequest request = new CreateAccountRequest();

        request.setAccountType(Account.AccountType.SAVINGS);
        request.setAadharNumber("123456789012");
        request.setPanNumber("ABCDE1234F");
        request.setDateOfBirth(LocalDate.of(2004, 7, 25));

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByUserId(1L))
                .thenReturn(List.of(existingAccount));

        BankingException exception = assertThrows(
                BankingException.class,
                () -> accountService.createAccount(
                        "rahul@example.com",
                        request
                )
        );

        assertEquals(
                "You already have a SAVINGS account. Only one account per type is allowed.",
                exception.getMessage()
        );

        verify(accountRepository)
                .findByUserId(1L);

        verify(accountRepository, never())
                .save(any(Account.class));
    }


    // =========================================================
    // TEST 7: Get My Accounts
    // =========================================================

    @Test
    void shouldGetMyAccounts() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account1 = new Account();
        account1.setId(1L);
        account1.setAccountNumber("AC1234567890");
        account1.setAccountType(Account.AccountType.SAVINGS);
        account1.setBalance(new BigDecimal("5000"));
        account1.setStatus(Account.AccountStatus.ACTIVE);
        account1.setUser(user);

        Account account2 = new Account();
        account2.setId(2L);
        account2.setAccountNumber("AC9876543210");
        account2.setAccountType(Account.AccountType.CURRENT);
        account2.setBalance(new BigDecimal("10000"));
        account2.setStatus(Account.AccountStatus.ACTIVE);
        account2.setUser(user);

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByUserId(1L))
                .thenReturn(List.of(account1, account2));

        List<AccountResponse> responses =
                accountService.getMyAccounts("rahul@example.com");

        assertEquals(2, responses.size());

        assertEquals(
                "AC1234567890",
                responses.get(0).getAccountNumber()
        );

        assertEquals(
                "SAVINGS",
                responses.get(0).getAccountType()
        );

        assertEquals(
                new BigDecimal("5000"),
                responses.get(0).getBalance()
        );

        assertEquals(
                "AC9876543210",
                responses.get(1).getAccountNumber()
        );

        assertEquals(
                "CURRENT",
                responses.get(1).getAccountType()
        );

        assertEquals(
                new BigDecimal("10000"),
                responses.get(1).getBalance()
        );

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(accountRepository)
                .findByUserId(1L);
    }


    // =========================================================
    // TEST 8: Get Account By Number - Owner
    // =========================================================

    @Test
    void shouldGetAccountByNumber() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account = new Account();

        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setBalance(new BigDecimal("5000"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(user);

        when(accountRepository.findByAccountNumber("AC1234567890"))
                .thenReturn(Optional.of(account));

        AccountResponse response =
                accountService.getAccountByNumber(
                        "AC1234567890",
                        "rahul@example.com"
                );

        assertEquals(
                "AC1234567890",
                response.getAccountNumber()
        );

        assertEquals(
                "SAVINGS",
                response.getAccountType()
        );

        assertEquals(
                new BigDecimal("5000"),
                response.getBalance()
        );

        assertEquals(
                "ACTIVE",
                response.getStatus()
        );

        assertEquals(
                "Rahul S",
                response.getOwnerName()
        );

        assertEquals(
                "rahul@example.com",
                response.getOwnerEmail()
        );

        verify(accountRepository)
                .findByAccountNumber("AC1234567890");
    }


    // =========================================================
    // TEST 9: Unauthorized Account Access
    // =========================================================

    @Test
    void shouldRejectUnauthorizedAccountAccess() {

        User owner = new User();
        owner.setId(1L);
        owner.setFullName("Rahul S");
        owner.setEmail("rahul@example.com");

        Account account = new Account();

        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setBalance(new BigDecimal("5000"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(owner);

        when(accountRepository.findByAccountNumber("AC1234567890"))
                .thenReturn(Optional.of(account));

        BankingException exception = assertThrows(
                BankingException.class,
                () -> accountService.getAccountByNumber(
                        "AC1234567890",
                        "another@example.com"
                )
        );

        assertEquals(
                "You are not authorized to view this account",
                exception.getMessage()
        );

        verify(accountRepository)
                .findByAccountNumber("AC1234567890");
    }
}