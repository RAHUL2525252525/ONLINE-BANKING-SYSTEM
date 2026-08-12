package com.banking.api.service;

import com.banking.api.dto.request.CreateAccountRequest;
import com.banking.api.dto.response.AccountResponse;
import java.util.List;

public interface AccountService {
    AccountResponse createAccount(String userEmail, CreateAccountRequest request);
    List<AccountResponse> getMyAccounts(String userEmail);
    AccountResponse getAccountByNumber(String accountNumber, String userEmail);

    // Admin operations
    List<AccountResponse> getAllAccounts();
    AccountResponse freezeAccount(Long accountId);
    AccountResponse activateAccount(Long accountId);
    AccountResponse closeAccount(Long accountId);
    void deleteAccount(Long accountId);
}