package com.huseyn.mebelsayti.controller;

import com.huseyn.mebelsayti.dto.CompanyServiceRequestDTO;
import com.huseyn.mebelsayti.dto.CompanyServiceResponseDTO;
import com.huseyn.mebelsayti.service.CompanyServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
public class CompanyServiceController {
    private final CompanyServiceService companyServiceService;
    @PostMapping
    public CompanyServiceResponseDTO saveService(@Valid @RequestBody CompanyServiceRequestDTO dto){
        return companyServiceService.saveService(dto);
    }
    @GetMapping
    public List<CompanyServiceResponseDTO> getAllServices(){
        return companyServiceService.getAllServices();
    }
    @GetMapping("/{id}")
    public CompanyServiceResponseDTO findById(@PathVariable Long id){
        return companyServiceService.findById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id){
        companyServiceService.deleteById(id);
    }
    @PutMapping("/{id}")
    public CompanyServiceResponseDTO updateService(@PathVariable Long id, @Valid @RequestBody CompanyServiceRequestDTO dto){
        return companyServiceService.updateService(id, dto);
    }
}
