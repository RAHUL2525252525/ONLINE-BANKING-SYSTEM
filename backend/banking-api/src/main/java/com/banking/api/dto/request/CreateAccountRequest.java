package com.banking.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import com.banking.api.entity.Account.AccountType;

import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateAccountRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @Pattern(regexp = "\\d{12}", message = "Aadhar number must be 12 digits")
    private String aadharNumber;

    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN format (e.g. ABCDE1234F)")
    private String panNumber;

    private LocalDate dateOfBirth;

    private String nomineeName;

    private String nomineeRelation;
}