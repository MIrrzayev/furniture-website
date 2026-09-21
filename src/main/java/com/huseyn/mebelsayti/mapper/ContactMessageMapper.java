package com.huseyn.mebelsayti.mapper;

import com.huseyn.mebelsayti.dto.ContactMessageRequestDTO;
import com.huseyn.mebelsayti.dto.ContactMessageResponseDTO;
import com.huseyn.mebelsayti.entity.ContactMessage;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageMapper {
    public ContactMessage toEntity(ContactMessageRequestDTO dto){
        ContactMessage message = new ContactMessage();
        message.setEmail(dto.getEmail());
        message.setMessage(dto.getMessage());
        message.setName(dto.getName());
        return message;
    }
    public ContactMessageResponseDTO toResponseDTO(ContactMessage message){
        return new ContactMessageResponseDTO(message.getId(), message.getName(), message.getEmail(), message.getMessage(), message.getCreatedAt());
    }
}
