package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.dto.CompanyServiceRequestDTO;
import com.huseyn.mebelsayti.dto.CompanyServiceResponseDTO;
import com.huseyn.mebelsayti.entity.CompanyService;
import com.huseyn.mebelsayti.exception.ResourceNotFindException;
import com.huseyn.mebelsayti.mapper.CompanyServiceMapper;
import com.huseyn.mebelsayti.repository.CompanyServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyServiceService {
    private final CompanyServiceRepository companyServiceRepository;
    private final CompanyServiceMapper companyServiceMapper;
    public CompanyServiceResponseDTO saveService(CompanyServiceRequestDTO dto){
        CompanyService service = companyServiceMapper.toEntity(dto);
        CompanyService savedService = companyServiceRepository.save(service);
        return companyServiceMapper.toResponseDTO(savedService);
    }
    public List<CompanyServiceResponseDTO> getAllServices(){
        return companyServiceRepository.findAll().stream().map(companyServiceMapper::toResponseDTO).toList();
    }
    public CompanyServiceResponseDTO findById(Long id){
        CompanyService service = companyServiceRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        return companyServiceMapper.toResponseDTO(service);
    }
    public void deleteById(Long id){
        CompanyService service = companyServiceRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        companyServiceRepository.delete(service);
    }
    public CompanyServiceResponseDTO updateService(Long id, CompanyServiceRequestDTO dto){
        CompanyService service = companyServiceRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        service.setPrice(dto.getPrice());
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        CompanyService savedService = companyServiceRepository.save(service);
        return companyServiceMapper.toResponseDTO(savedService);
    }
}
