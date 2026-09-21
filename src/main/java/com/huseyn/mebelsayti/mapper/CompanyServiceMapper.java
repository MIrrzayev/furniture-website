package com.huseyn.mebelsayti.mapper;

import com.huseyn.mebelsayti.dto.CompanyServiceRequestDTO;
import com.huseyn.mebelsayti.dto.CompanyServiceResponseDTO;
import com.huseyn.mebelsayti.entity.CompanyService;
import org.springframework.stereotype.Component;

@Component
public class CompanyServiceMapper {
    public CompanyService toEntity(CompanyServiceRequestDTO dto){
        CompanyService companyService = new CompanyService();
        companyService.setDescription(dto.getDescription());
        companyService.setName(dto.getName());
        companyService.setPrice(dto.getPrice());
        return companyService;
    }
    public CompanyServiceResponseDTO toResponseDTO(CompanyService companyService){
        return new CompanyServiceResponseDTO(companyService.getId(), companyService.getName(), companyService.getDescription(), companyService.getPrice());
    }
}
