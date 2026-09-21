package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.entity.Admin;
import com.huseyn.mebelsayti.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final AdminRepository adminRepository;
    @Override
    public UserDetails loadUserByUsername(String username){
        Admin admin = adminRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Admin not found"));
        return org.springframework.security.core.userdetails.User.withUsername(admin.getUsername()).password(admin.getPassword()).roles(admin.getRole()).build();
    }
}
