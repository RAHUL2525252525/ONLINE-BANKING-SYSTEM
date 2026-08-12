package com.banking.api.service;

import com.banking.api.dto.request.LoginRequest;
import com.banking.api.dto.request.RegisterRequest;
import com.banking.api.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}