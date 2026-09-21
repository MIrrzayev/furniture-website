package com.huseyn.mebelsayti.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class ProductRequestDTO {
    @NotBlank(message = "The name cannot be empty.")
    @Size(min = 2, max = 20, message = "Name can be between 2 and 20")
    private String name;
    @NotBlank(message = "The type cannot be empty.")
    @Size(min = 2, max = 15, message = "Type can be between 2 and 15")
    private String type;
    @NotNull(message = "The price cannot be empty.")
    @DecimalMin(value = "0.01", message = "The price must be greater than 0.")
    private BigDecimal price;
}
