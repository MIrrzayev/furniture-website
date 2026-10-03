package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.dto.AdminRequestDTO;
import com.huseyn.mebelsayti.dto.AdminResponseDTO;
import com.huseyn.mebelsayti.entity.Admin;
import com.huseyn.mebelsayti.exception.ResourceNotFindException;
import com.huseyn.mebelsayti.exception.UsernameAlreadyExistsException;
import com.huseyn.mebelsayti.mapper.AdminMapper;
import com.huseyn.mebelsayti.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public List<AdminResponseDTO> getAllAdmins(){
        return adminRepository.findAll().stream().map(adminMapper::toResponseDTO).toList();
    }
    public AdminResponseDTO getAdminById(Long id){
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Admin not found"));
        return adminMapper.toResponseDTO(admin);
    }
    public AdminResponseDTO updateAdmin(Long id, AdminRequestDTO dto){
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Admin not found"));
        if(!admin.getUsername().equals(dto.getUsername()) && adminRepository.findByUsername(dto.getUsername()).isPresent()){
            throw new UsernameAlreadyExistsException("Username already exists");
        }
        admin.setUsername(dto.getUsername());
        if(dto.getPassword() != null && !dto.getPassword().isBlank()){
            admin.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        Admin updatedAdmin = adminRepository.save(admin);
        return adminMapper.toResponseDTO(updatedAdmin);
    }
    public void deleteAdmin(Long id){
        Admin admin = adminRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("Admin not found"));
        adminRepository.delete(admin);
    }
}
