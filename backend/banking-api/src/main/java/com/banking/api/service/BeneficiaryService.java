package com.banking.api.service;

import com.banking.api.dto.request.AddBeneficiaryRequest;
import com.banking.api.dto.response.BeneficiaryResponse;
import java.util.List;

public interface BeneficiaryService {
    BeneficiaryResponse addBeneficiary(String userEmail, AddBeneficiaryRequest request);
    List<BeneficiaryResponse> getMyBeneficiaries(String userEmail);
    void deleteBeneficiary(String userEmail, Long beneficiaryId);
}