package com.banking.api.controller;

import com.banking.api.dto.request.LoanDecisionRequest;
import com.banking.api.dto.response.LoanResponse;
import com.banking.api.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/loans")
@RequiredArgsConstructor
public class AdminLoanController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LoanResponse> approveLoan(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.approveLoan(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LoanResponse> rejectLoan(
            @PathVariable Long id,
            @RequestBody(required = false) LoanDecisionRequest request) {
        LoanDecisionRequest decision = request != null ? request : new LoanDecisionRequest();
        return ResponseEntity.ok(loanService.rejectLoan(id, decision));
    }
}