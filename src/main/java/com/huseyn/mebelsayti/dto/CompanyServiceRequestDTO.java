package com.huseyn.mebelsayti.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CompanyServiceRequestDTO {
    @NotBlank(message = "The name cannot be empty.")
    @Size(min = 2, max = 20, message = "Name can be between 2 and 20")
    private String name;
    @NotBlank(message = "The description cannot be empty.")
    @Size(min = 10, max = 150, message = "Description can be between 10 and 150")
    private String description;
    @NotNull(message = "The price cannot be empty.")
    @DecimalMin(value = "0.01", message = "The price must be greater than 0.")
    private BigDecimal price;
}
