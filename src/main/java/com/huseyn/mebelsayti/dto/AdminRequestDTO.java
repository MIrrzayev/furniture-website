package com.huseyn.mebelsayti.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AdminRequestDTO {
    @NotBlank(message = "The username cannot be empty.")
    @Size(min = 2, max = 20, message = "Username can be between 2 and 20 characters.")
    private String username;
    @NotBlank(message = "The password cannot be empty.")
    @Size(min = 8, max = 100, message = "Password can be between 8 and 100 characters.")
    private String password;
}
