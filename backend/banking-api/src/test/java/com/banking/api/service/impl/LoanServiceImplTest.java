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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoanServiceImplTest {

    @Mock
    private LoanRepository loanRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @InjectMocks
    private LoanServiceImpl loanService;


    // =========================================================
    // TEST 1: Apply Loan Successfully
    // =========================================================

    @Test
    void shouldApplyLoanSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(user);

        ApplyLoanRequest request = new ApplyLoanRequest();
        request.setLoanType(Loan.LoanType.PERSONAL);
        request.setAmount(new BigDecimal("50000"));
        request.setTenureMonths(12);
        request.setPurpose("Education");
        request.setAccountNumber("AC1234567890");

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByAccountNumber("AC1234567890"))
                .thenReturn(Optional.of(account));

        when(loanRepository.save(any(Loan.class)))
                .thenAnswer(invocation -> {
                    Loan loan = invocation.getArgument(0);
                    loan.setId(1L);
                    return loan;
                });

        LoanResponse response =
                loanService.applyLoan("rahul@example.com", request);

        assertEquals(1L, response.getId());
        assertEquals("50000", response.getAmount().toString());
        assertEquals(12, response.getTenureMonths());
        assertEquals("Education", response.getPurpose());
        assertEquals("PENDING", response.getStatus());
        assertEquals("AC1234567890", response.getAccountNumber());
        assertEquals("rahul@example.com", response.getApplicantEmail());

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(accountRepository)
                .findByAccountNumber("AC1234567890");

        verify(loanRepository)
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 2: Apply Loan - User Not Found
    // =========================================================

    @Test
    void shouldThrowExceptionWhenUserNotFound() {

        ApplyLoanRequest request = new ApplyLoanRequest();

        request.setLoanType(Loan.LoanType.PERSONAL);
        request.setAmount(new BigDecimal("50000"));
        request.setTenureMonths(12);
        request.setPurpose("Education");
        request.setAccountNumber("AC1234567890");

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                BankingException.class,
                () -> loanService.applyLoan(
                        "rahul@example.com",
                        request
                )
        );

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(accountRepository, never())
                .findByAccountNumber(anyString());

        verify(loanRepository, never())
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 3: Apply Loan - Account Not Found
    // =========================================================

    @Test
    void shouldThrowExceptionWhenAccountNotFound() {

        User user = new User();
        user.setId(1L);
        user.setFullName("Rahul S");
        user.setEmail("rahul@example.com");

        ApplyLoanRequest request = new ApplyLoanRequest();

        request.setLoanType(Loan.LoanType.PERSONAL);
        request.setAmount(new BigDecimal("50000"));
        request.setTenureMonths(12);
        request.setPurpose("Education");
        request.setAccountNumber("AC1234567890");

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByAccountNumber("AC1234567890"))
                .thenReturn(Optional.empty());

        assertThrows(
                BankingException.class,
                () -> loanService.applyLoan(
                        "rahul@example.com",
                        request
                )
        );

        verify(accountRepository)
                .findByAccountNumber("AC1234567890");

        verify(loanRepository, never())
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 4: Apply Loan - Unauthorized Account
    // =========================================================

    @Test
    void shouldThrowExceptionWhenAccountDoesNotBelongToUser() {

        User user = new User();
        user.setId(1L);
        user.setEmail("rahul@example.com");

        User anotherUser = new User();
        anotherUser.setId(2L);
        anotherUser.setEmail("other@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setStatus(Account.AccountStatus.ACTIVE);
        account.setUser(anotherUser);

        ApplyLoanRequest request = new ApplyLoanRequest();

        request.setLoanType(Loan.LoanType.PERSONAL);
        request.setAmount(new BigDecimal("50000"));
        request.setTenureMonths(12);
        request.setPurpose("Education");
        request.setAccountNumber("AC1234567890");

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(accountRepository.findByAccountNumber("AC1234567890"))
                .thenReturn(Optional.of(account));

        assertThrows(
                BankingException.class,
                () -> loanService.applyLoan(
                        "rahul@example.com",
                        request
                )
        );

        verify(loanRepository, never())
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 5: Get My Loans
    // =========================================================

    @Test
    void shouldGetMyLoans() {

        User user = new User();
        user.setId(1L);
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(loanRepository.findByUserId(1L))
                .thenReturn(List.of(loan));

        List<LoanResponse> response =
                loanService.getMyLoans("rahul@example.com");

        assertEquals(1, response.size());
        assertEquals(1L, response.get(0).getId());
        assertEquals("PENDING", response.get(0).getStatus());

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(loanRepository)
                .findByUserId(1L);
    }


    // =========================================================
    // TEST 6: Get My Loans - User Not Found
    // =========================================================

    @Test
    void shouldThrowExceptionWhenGettingLoansForUnknownUser() {

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                BankingException.class,
                () -> loanService.getMyLoans("rahul@example.com")
        );

        verify(loanRepository, never())
                .findByUserId(anyLong());
    }


    // =========================================================
    // TEST 7: Get All Loans
    // =========================================================

    @Test
    void shouldGetAllLoans() {

        User user = new User();
        user.setId(1L);
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan1 = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        Loan loan2 = Loan.builder()
                .id(2L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("100000"))
                .tenureMonths(24)
                .purpose("Home")
                .status(Loan.LoanStatus.APPROVED)
                .user(user)
                .account(account)
                .build();

        when(loanRepository.findAll())
                .thenReturn(List.of(loan1, loan2));

        List<LoanResponse> response =
                loanService.getAllLoans();

        assertEquals(2, response.size());
        assertEquals(1L, response.get(0).getId());
        assertEquals(2L, response.get(1).getId());

        verify(loanRepository)
                .findAll();
    }


    // =========================================================
    // TEST 8: Get All Loans - Empty
    // =========================================================

    @Test
    void shouldReturnEmptyListWhenNoLoansExist() {

        when(loanRepository.findAll())
                .thenReturn(List.of());

        List<LoanResponse> response =
                loanService.getAllLoans();

        assertEquals(0, response.size());

        verify(loanRepository)
                .findAll();
    }


    // =========================================================
    // TEST 9: Approve Loan Successfully
    // =========================================================

    @Test
    void shouldApproveLoanSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        when(loanRepository.findById(1L))
                .thenReturn(Optional.of(loan));

        when(accountRepository.save(account))
                .thenReturn(account);

        when(loanRepository.save(loan))
                .thenReturn(loan);

        LoanResponse response =
                loanService.approveLoan(1L);

        assertEquals(
                Loan.LoanStatus.APPROVED.name(),
                response.getStatus()
        );

        assertEquals(
                new BigDecimal("60000"),
                account.getBalance()
        );

        verify(loanRepository)
                .findById(1L);

        verify(accountRepository)
                .save(account);

        verify(loanRepository)
                .save(loan);
    }


    // =========================================================
    // TEST 10: Approve Loan - Not Found
    // =========================================================

    @Test
    void shouldThrowExceptionWhenApprovingUnknownLoan() {

        when(loanRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                BankingException.class,
                () -> loanService.approveLoan(999L)
        );

        verify(accountRepository, never())
                .save(any(Account.class));

        verify(loanRepository, never())
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 11: Approve Already Decided Loan
    // =========================================================

    @Test
    void shouldThrowExceptionWhenApprovingAlreadyDecidedLoan() {

        User user = new User();
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.APPROVED)
                .user(user)
                .account(account)
                .build();

        when(loanRepository.findById(1L))
                .thenReturn(Optional.of(loan));

        assertThrows(
                BankingException.class,
                () -> loanService.approveLoan(1L)
        );

        verify(accountRepository, never())
                .save(any(Account.class));

        verify(loanRepository, never())
                .save(any(Loan.class));
    }


    // =========================================================
    // TEST 12: Reject Loan Successfully
    // =========================================================

    @Test
    void shouldRejectLoanSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setId(1L);
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        LoanDecisionRequest request = new LoanDecisionRequest();
        request.setRejectionReason("Insufficient income");

        when(loanRepository.findById(1L))
                .thenReturn(Optional.of(loan));

        when(loanRepository.save(loan))
                .thenReturn(loan);

        LoanResponse response =
                loanService.rejectLoan(1L, request);

        assertEquals(
                Loan.LoanStatus.REJECTED.name(),
                response.getStatus()
        );

        assertEquals(
                "Insufficient income",
                response.getRejectionReason()
        );

        verify(loanRepository)
                .findById(1L);

        verify(loanRepository)
                .save(loan);
    }


    // =========================================================
    // TEST 13: Reject Loan Without Reason
    // =========================================================

    @Test
    void shouldRejectLoanWithDefaultReason() {

        User user = new User();
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.PENDING)
                .user(user)
                .account(account)
                .build();

        LoanDecisionRequest request = new LoanDecisionRequest();
        request.setRejectionReason(null);

        when(loanRepository.findById(1L))
                .thenReturn(Optional.of(loan));

        when(loanRepository.save(loan))
                .thenReturn(loan);

        LoanResponse response =
                loanService.rejectLoan(1L, request);

        assertEquals(
                Loan.LoanStatus.REJECTED.name(),
                response.getStatus()
        );

        assertEquals(
                "Not specified",
                response.getRejectionReason()
        );

        verify(loanRepository)
                .save(loan);
    }


    // =========================================================
    // TEST 14: Reject Already Decided Loan
    // =========================================================

    @Test
    void shouldThrowExceptionWhenRejectingAlreadyDecidedLoan() {

        User user = new User();
        user.setEmail("rahul@example.com");

        Account account = new Account();
        account.setAccountNumber("AC1234567890");
        account.setBalance(new BigDecimal("10000"));
        account.setUser(user);

        Loan loan = Loan.builder()
                .id(1L)
                .loanType(Loan.LoanType.PERSONAL)
                .amount(new BigDecimal("50000"))
                .tenureMonths(12)
                .purpose("Education")
                .status(Loan.LoanStatus.REJECTED)
                .user(user)
                .account(account)
                .build();

        LoanDecisionRequest request = new LoanDecisionRequest();
        request.setRejectionReason("Not eligible");

        when(loanRepository.findById(1L))
                .thenReturn(Optional.of(loan));

        assertThrows(
                BankingException.class,
                () -> loanService.rejectLoan(1L, request)
        );

        verify(loanRepository, never())
                .save(any(Loan.class));
    }
}