package com.huseyn.mebelsayti.controller;

import com.huseyn.mebelsayti.dto.AdminRequestDTO;
import com.huseyn.mebelsayti.dto.AdminResponseDTO;
import com.huseyn.mebelsayti.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final AdminService adminService;
    @PostMapping
    public AdminResponseDTO saveAdmin(@Valid @RequestBody AdminRequestDTO dto){
        return adminService.saveAdmin(dto);
    }
}
