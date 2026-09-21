package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.dto.AdminRequestDTO;
import com.huseyn.mebelsayti.dto.AdminResponseDTO;
import com.huseyn.mebelsayti.entity.Admin;
import com.huseyn.mebelsayti.exception.UsernameAlreadyExistsException;
import com.huseyn.mebelsayti.mapper.AdminMapper;
import com.huseyn.mebelsayti.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminMapper adminMapper;
    public AdminResponseDTO saveAdmin(AdminRequestDTO dto){

        if (adminRepository.findByUsername(dto.getUsername()).isPresent()){
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        Admin admin = adminMapper.toEntity(dto);
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ADMIN");
        Admin savedAdmin = adminRepository.save(admin);
        return adminMapper.toResponseDTO(savedAdmin);
    }
}
