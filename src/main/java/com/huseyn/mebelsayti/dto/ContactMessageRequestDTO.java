package com.huseyn.mebelsayti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ContactMessageRequestDTO {
    @NotBlank(message = "The name cannot be empty.")
    @Size(min = 2, max = 20, message = "Name can be between 2 and 20")
    private String name;
    @NotBlank(message = "The email cannot be empty.")
    @Email(message = "Invalid email")
    private String email;
    @NotBlank(message = "The message cannot be empty.")
    @Size(min = 5, max = 300, message = "Message can be between 5 and 300")
    private String message;
}
