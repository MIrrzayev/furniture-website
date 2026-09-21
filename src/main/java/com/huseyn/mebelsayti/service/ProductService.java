package com.huseyn.mebelsayti.service;

import com.huseyn.mebelsayti.dto.ProductRequestDTO;
import com.huseyn.mebelsayti.dto.ProductResponseDTO;
import com.huseyn.mebelsayti.entity.Product;
import com.huseyn.mebelsayti.exception.ResourceNotFindException;
import com.huseyn.mebelsayti.mapper.ProductMapper;
import com.huseyn.mebelsayti.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    public ProductResponseDTO saveProduct(ProductRequestDTO dto){
        Product product = productMapper.toEntity(dto);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }
    public List<ProductResponseDTO> getAllProducts(){
        return productRepository.findAll().stream().map(productMapper::toResponseDTO).toList();
    }
    public ProductResponseDTO findById(Long id){
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        return productMapper.toResponseDTO(product);
    }
    public void deleteById(Long id){
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        productRepository.delete(product);
    }
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto){
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFindException("This ID does not exist."));
        product.setName(dto.getName());
        product.setType(dto.getType());
        product.setPrice(dto.getPrice());
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }
}
