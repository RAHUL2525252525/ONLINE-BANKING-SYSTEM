package com.banking.api.service;

import com.banking.api.dto.request.ApplyLoanRequest;
import com.banking.api.dto.request.LoanDecisionRequest;
import com.banking.api.dto.response.LoanResponse;
import java.util.List;

public interface LoanService {
    LoanResponse applyLoan(String userEmail, ApplyLoanRequest request);
    List<LoanResponse> getMyLoans(String userEmail);
    List<LoanResponse> getAllLoans(); // admin
    LoanResponse approveLoan(Long loanId); // admin
    LoanResponse rejectLoan(Long loanId, LoanDecisionRequest request); // admin
}