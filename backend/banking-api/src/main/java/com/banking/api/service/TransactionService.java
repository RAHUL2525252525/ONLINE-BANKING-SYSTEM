package com.banking.api.service;

import com.banking.api.dto.request.DepositRequest;
import com.banking.api.dto.request.TransferRequest;
import com.banking.api.dto.request.WithdrawRequest;
import com.banking.api.dto.response.TransactionResponse;
import java.util.List;

public interface TransactionService {
    TransactionResponse deposit(String userEmail, DepositRequest request);
    TransactionResponse withdraw(String userEmail, WithdrawRequest request);
    List<TransactionResponse> transfer(String userEmail, TransferRequest request);
    List<TransactionResponse> getHistory(String userEmail, String accountNumber);
}