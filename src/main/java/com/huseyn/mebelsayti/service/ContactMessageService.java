package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.dto.ContactMessageRequestDTO;
import com.huseyn.mebelsayti.dto.ContactMessageResponseDTO;
import com.huseyn.mebelsayti.entity.ContactMessage;
import com.huseyn.mebelsayti.exception.ResourceNotFindException;
import com.huseyn.mebelsayti.mapper.ContactMessageMapper;
import com.huseyn.mebelsayti.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {
    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageMapper contactMessageMapper;
    public ContactMessageResponseDTO saveMessage(ContactMessageRequestDTO dto){
        ContactMessage message = contactMessageMapper.toEntity(dto);
        message.setCreatedAt(LocalDateTime.now());
        ContactMessage savedMessage = contactMessageRepository.save(message);
        return contactMessageMapper.toResponseDTO(savedMessage);
    }
    public List<ContactMessageResponseDTO> getAllMessages(){
        return contactMessageRepository.findAll().stream().map(contactMessageMapper::toResponseDTO).toList();
    }
    public ContactMessageResponseDTO findById(Long id){
        ContactMessage message = contactMessageRepository.findById(id).orElseThrow(() ->  new ResourceNotFindException("This ID does not exist."));
        return contactMessageMapper.toResponseDTO(message);
    }
    public void deleteById(Long id){
        ContactMessage message = contactMessageRepository.findById(id).orElseThrow(() ->  new ResourceNotFindException("This ID does not exist."));
        contactMessageRepository.delete(message);
    }
}
