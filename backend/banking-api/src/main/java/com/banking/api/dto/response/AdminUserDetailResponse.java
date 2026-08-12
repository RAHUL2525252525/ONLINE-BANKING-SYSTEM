package com.banking.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDetailResponse {

    // Profile
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String aadharNumber;
    private String panNumber;
    private LocalDate dateOfBirth;
    private String nomineeName;
    private String nomineeRelation;
    private boolean enabled;
    private boolean accountNonLocked;
    private Set<String> roles;
    private LocalDateTime createdAt;

    // Related data
    private List<AccountResponse> accounts;
    private List<LoanResponse> loans;
    private List<BeneficiaryResponse> beneficiaries;
    private List<TransactionResponse> transactions;
}