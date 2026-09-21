package com.huseyn.mebelsayti.controller;

import com.huseyn.mebelsayti.dto.ContactMessageRequestDTO;
import com.huseyn.mebelsayti.dto.ContactMessageResponseDTO;
import com.huseyn.mebelsayti.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
@RequiredArgsConstructor
public class ContactMessageController {
    private final ContactMessageService contactMessageService;
    @PostMapping
    public ContactMessageResponseDTO saveMessage(@Valid @RequestBody ContactMessageRequestDTO dto){
        return contactMessageService.saveMessage(dto);
    }
    @GetMapping
    public List<ContactMessageResponseDTO> getAllMessages(){
        return contactMessageService.getAllMessages();
    }
    @GetMapping("/{id}")
    public ContactMessageResponseDTO findById(@PathVariable Long id){
        return contactMessageService.findById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id){
        contactMessageService.deleteById(id);
    }
}
