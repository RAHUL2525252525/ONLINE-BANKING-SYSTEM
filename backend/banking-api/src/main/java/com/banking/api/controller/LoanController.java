package com.banking.api.controller;

import com.banking.api.dto.request.ApplyLoanRequest;
import com.banking.api.dto.response.LoanResponse;
import com.banking.api.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanResponse> applyLoan(
            @Valid @RequestBody ApplyLoanRequest request,
            Authentication authentication) {
        LoanResponse response = loanService.applyLoan(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<LoanResponse>> getMyLoans(Authentication authentication) {
        return ResponseEntity.ok(loanService.getMyLoans(authentication.getName()));
    }
}