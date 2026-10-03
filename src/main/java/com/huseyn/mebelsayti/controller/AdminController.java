package com.huseyn.mebelsayti.controller;

import com.huseyn.mebelsayti.dto.AdminRequestDTO;
import com.huseyn.mebelsayti.dto.AdminResponseDTO;
import com.huseyn.mebelsayti.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    @PostMapping
    public AdminResponseDTO saveAdmin(@Valid @RequestBody AdminRequestDTO dto){
        return adminService.saveAdmin(dto);
    }
    @GetMapping
    public List<AdminResponseDTO> getAllAdmins(){
        return adminService.getAllAdmins();
    }
    @GetMapping("/{id}")
    public AdminResponseDTO getAdminById(@PathVariable Long id){
        return adminService.getAdminById(id);
    }
    @PutMapping("/{id}")
    public AdminResponseDTO updateAdmin(@PathVariable Long id, @Valid @RequestBody AdminRequestDTO dto){
        return adminService.updateAdmin(id, dto);
    }
    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id){
        adminService.deleteAdmin(id);
    }
}
