package com.banking.api.service.impl;

import com.banking.api.dto.request.AddBeneficiaryRequest;
import com.banking.api.dto.response.BeneficiaryResponse;
import com.banking.api.entity.Beneficiary;
import com.banking.api.entity.User;
import com.banking.api.exception.BankingException;
import com.banking.api.repository.BeneficiaryRepository;
import com.banking.api.repository.UserRepository;
import com.banking.api.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BeneficiaryServiceImpl implements BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BeneficiaryResponse addBeneficiary(String userEmail, AddBeneficiaryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        if (beneficiaryRepository.existsByUserIdAndBeneficiaryAccountNumber(
                user.getId(), request.getBeneficiaryAccountNumber())) {
            throw new BankingException("This beneficiary is already added");
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .beneficiaryName(request.getBeneficiaryName())
                .beneficiaryAccountNumber(request.getBeneficiaryAccountNumber())
                .bankName(request.getBankName())
                .nickname(request.getNickname())
                .user(user)
                .build();

        beneficiaryRepository.save(beneficiary);
        return mapToResponse(beneficiary);
    }

    @Override
    public List<BeneficiaryResponse> getMyBeneficiaries(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        return beneficiaryRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteBeneficiary(String userEmail, Long beneficiaryId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BankingException("User not found"));

        Beneficiary beneficiary = beneficiaryRepository.findByIdAndUserId(beneficiaryId, user.getId())
                .orElseThrow(() -> new BankingException("Beneficiary not found"));

        beneficiaryRepository.delete(beneficiary);
    }

    private BeneficiaryResponse mapToResponse(Beneficiary beneficiary) {
        return BeneficiaryResponse.builder()
                .id(beneficiary.getId())
                .beneficiaryName(beneficiary.getBeneficiaryName())
                .beneficiaryAccountNumber(beneficiary.getBeneficiaryAccountNumber())
                .bankName(beneficiary.getBankName())
                .nickname(beneficiary.getNickname())
                .createdAt(beneficiary.getCreatedAt())
                .build();
    }
}