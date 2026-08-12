package com.banking.api.dto.request;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class LoanDecisionRequest {
    private String rejectionReason; // only needed when rejecting
}