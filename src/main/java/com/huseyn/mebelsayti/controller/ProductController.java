package com.huseyn.mebelsayti.controller;

import com.huseyn.mebelsayti.dto.ProductRequestDTO;
import com.huseyn.mebelsayti.dto.ProductResponseDTO;
import com.huseyn.mebelsayti.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @PostMapping
    public ProductResponseDTO saveProduct(@Valid @RequestBody ProductRequestDTO dto){
        return productService.saveProduct(dto);
    }
    @GetMapping
    public List<ProductResponseDTO> getAllProducts(){
        return productService.getAllProducts();
    }
    @GetMapping("/{id}")
    public ProductResponseDTO findById(@PathVariable Long id){
        return productService.findById(id);
    }
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id){
        productService.deleteById(id);
    }
    @PutMapping("/{id}")
    public ProductResponseDTO updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequestDTO dto){
        return productService.updateProduct(id, dto);
    }
}
