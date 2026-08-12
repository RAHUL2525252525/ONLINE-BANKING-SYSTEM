package com.banking.api.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BeneficiaryResponse {
    private Long id;
    private String beneficiaryName;
    private String beneficiaryAccountNumber;
    private String bankName;
    private String nickname;
    private LocalDateTime createdAt;
}