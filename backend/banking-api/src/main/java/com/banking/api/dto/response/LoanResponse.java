package com.banking.api.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoanResponse {
    private Long id;
    private String loanType;
    private BigDecimal amount;
    private Integer tenureMonths;
    private BigDecimal interestRate;
    private String purpose;
    private String status;
    private String rejectionReason;
    private String accountNumber;
    private String applicantEmail;
    private LocalDateTime appliedAt;
    private LocalDateTime decidedAt;
}