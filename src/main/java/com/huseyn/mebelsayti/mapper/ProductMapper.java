package com.huseyn.mebelsayti.mapper;

import com.huseyn.mebelsayti.dto.ProductRequestDTO;
import com.huseyn.mebelsayti.dto.ProductResponseDTO;
import com.huseyn.mebelsayti.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public Product toEntity(ProductRequestDTO dto){
        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setType(dto.getType());
        return product;
    }
    public ProductResponseDTO toResponseDTO(Product product){
        return new ProductResponseDTO(product.getId(), product.getName(), product.getType(), product.getPrice());
    }
}
