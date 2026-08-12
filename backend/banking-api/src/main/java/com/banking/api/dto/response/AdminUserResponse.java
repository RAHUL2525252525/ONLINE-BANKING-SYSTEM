package com.banking.api.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean enabled;
    private boolean accountNonLocked;
    private Set<String> roles;
    private LocalDateTime createdAt;
}