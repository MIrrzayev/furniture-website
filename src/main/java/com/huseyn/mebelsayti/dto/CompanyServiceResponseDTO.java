package com.huseyn.mebelsayti.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompanyServiceResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
}
