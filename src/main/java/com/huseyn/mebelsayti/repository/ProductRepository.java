package com.huseyn.mebelsayti.repository;

import com.huseyn.mebelsayti.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
