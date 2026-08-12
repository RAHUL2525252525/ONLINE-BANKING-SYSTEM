package com.banking.api.controller;

import com.banking.api.dto.request.AddBeneficiaryRequest;
import com.banking.api.dto.response.BeneficiaryResponse;
import com.banking.api.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<BeneficiaryResponse> addBeneficiary(
            @Valid @RequestBody AddBeneficiaryRequest request,
            Authentication authentication) {
        BeneficiaryResponse response = beneficiaryService.addBeneficiary(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponse>> getMyBeneficiaries(Authentication authentication) {
        return ResponseEntity.ok(beneficiaryService.getMyBeneficiaries(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long id,
            Authentication authentication) {
        beneficiaryService.deleteBeneficiary(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}