package com.banking.api.controller;

import com.banking.api.dto.response.AccountResponse;
import com.banking.api.dto.response.AdminUserDetailResponse;
import com.banking.api.dto.response.AdminUserResponse;
import com.banking.api.dto.response.BeneficiaryResponse;
import com.banking.api.dto.response.LoanResponse;
import com.banking.api.dto.response.TransactionResponse;
import com.banking.api.entity.Role;
import com.banking.api.entity.User;
import com.banking.api.exception.BankingException;
import com.banking.api.repository.UserRepository;
import com.banking.api.service.AccountService;
import com.banking.api.service.AdminUserService;
import com.banking.api.service.BeneficiaryService;
import com.banking.api.service.LoanService;
import com.banking.api.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final AccountService accountService;
    private final LoanService loanService;
    private final BeneficiaryService beneficiaryService;
    private final TransactionService transactionService;
    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        List<AdminUserResponse> users = userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<AdminUserDetailResponse> getUserDetails(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BankingException("User not found"));

        List<AccountResponse> accounts = accountService.getMyAccounts(user.getEmail());
        List<LoanResponse> loans = loanService.getMyLoans(user.getEmail());
        List<BeneficiaryResponse> beneficiaries = beneficiaryService.getMyBeneficiaries(user.getEmail());

        List<TransactionResponse> transactions = accounts.stream()
                .flatMap(acc -> transactionService.getHistory(user.getEmail(), acc.getAccountNumber()).stream())
                .collect(Collectors.toList());

        AdminUserDetailResponse response = AdminUserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .aadharNumber(user.getAadharNumber())
                .panNumber(user.getPanNumber())
                .dateOfBirth(user.getDateOfBirth())
                .nomineeName(user.getNomineeName())
                .nomineeRelation(user.getNomineeRelation())
                .enabled(user.isEnabled())
                .accountNonLocked(user.isAccountNonLocked())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .accounts(accounts)
                .loans(loans)
                .beneficiaries(beneficiaries)
                .transactions(transactions)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<AccountResponse> accounts = accountService.getMyAccounts(user.getEmail());
        if (!accounts.isEmpty()) {
            return ResponseEntity.status(409)
                    .body(java.util.Map.of("message", "Cannot delete user with active accounts. Close or transfer accounts first."));
        }

        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<AdminUserResponse> lockUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountNonLocked(false);
        userRepository.save(user);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @PutMapping("/{id}/unlock")
    public ResponseEntity<AdminUserResponse> unlockUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountNonLocked(true);
        userRepository.save(user);
        return ResponseEntity.ok(mapToResponse(user));
    }

    private AdminUserResponse mapToResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .enabled(user.isEnabled())
                .accountNonLocked(user.isAccountNonLocked())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}