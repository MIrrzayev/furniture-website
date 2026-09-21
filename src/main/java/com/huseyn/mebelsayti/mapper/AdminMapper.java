package com.huseyn.mebelsayti.mapper;

import com.huseyn.mebelsayti.dto.AdminRequestDTO;
import com.huseyn.mebelsayti.dto.AdminResponseDTO;
import com.huseyn.mebelsayti.entity.Admin;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {
    public Admin toEntity(AdminRequestDTO dto){
        Admin admin = new Admin();
        admin.setUsername(dto.getUsername());
        admin.setPassword(dto.getPassword());
        return admin;
    }
    public AdminResponseDTO toResponseDTO(Admin  admin){
        return new AdminResponseDTO(admin.getId(), admin.getUsername(), admin.getRole());
    }
}
