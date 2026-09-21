package com.huseyn.mebelsayti.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessageResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String message;
    private LocalDateTime createdAt;
}
