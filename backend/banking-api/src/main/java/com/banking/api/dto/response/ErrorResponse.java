package com.banking.api.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private String message;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}